import React from 'react';
import { Linking } from 'react-native';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SubscriptionScreen from '../SubscriptionScreen';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { LINKS } from '../../config/links';
import i18n from '../../locales/i18n';

/**
 * The paywall is what App Review scrutinises most (Guideline 3.1.2): the price
 * must be the store's price for the user's storefront, the renewal terms must
 * be stated, and the terms of use and privacy policy must be linked. Prices
 * used to be hardcoded per language and neither link existed.
 */

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: jest.fn(), navigate: jest.fn() }),
}));

type Result = { success: boolean; error?: string };
const mockSub = {
  subscription: { isPro: false },
  isPro: false,
  isLoading: false,
  purchaseMonthly: jest.fn<Promise<Result>, []>(),
  purchaseLifetime: jest.fn<Promise<Result>, []>(),
  restorePurchases: jest.fn<Promise<Result>, []>(),
};
jest.mock('../../contexts/SubscriptionContext', () => ({
  useSubscription: () => mockSub,
}));

const mockGetPlanPrices = jest.fn();
jest.mock('../../services/subscription', () => ({
  subscriptionService: { getPlanPrices: () => mockGetPlanPrices() },
}));

const renderScreen = () =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 47, left: 0, right: 0, bottom: 34 },
      }}
    >
      <ThemeProvider>
        <SubscriptionScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );

const cancelled = { success: false, error: 'subscription.errors.cancelled' };

beforeAll(async () => {
  await i18n.changeLanguage('tr');
});

beforeEach(() => {
  mockSub.purchaseMonthly.mockReset().mockResolvedValue(cancelled);
  mockSub.purchaseLifetime.mockReset().mockResolvedValue(cancelled);
  mockSub.restorePurchases.mockReset().mockResolvedValue({
    success: false,
    error: 'subscription.errors.nothingToRestore',
  });
  mockGetPlanPrices.mockResolvedValue({
    monthly: '₺129,99',
    lifetime: '₺799,99',
  });
});

describe('SubscriptionScreen — prices', () => {
  it('shows the store prices', async () => {
    renderScreen();
    expect(
      await screen.findByText(
        i18n.t('subscription.monthlyPriceFormat', { price: '₺129,99' })
      )
    ).toBeTruthy();
    expect(screen.getByText('₺799,99')).toBeTruthy();
  });

  it('keeps no hardcoded price in any language', () => {
    for (const lang of ['tr', 'en', 'de', 'ru', 'zh']) {
      const strings = Object.values(
        require(`../../locales/${lang}.json`).subscription
      ).filter((v): v is string => typeof v === 'string');
      const priced = strings.filter(v => /[₺$€₽¥£]\s?\d|\d\s?[₺$€₽¥£]/.test(v));
      expect({ lang, priced }).toEqual({ lang, priced: [] });
    }
  });

  it('cannot start a purchase whose price the store did not provide', async () => {
    mockGetPlanPrices.mockResolvedValue({ monthly: null, lifetime: null });
    renderScreen();
    expect(
      await screen.findAllByText(i18n.t('subscription.priceUnavailable'))
    ).toHaveLength(2);
    fireEvent.press(screen.getByText(i18n.t('subscription.subscribe')));
    expect(mockSub.purchaseMonthly).not.toHaveBeenCalled();
  });

  it('buys the plan the user selected', async () => {
    renderScreen();
    await screen.findByText('₺799,99');
    fireEvent.press(
      screen.getByText(i18n.t('subscription.lifetime').toUpperCase())
    );
    fireEvent.press(
      screen.getByText(`${i18n.t('subscription.buyLifetime')} — ₺799,99`)
    );
    await waitFor(() =>
      expect(mockSub.purchaseLifetime).toHaveBeenCalledTimes(1)
    );
    expect(mockSub.purchaseMonthly).not.toHaveBeenCalled();
  });
});

describe('SubscriptionScreen — disclosures', () => {
  it('states the renewal terms and links the terms of use and privacy policy', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    renderScreen();
    await screen.findByText('₺799,99');
    expect(
      screen.getByText(i18n.t('subscription.autoRenewDisclosure'))
    ).toBeTruthy();
    fireEvent.press(screen.getByText(i18n.t('settings.terms')));
    fireEvent.press(screen.getByText(i18n.t('settings.privacy')));
    expect(open).toHaveBeenCalledWith(LINKS.terms);
    expect(open).toHaveBeenCalledWith(LINKS.privacyPolicy);
    open.mockRestore();
  });

  it('offers to restore purchases', async () => {
    renderScreen();
    await screen.findByText('₺799,99');
    fireEvent.press(screen.getByText(i18n.t('subscription.restorePurchase')));
    await waitFor(() =>
      expect(mockSub.restorePurchases).toHaveBeenCalledTimes(1)
    );
  });
});
