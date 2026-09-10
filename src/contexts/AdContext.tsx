import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import { AppState } from 'react-native';
import {
  AppOpenAd,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { useSubscription } from './SubscriptionContext';
import { ADMOB_CONFIG } from '../config/admob';

/**
 * Ad objects exist only for slots with a configured unit id.
 *
 * The SDK throws when the unit id is not a string, and ADMOB_CONFIG resolves to
 * null for every slot in a release build without the EXPO_PUBLIC_ADMOB_*
 * variables. These used to be created unconditionally at module scope behind an
 * `as string` cast, so merely importing this file crashed the app at launch.
 */
const appOpenAd = ADMOB_CONFIG.APP_OPEN_ID
  ? AppOpenAd.createForAdRequest(ADMOB_CONFIG.APP_OPEN_ID, {
      requestNonPersonalizedAdsOnly: true,
    })
  : null;
const interstitialAd = ADMOB_CONFIG.INTERSTITIAL_ID
  ? InterstitialAd.createForAdRequest(ADMOB_CONFIG.INTERSTITIAL_ID, {
      requestNonPersonalizedAdsOnly: true,
    })
  : null;

interface AdContextType {
  showInterstitialAd: (callback?: () => void) => void;
}

const AdContext = createContext<AdContextType>({
  showInterstitialAd: cb => {
    if (cb) cb();
  },
});

export const useAdManager = () => useContext(AdContext);

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isPro } = useSubscription();
  const [appOpenLoaded, setAppOpenLoaded] = useState(false);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  // Track how many actions have occurred to show ad periodically
  const actionCountRef = useRef(0);

  // App Open Ad Event Listeners
  useEffect(() => {
    if (isPro || !appOpenAd) return;

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
    };
  }, [isPro]);

  // Interstitial Ad Event Listeners
  useEffect(() => {
    if (isPro || !interstitialAd) return;

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
    };
  }, [isPro]);

  // AppState listener for App Open Ads
  useEffect(() => {
    if (isPro || !appOpenAd) return;

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
  }, [isPro, appOpenLoaded]);

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
    [isPro, interstitialLoaded]
  );

  return (
    <AdContext.Provider value={{ showInterstitialAd }}>
      {children}
    </AdContext.Provider>
  );
};
