import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesPackage,
} from 'react-native-purchases';
import { reportError } from './monitoring';
import { UserSubscription } from '../types';

const SUBSCRIPTION_STORAGE_KEY = '@user_subscription';

/**
 * RevenueCat publishable SDK keys, supplied via the environment.
 *
 * These were previously the literal placeholders `appl_YOUR_APPLE_KEY` /
 * `goog_YOUR_GOOGLE_KEY`, which made `Purchases.configure` throw. The failure
 * was caught and the service silently fell back to AsyncStorage, so purchases
 * appeared "working" in testing while no store transaction ever took place.
 */
const REVENUECAT_APPLE_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY?.trim() || '';
const REVENUECAT_GOOGLE_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY?.trim() || '';
const ENTITLEMENT_ID = 'pro';

/** Maps a store product identifier to the plan type the app understands. */
const toPlan = (productId: string): 'monthly' | 'lifetime' =>
  /lifetime/i.test(productId) ? 'lifetime' : 'monthly';

type Plan = 'monthly' | 'lifetime';

/** Store-formatted prices; null for a plan that cannot be bought right now. */
export interface PlanPrices {
  monthly: string | null;
  lifetime: string | null;
}

const PLAN_PACKAGE: Record<Plan, { type: string; ids: readonly string[] }> = {
  monthly: { type: 'MONTHLY', ids: ['$rc_monthly', 'monthly'] },
  lifetime: { type: 'LIFETIME', ids: ['$rc_lifetime', 'lifetime'] },
};

/**
 * The offering's package for a plan, matched by RevenueCat's predefined package
 * type or by its standard or custom identifier. Undefined when there is none.
 */
const findPackage = (
  packages: readonly PurchasesPackage[],
  plan: Plan
): PurchasesPackage | undefined => {
  const { type, ids } = PLAN_PACKAGE[plan];
  return packages.find(
    p => String(p.packageType) === type || ids.includes(p.identifier)
  );
};

/** True once the RevenueCat SDK has been configured with a real key. */
export const isPurchasesConfigured = (): boolean =>
  Boolean(Platform.OS === 'ios' ? REVENUECAT_APPLE_KEY : REVENUECAT_GOOGLE_KEY);

// Local storage fallback for dev/offline
const DEFAULT_SUBSCRIPTION: UserSubscription = {
  isPro: false,
};

class SubscriptionService {
  private subscription: UserSubscription = DEFAULT_SUBSCRIPTION;
  private listeners: Array<(sub: UserSubscription) => void> = [];

  async initialize(): Promise<void> {
    const apiKey =
      Platform.OS === 'ios' ? REVENUECAT_APPLE_KEY : REVENUECAT_GOOGLE_KEY;

    if (!apiKey) {
      // No key configured: stay on the free tier rather than pretending the
      // store is reachable. `getPlanPrices()` then returns no prices, so the
      // paywall shows none and cannot start a purchase.
      if (__DEV__) {
        console.warn(
          '[subscription] RevenueCat key missing — in-app purchases are DISABLED. ' +
            'Set EXPO_PUBLIC_REVENUECAT_IOS_KEY / _ANDROID_KEY before building a release.'
        );
      }
      this.subscription = DEFAULT_SUBSCRIPTION;
      return;
    }

    try {
      Purchases.configure({ apiKey });

      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      const customerInfo = await Purchases.getCustomerInfo();
      this.updateStatusFromCustomerInfo(customerInfo);

      // Listen for changes
      Purchases.addCustomerInfoUpdateListener(info => {
        this.updateStatusFromCustomerInfo(info);
      });
    } catch (error) {
      console.warn(
        'RevenueCat init error. Using local storage fallback.',
        error
      );
      // Fallback logic
      const stored = await AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (stored) {
        this.subscription = JSON.parse(stored);
      }
    }
  }

