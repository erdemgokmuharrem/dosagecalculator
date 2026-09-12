/**
 * Package selection and store prices.
 *
 * A purchase used to fall back to the offering's first package whenever the
 * requested identifier did not match — and RevenueCat's standard identifiers
 * ($rc_monthly, $rc_lifetime) never matched "monthly"/"lifetime". Choosing
 * "lifetime" could therefore charge for the monthly subscription.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../monitoring', () => ({ reportError: jest.fn() }));

type Pkg = {
  identifier: string;
  packageType: string;
  product: { identifier: string; priceString: string };
};
const pkg = (identifier: string, packageType: string, price: string): Pkg => ({
  identifier,
  packageType,
  product: { identifier: `dozi.${identifier}`, priceString: price },
});
const MONTHLY = pkg('$rc_monthly', 'MONTHLY', '₺129,99');
const LIFETIME = pkg('$rc_lifetime', 'LIFETIME', '₺799,99');

type Purchases = {
  configure: jest.Mock;
  getCustomerInfo: jest.Mock;
  getOfferings: jest.Mock;
  purchasePackage: jest.Mock;
};

/** Loads the service and its RevenueCat mock from one fresh module registry. */
const load = (env: Record<string, string | undefined> = {}) => {
  const saved = { ...process.env };
  Object.assign(process.env, env);
  let loaded!: {
    service: typeof import('../subscription').subscriptionService;
    Purchases: Purchases;
  };
  jest.isolateModules(() => {
    loaded = {
      Purchases: require('react-native-purchases').default,
      service: require('../subscription').subscriptionService,
    };
  });
  process.env = saved;
  loaded.Purchases.purchasePackage.mockResolvedValue({
    customerInfo: { entitlements: { active: {} } },
  });
  return loaded;
};

const offer = (P: Purchases, ...packages: Pkg[]) =>
  P.getOfferings.mockResolvedValue({
    current: { availablePackages: packages },
  });

describe('purchasing a plan', () => {
  it('buys the lifetime package when lifetime is chosen', async () => {
    const { service, Purchases } = load();
    offer(Purchases, MONTHLY, LIFETIME);
    await expect(service.purchaseLifetime()).resolves.toEqual({
      success: true,
    });
    expect(Purchases.purchasePackage).toHaveBeenCalledWith(LIFETIME);
  });

  it('buys the monthly package when monthly is chosen', async () => {
    const { service, Purchases } = load();
    offer(Purchases, LIFETIME, MONTHLY);
    await service.purchaseMonthly();
    expect(Purchases.purchasePackage).toHaveBeenCalledWith(MONTHLY);
  });

  it('still matches custom package identifiers', async () => {
    const { service, Purchases } = load();
    const custom = pkg('lifetime', 'CUSTOM', '₺799,99');
    offer(Purchases, MONTHLY, custom);
    await service.purchaseLifetime();
    expect(Purchases.purchasePackage).toHaveBeenCalledWith(custom);
  });

  it('never substitutes another package when the chosen one is missing', async () => {
    const { service, Purchases } = load();
    offer(Purchases, MONTHLY);
    await expect(service.purchaseLifetime()).resolves.toEqual({
      success: false,
      error: 'subscription.errors.noPackages',
    });
    expect(Purchases.purchasePackage).not.toHaveBeenCalled();
  });

  it('reports a cancelled purchase as cancelled, not as an error', async () => {
    const { service, Purchases } = load();
    offer(Purchases, MONTHLY);
    Purchases.purchasePackage.mockRejectedValue({ userCancelled: true });
    await expect(service.purchaseMonthly()).resolves.toEqual({
      success: false,
      error: 'subscription.errors.cancelled',
    });
  });
});

describe('store prices', () => {
  it('returns no prices, and does not call the store, without a RevenueCat key', async () => {
    const { service, Purchases } = load({
      EXPO_PUBLIC_REVENUECAT_IOS_KEY: '',
      EXPO_PUBLIC_REVENUECAT_ANDROID_KEY: '',
    });
    offer(Purchases, MONTHLY, LIFETIME);
    await expect(service.getPlanPrices()).resolves.toEqual({
      monthly: null,
      lifetime: null,
    });
    expect(Purchases.getOfferings).not.toHaveBeenCalled();
  });

  it('returns the store-formatted price of each plan', async () => {
    const { service, Purchases } = load({
      EXPO_PUBLIC_REVENUECAT_IOS_KEY: 'appl_test',
      EXPO_PUBLIC_REVENUECAT_ANDROID_KEY: 'goog_test',
    });
    offer(Purchases, MONTHLY, LIFETIME);
    await expect(service.getPlanPrices()).resolves.toEqual({
      monthly: '₺129,99',
      lifetime: '₺799,99',
    });
  });

  it('returns null for a plan the offering lacks', async () => {
    const { service, Purchases } = load({
      EXPO_PUBLIC_REVENUECAT_IOS_KEY: 'appl_test',
      EXPO_PUBLIC_REVENUECAT_ANDROID_KEY: 'goog_test',
    });
    offer(Purchases, MONTHLY);
    await expect(service.getPlanPrices()).resolves.toEqual({
      monthly: '₺129,99',
      lifetime: null,
    });
  });
});

describe('entitlement source', () => {
  it('stays free when the store cannot be reached, whatever the device holds', async () => {
    // The entitlement used to be read back from the app's own AsyncStorage
    // whenever RevenueCat failed to start, so editing that file granted Pro.
    await AsyncStorage.setItem(
      '@user_subscription',
      JSON.stringify({ isPro: true, plan: 'lifetime' })
    );
    const { service, Purchases } = load({
      EXPO_PUBLIC_REVENUECAT_IOS_KEY: 'appl_test',
      EXPO_PUBLIC_REVENUECAT_ANDROID_KEY: 'goog_test',
    });
    Purchases.configure.mockImplementation(() => {
      throw new Error('invalid key');
    });

    await service.initialize();

    expect(service.isPro()).toBe(false);
    expect(service.getSubscription()).toEqual({ isPro: false });
  });

  it('grants Pro from the store entitlement', async () => {
    const { service, Purchases } = load({
      EXPO_PUBLIC_REVENUECAT_IOS_KEY: 'appl_test',
      EXPO_PUBLIC_REVENUECAT_ANDROID_KEY: 'goog_test',
    });
    Purchases.getCustomerInfo.mockResolvedValue({
      entitlements: {
        active: {
          pro: {
            productIdentifier: 'dozi.lifetime',
            latestPurchaseDate: '2026-01-02T03:04:05Z',
          },
        },
      },
    });

    await service.initialize();

    expect(service.isPro()).toBe(true);
    expect(service.getSubscription().plan).toBe('lifetime');
  });

  it('writes no entitlement copy of its own to the device', async () => {
    await AsyncStorage.removeItem('@user_subscription');
    const { service, Purchases } = load({
      EXPO_PUBLIC_REVENUECAT_IOS_KEY: 'appl_test',
      EXPO_PUBLIC_REVENUECAT_ANDROID_KEY: 'goog_test',
    });
    Purchases.getCustomerInfo.mockResolvedValue({
      entitlements: {
        active: {
          pro: {
            productIdentifier: 'dozi.monthly',
            latestPurchaseDate: '2026-01-02T03:04:05Z',
          },
        },
      },
    });

    await service.initialize();

    expect(await AsyncStorage.getItem('@user_subscription')).toBeNull();
  });
});
