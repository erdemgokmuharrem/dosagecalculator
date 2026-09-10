import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

/**
 * AdContext used to create its ad objects at module scope:
 *
 *   InterstitialAd.createForAdRequest(ADMOB_CONFIG.INTERSTITIAL_ID as string, …)
 *
 * The ad SDK throws when the unit id is not a string, and ADMOB_CONFIG resolves
 * to null in any release build without the EXPO_PUBLIC_ADMOB_* variables. The
 * `as string` cast hid that, so importing this module crashed the app at launch
 * before the first frame rendered.
 */

jest.mock('react-native-google-mobile-ads', () => {
  const make = (name: string) => ({
    createForAdRequest: jest.fn((adUnitId: unknown) => {
      // Mirrors the SDK (lib/module/ads/InterstitialAd.js, AppOpenAd.js).
      if (typeof adUnitId !== 'string') {
        throw new Error(
          `${name}.createForAdRequest(*) 'adUnitId' expected an string value.`
        );
      }
      return {
        load: jest.fn(),
        show: jest.fn(),
        addAdEventListener: jest.fn(() => jest.fn()),
        loaded: false,
      };
    }),
  });
  return {
    __esModule: true,
    AppOpenAd: make('AppOpenAd'),
    InterstitialAd: make('InterstitialAd'),
    AdEventType: { LOADED: 'loaded', CLOSED: 'closed', ERROR: 'error' },
    TestIds: { BANNER: 'test', INTERSTITIAL: 'test', APP_OPEN: 'test' },
  };
});

// A release build with no EXPO_PUBLIC_ADMOB_* variables set.
jest.mock('../../config/admob', () => ({
  ADMOB_CONFIG: { BANNER_ID: null, INTERSTITIAL_ID: null, APP_OPEN_ID: null },
}));

jest.mock('../SubscriptionContext', () => ({
  useSubscription: () => ({ isPro: false }),
}));

describe('AdContext without configured ad units', () => {
  it('can be imported — it used to throw at module scope and crash the app at launch', () => {
    expect(() => require('../AdContext')).not.toThrow();
  });

  it('still runs the continuation every time when no interstitial is available', () => {
    const { AdProvider, useAdManager } = require('../AdContext');
    const continuation = jest.fn();

    const Trigger: React.FC = () => {
      const { showInterstitialAd } = useAdManager();
      React.useEffect(() => {
        // Every third action would normally show an ad.
        for (let i = 0; i < 3; i++) showInterstitialAd(continuation);
      }, [showInterstitialAd]);
      return <Text>ok</Text>;
    };

    render(
      <AdProvider>
        <Trigger />
      </AdProvider>
    );

    // The ad gates navigation to the drug monograph; with no ad available the
    // user must still get there on every tap.
    expect(continuation).toHaveBeenCalledTimes(3);
  });
});
