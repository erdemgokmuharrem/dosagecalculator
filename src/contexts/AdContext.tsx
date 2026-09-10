import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';
import {
  AppOpenAd,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { useSubscription } from './SubscriptionContext';
import { ADMOB_CONFIG } from '../config/admob';
import {
  openPrivacyOptions as showPrivacyOptionsForm,
  resolveAdConsent,
  type AdConsentResult,
} from '../services/adConsent';

/**
 * Ads and advertising consent.
 *
 * Nothing ad-related happens until the clinician has accepted the medical
 * disclaimer. Only then is consent gathered (Google UMP, then App Tracking
 * Transparency on iOS) and the SDK initialised. Ads are requested personalised
 * only when every applicable consent allows it, otherwise non-personalised.
 * Pro users never see ads and are never asked to consent.
 *
 * Ad objects are built from the consent result rather than at module scope, so
 * their request options carry the user's actual choice. They are built only for
 * slots with a configured unit id: the SDK throws on a non-string id, which is
 * what previously left release builds on a blank white screen at launch.
 */

interface AdContextType {
  showInterstitialAd: (callback?: () => void) => void;
  /** Call once the medical disclaimer has been accepted. */
  requestAdConsent: () => void;
  /** Shows UMP's privacy-options form and applies the new choice. */
  openPrivacyOptions: () => Promise<void>;
  /** Null until consent has resolved. No ad may be requested before then. */
  consent: AdConsentResult | null;
}

const AdContext = createContext<AdContextType>({
  showInterstitialAd: cb => {
    if (cb) cb();
  },
  requestAdConsent: () => undefined,
  openPrivacyOptions: async () => undefined,
  consent: null,
});

export const useAdManager = () => useContext(AdContext);

/** Request options for every ad slot, derived from the consent result. */
export const adRequestOptions = (consent: AdConsentResult) => ({
  requestNonPersonalizedAdsOnly: !consent.personalized,
});

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isPro, isLoading } = useSubscription();
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [consent, setConsent] = useState<AdConsentResult | null>(null);
  const [appOpenLoaded, setAppOpenLoaded] = useState(false);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  // Track how many actions have occurred to show ad periodically
  const actionCountRef = useRef(0);

  const requestAdConsent = useCallback(() => setDisclaimerAccepted(true), []);

  // Lets the user revisit their consent (required by UMP in the EEA/UK). The new
  // result replaces the old one, which rebuilds the ads with the new options.
  const openPrivacyOptions = useCallback(async () => {
    setConsent(await showPrivacyOptionsForm());
  }, []);

  // Consent runs after the disclaimer, once the subscription state is known,
  // and never for Pro users: requesting a tracking permission that is never
  // used is exactly what App Review objects to.
  useEffect(() => {
    if (!disclaimerAccepted || isLoading || isPro || consent) return;
    let cancelled = false;
    resolveAdConsent()
      .then(result => {
        if (!cancelled) setConsent(result);
      })
      .catch(() => {
        // resolveAdConsent handles its own failures; nothing else to do.
      });
    return () => {
      cancelled = true;
    };
  }, [disclaimerAccepted, isLoading, isPro, consent]);

  const adsAllowed = !isPro && consent?.canRequestAds === true;

  const appOpenAd = useMemo(
    () =>
      adsAllowed && consent && ADMOB_CONFIG.APP_OPEN_ID
        ? AppOpenAd.createForAdRequest(
            ADMOB_CONFIG.APP_OPEN_ID,
            adRequestOptions(consent)
          )
        : null,
    [adsAllowed, consent]
  );

  const interstitialAd = useMemo(
    () =>
      adsAllowed && consent && ADMOB_CONFIG.INTERSTITIAL_ID
        ? InterstitialAd.createForAdRequest(
            ADMOB_CONFIG.INTERSTITIAL_ID,
            adRequestOptions(consent)
          )
        : null,
    [adsAllowed, consent]
  );

  // App Open Ad Event Listeners
  useEffect(() => {
    if (!appOpenAd) return;

    const unsubscribeLoaded = appOpenAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setAppOpenLoaded(true);
      }
    );

    const unsubscribeClosed = appOpenAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setAppOpenLoaded(false);
        appOpenAd.load();
      }
    );

    const unsubscribeError = appOpenAd.addAdEventListener(
      AdEventType.ERROR,
      error => {
        if (__DEV__) console.warn('App Open Ad Error:', error);
        setAppOpenLoaded(false);
      }
    );

    appOpenAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
      setAppOpenLoaded(false);
    };
  }, [appOpenAd]);

  // Interstitial Ad Event Listeners
  useEffect(() => {
    if (!interstitialAd) return;

    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setInterstitialLoaded(true);
      }
    );

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setInterstitialLoaded(false);
        interstitialAd.load();
      }
    );

    const unsubscribeError = interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      error => {
        if (__DEV__) console.warn('Interstitial Ad Error:', error);
        setInterstitialLoaded(false);
      }
    );

    interstitialAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
      setInterstitialLoaded(false);
    };
  }, [interstitialAd]);

  // AppState listener for App Open Ads
  useEffect(() => {
    if (!appOpenAd) return;

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && appOpenLoaded) {
        try {
          appOpenAd.show();
        } catch (e) {
          if (__DEV__) console.warn('Failed to show App Open ad:', e);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [appOpenAd, appOpenLoaded]);

  // Function to show interstitial ad (e.g. every 3 actions)
  const showInterstitialAd = useCallback(
    (callback?: () => void) => {
      if (isPro) {
        if (callback) callback();
        return;
      }

      actionCountRef.current += 1;

      // Show ad every 3 actions
      if (
        actionCountRef.current % 3 === 0 &&
        interstitialLoaded &&
        interstitialAd
      ) {
        let callbackCalled = false;
        const safeCallback = () => {
          if (!callbackCalled && callback) {
            callbackCalled = true;
            callback();
          }
        };

        const unsubscribe = interstitialAd.addAdEventListener(
          AdEventType.CLOSED,
          () => {
            unsubscribe();
            safeCallback();
          }
        );

        try {
          interstitialAd.show();
          // Fallback in case closed event doesn't fire
          setTimeout(() => {
            unsubscribe();
            safeCallback();
          }, 10000);
        } catch {
          unsubscribe();
          safeCallback();
        }
      } else {
        if (callback) callback();
      }
    },
    [isPro, interstitialLoaded, interstitialAd]
  );

  const value = useMemo(
    () => ({
      showInterstitialAd,
      requestAdConsent,
      openPrivacyOptions,
      consent,
    }),
    [showInterstitialAd, requestAdConsent, openPrivacyOptions, consent]
  );

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
};
