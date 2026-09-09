import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

/**
 * AdMob unit ids.
 *
 * Real ids come from the environment (see `.env.example`), never from source.
 * The previous version hardcoded production ids and shipped a placeholder
 * (`ca-app-pub-xxxxxxxxxxxxxxxx/appopen_ios`) for the iOS app-open slot, which
 * fails at runtime in release builds.
 *
 * A missing id resolves to `null` and the corresponding ad is simply not shown.
 * Returning a placeholder string would hand the SDK an invalid unit and produce
 * confusing runtime errors instead of an obviously absent ad.
 */

const pick = (ios?: string, android?: string): string | null => {
  const value = Platform.select({ ios, android, default: undefined });
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const env = process.env;

/** Google's test units in development; configured units otherwise. */
export const ADMOB_CONFIG = {
  BANNER_ID: __DEV__
    ? TestIds.BANNER
    : pick(
        env.EXPO_PUBLIC_ADMOB_BANNER_IOS,
        env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID
      ),

  INTERSTITIAL_ID: __DEV__
    ? TestIds.INTERSTITIAL
    : pick(
        env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_IOS,
        env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID
      ),

  APP_OPEN_ID: __DEV__
    ? TestIds.APP_OPEN
    : pick(
        env.EXPO_PUBLIC_ADMOB_APPOPEN_IOS,
        env.EXPO_PUBLIC_ADMOB_APPOPEN_ANDROID
      ),
} as const;

/** True when every production ad unit is configured. Checked at startup. */
export const isAdConfigComplete = (): boolean =>
  Boolean(
    ADMOB_CONFIG.BANNER_ID &&
      ADMOB_CONFIG.INTERSTITIAL_ID &&
      ADMOB_CONFIG.APP_OPEN_ID
  );

/** Names the slots that are missing, for a release-readiness warning. */
export const missingAdUnits = (): string[] =>
  Object.entries(ADMOB_CONFIG)
    .filter(([, value]) => !value)
    .map(([key]) => key);