  private updateStatusFromCustomerInfo(customerInfo: CustomerInfo) {
    if (
      typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined'
    ) {
      this.subscription = {
        isPro: true,
        plan: toPlan(
          customerInfo.entitlements.active[ENTITLEMENT_ID].productIdentifier
        ),
        purchasedAt: new Date(
          customerInfo.entitlements.active[ENTITLEMENT_ID].latestPurchaseDate
        ),
      };
    } else {
      this.subscription = DEFAULT_SUBSCRIPTION;
    }
    this.saveSubscription();
    this.notifyListeners();
  }

  getSubscription(): UserSubscription {
    return this.subscription;
  }

  isPro(): boolean {
    return this.subscription.isPro;
  }

  async purchaseMonthly(): Promise<{ success: boolean; error?: string }> {
    return this.purchasePlan('monthly');
  }

  async purchaseLifetime(): Promise<{ success: boolean; error?: string }> {
    return this.purchasePlan('lifetime');
  }

  /**
   * Prices for the paywall, formatted by the store for the user's storefront.
   * App Review compares them with the payment sheet, so they must never come
   * from the app's own strings.
   */
  async getPlanPrices(): Promise<PlanPrices> {
    const none: PlanPrices = { monthly: null, lifetime: null };
    if (!isPurchasesConfigured()) return none;
    try {
      const offerings = await Purchases.getOfferings();
      const packages = offerings.current?.availablePackages ?? [];
      return {
        monthly: findPackage(packages, 'monthly')?.product.priceString ?? null,
        lifetime:
          findPackage(packages, 'lifetime')?.product.priceString ?? null,
      };
    } catch (error) {
      reportError(error, { area: 'prices' });
      return none;
    }
  }

  private async purchasePlan(
    plan: Plan
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const offerings = await Purchases.getOfferings();
      const pkg = findPackage(offerings.current?.availablePackages ?? [], plan);
      // Never substitute another package. This used to fall back to the first
      // package whenever the identifier did not match — and RevenueCat's
      // standard identifiers ($rc_monthly, $rc_lifetime) never matched, so
      // choosing "lifetime" could charge for the monthly subscription.
      if (!pkg) {
        return { success: false, error: 'subscription.errors.noPackages' };
      }

      const { customerInfo } = await Purchases.purchasePackage(pkg);
      this.updateStatusFromCustomerInfo(customerInfo);

      return { success: true };
    } catch (error: unknown) {
      if (!(error as { userCancelled?: boolean }).userCancelled) {
        reportError(error, { area: 'purchase' });
        return { success: false, error: 'subscription.errors.failed' };
      }
      return { success: false, error: 'subscription.errors.cancelled' };
    }
  }

  async restorePurchases(): Promise<{ success: boolean; error?: string }> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      if (
        typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined'
      ) {
        this.updateStatusFromCustomerInfo(customerInfo);
        return { success: true };
      } else {
        return {
          success: false,
          error: 'subscription.errors.nothingToRestore',
        };
      }
    } catch (error: unknown) {
      reportError(error, { area: 'restore' });
      return { success: false, error: 'errors.restoreError' };
    }
  }

  private async saveSubscription(): Promise<void> {
    await AsyncStorage.setItem(
      SUBSCRIPTION_STORAGE_KEY,
      JSON.stringify(this.subscription)
    );
  }

  subscribe(listener: (sub: UserSubscription) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(l => l(this.subscription));
  }

  // Dev-only: unlock pro for testing
  async devUnlockPro(): Promise<void> {
    const newSub: UserSubscription = {
      isPro: true,
      plan: 'lifetime',
      purchasedAt: new Date(),
    };
    this.subscription = newSub;
    await this.saveSubscription();
    this.notifyListeners();
  }

  // Dev-only: reset to free
  async devResetToFree(): Promise<void> {
    this.subscription = DEFAULT_SUBSCRIPTION;
    await this.saveSubscription();
    this.notifyListeners();
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;
