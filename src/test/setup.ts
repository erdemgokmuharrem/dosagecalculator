/**
 * Jest setup.
 *
 * Only mock modules this project actually depends on. A mock for a package that
 * is not installed makes every suite fail to run with a confusing resolver error
 * rather than a useful test failure.
 */

// Persisted Zustand state and the i18n language preference both go through AsyncStorage.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Ads: no native bridge under test. Keep the surface identical to the real module.
jest.mock('react-native-google-mobile-ads', () => {
  const createAd = () => ({
    load: jest.fn(),
    show: jest.fn(),
    addAdEventListener: jest.fn(() => jest.fn()),
    loaded: false,
  });
  return {
    __esModule: true,
    default: () => ({ initialize: jest.fn().mockResolvedValue([]) }),
    BannerAd: 'BannerAd',
    BannerAdSize: { ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER' },
    InterstitialAd: { createForAdRequest: createAd },
    AppOpenAd: { createForAdRequest: createAd },
    AdEventType: { LOADED: 'loaded', CLOSED: 'closed', ERROR: 'error' },
    TestIds: {
      BANNER: 'test-banner',
      INTERSTITIAL: 'test-interstitial',
      APP_OPEN: 'test-app-open',
    },
    MaxAdContentRating: { G: 'G', PG: 'PG', T: 'T', MA: 'MA' },
    AdsConsent: {
      showPrivacyOptionsForm: jest.fn().mockResolvedValue({}),
      gatherConsent: jest.fn().mockResolvedValue({
        status: 'NOT_REQUIRED',
        canRequestAds: true,
        isConsentFormAvailable: false,
      }),
      getUserChoices: jest.fn().mockResolvedValue({
        selectPersonalisedAds: false,
        storeAndAccessInformationOnDevice: false,
      }),
    },
    AdsConsentPrivacyOptionsRequirementStatus: {
      UNKNOWN: 'UNKNOWN',
      REQUIRED: 'REQUIRED',
      NOT_REQUIRED: 'NOT_REQUIRED',
    },
    AdsConsentStatus: {
      UNKNOWN: 'UNKNOWN',
      REQUIRED: 'REQUIRED',
      NOT_REQUIRED: 'NOT_REQUIRED',
      OBTAINED: 'OBTAINED',
    },
  };
});

// In-app purchases.
jest.mock('react-native-purchases', () => ({
  __esModule: true,
  default: {
    configure: jest.fn(),
    setLogLevel: jest.fn(),
    getCustomerInfo: jest
      .fn()
      .mockResolvedValue({ entitlements: { active: {} } }),
    getOfferings: jest.fn().mockResolvedValue({ current: null }),
    purchasePackage: jest.fn(),
    restorePurchases: jest
      .fn()
      .mockResolvedValue({ entitlements: { active: {} } }),
    addCustomerInfoUpdateListener: jest.fn(),
  },
  LOG_LEVEL: { DEBUG: 'DEBUG', ERROR: 'ERROR' },
}));

// Crash reporting must never fire during tests.
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setTag: jest.fn(),
  setUser: jest.fn(),
  addBreadcrumb: jest.fn(),
  wrap: (component: unknown) => component,
  reactNavigationIntegration: jest.fn(() => ({ name: 'ReactNavigation' })),
  ErrorBoundary: 'SentryErrorBoundary',
}));

// App Tracking Transparency (iOS).
jest.mock('expo-tracking-transparency', () => ({
  requestTrackingPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: 'granted' }),
  getTrackingPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: 'undetermined' }),
}));

// Reanimated ships its own Jest mock; the layout-animation warning is noise.
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Silence the New Architecture "not implemented" notice from the JSDOM shim.
jest.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
  const first = String(args[0] ?? '');
  if (first.includes('useNativeDriver') || first.includes('NativeEventEmitter'))
    return;

  console.info(...args);
});
