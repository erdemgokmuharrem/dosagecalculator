import React from 'react';
import { Text } from 'react-native';
import { render, waitFor, act } from '@testing-library/react-native';
import { AppOpenAd, InterstitialAd } from 'react-native-google-mobile-ads';
import { AdProvider, useAdManager } from '../AdContext';

/**
 * AdContext with configured ad units.
 *
 * Nothing ad-related may happen before the medical disclaimer is accepted; the
 * request options of every ad must carry the consent result; Pro users must
 * never be asked to consent.
 */

jest.mock('react-native-google-mobile-ads', () => {
  const ad = () => ({
    load: jest.fn(),
    show: jest.fn(),
    addAdEventListener: jest.fn(() => jest.fn()),
    loaded: false,
  });
  return {
    __esModule: true,
    AppOpenAd: { createForAdRequest: jest.fn(ad) },
    InterstitialAd: { createForAdRequest: jest.fn(ad) },
    AdEventType: { LOADED: 'loaded', CLOSED: 'closed', ERROR: 'error' },
  };
});

jest.mock('../../config/admob', () => ({
  ADMOB_CONFIG: {
    BANNER_ID: 'banner-id',
    INTERSTITIAL_ID: 'interstitial-id',
    APP_OPEN_ID: 'app-open-id',
  },
}));

const mockSubscription = { isPro: false, isLoading: false };
jest.mock('../SubscriptionContext', () => ({
  useSubscription: () => mockSubscription,
}));

const mockResolveAdConsent = jest.fn();
const mockOpenPrivacyOptions = jest.fn();
jest.mock('../../services/adConsent', () => ({
  resolveAdConsent: () => mockResolveAdConsent(),
  openPrivacyOptions: () => mockOpenPrivacyOptions(),
}));

/** Stands in for the disclaimer: accepts it on mount unless told not to. */
const Disclaimer: React.FC<{ accept: boolean }> = ({ accept }) => {
  const { requestAdConsent } = useAdManager();
  React.useEffect(() => {
    if (accept) requestAdConsent();
  }, [accept, requestAdConsent]);
  return <Text>app</Text>;
};

const renderProvider = (accept = true) =>
  render(
    <AdProvider>
      <Disclaimer accept={accept} />
    </AdProvider>
  );

beforeEach(() => {
  mockSubscription.isPro = false;
  mockSubscription.isLoading = false;
  mockResolveAdConsent.mockResolvedValue({
    canRequestAds: true,
    personalized: false,
  });
});

describe('AdContext consent gating', () => {
  it('requests no consent and creates no ad before the disclaimer is accepted', async () => {
    renderProvider(false);
    await act(async () => {});
    expect(mockResolveAdConsent).not.toHaveBeenCalled();
    expect(InterstitialAd.createForAdRequest).not.toHaveBeenCalled();
    expect(AppOpenAd.createForAdRequest).not.toHaveBeenCalled();
  });

  it('builds personalised requests when every consent allows it', async () => {
    mockResolveAdConsent.mockResolvedValue({
      canRequestAds: true,
      personalized: true,
    });
    renderProvider();
    await waitFor(() =>
      expect(InterstitialAd.createForAdRequest).toHaveBeenCalledWith(
        'interstitial-id',
        { requestNonPersonalizedAdsOnly: false }
      )
    );
    expect(AppOpenAd.createForAdRequest).toHaveBeenCalledWith('app-open-id', {
      requestNonPersonalizedAdsOnly: false,
    });
  });

  it('falls back to non-personalised requests without full consent', async () => {
    renderProvider();
    await waitFor(() =>
      expect(InterstitialAd.createForAdRequest).toHaveBeenCalledWith(
        'interstitial-id',
        { requestNonPersonalizedAdsOnly: true }
      )
    );
  });

  it('creates no ad when consent forbids requesting ads', async () => {
    mockResolveAdConsent.mockResolvedValue({
      canRequestAds: false,
      personalized: false,
    });
    renderProvider();
    await waitFor(() => expect(mockResolveAdConsent).toHaveBeenCalled());
    await act(async () => {});
    expect(InterstitialAd.createForAdRequest).not.toHaveBeenCalled();
    expect(AppOpenAd.createForAdRequest).not.toHaveBeenCalled();
  });

  it('never asks Pro users to consent', async () => {
    mockSubscription.isPro = true;
    renderProvider();
    await act(async () => {});
    expect(mockResolveAdConsent).not.toHaveBeenCalled();
  });

  it('waits for the subscription state before asking', async () => {
    mockSubscription.isLoading = true;
    renderProvider();
    await act(async () => {});
    expect(mockResolveAdConsent).not.toHaveBeenCalled();
  });
});

describe('privacy options', () => {
  it('rebuilds the ads with the choice made in the privacy-options form', async () => {
    mockResolveAdConsent.mockResolvedValue({
      canRequestAds: true,
      personalized: true,
      privacyOptionsRequired: true,
    });
    mockOpenPrivacyOptions.mockResolvedValue({
      canRequestAds: true,
      personalized: false,
      privacyOptionsRequired: true,
    });

    const handle: { open?: () => Promise<void> } = {};
    const SettingsProbe: React.FC = () => {
      handle.open = useAdManager().openPrivacyOptions;
      return null;
    };

    render(
      <AdProvider>
        <Disclaimer accept />
        <SettingsProbe />
      </AdProvider>
    );
    await waitFor(() =>
      expect(InterstitialAd.createForAdRequest).toHaveBeenCalledWith(
        'interstitial-id',
        { requestNonPersonalizedAdsOnly: false }
      )
    );

    await act(async () => {
      await handle.open?.();
    });

    expect(InterstitialAd.createForAdRequest).toHaveBeenLastCalledWith(
      'interstitial-id',
      { requestNonPersonalizedAdsOnly: true }
    );
  });
});
