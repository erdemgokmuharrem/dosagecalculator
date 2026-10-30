import { Alert, Linking, Platform } from 'react-native';

/**
 * Public addresses reachable from Settings.
 *
 * App Review opens the privacy policy (Guideline 5.1.1) and the support contact
 * (1.5). These used to be shown as plain text in an Alert, and the domain did
 * not exist (NXDOMAIN) when checked on 2026-09-11. `npm run check:release`
 * blocks while any host here does not resolve.
 */
export const LINKS = {
  privacyPolicy:
    'https://erdemgokmuharrem.github.io/dosagecalculator/privacy.html',
  terms: 'https://erdemgokmuharrem.github.io/dosagecalculator/terms.html',
  supportEmail: 'erdemmgokmuharrem@gmail.com',
  feedbackEmail: 'erdemmgokmuharrem@gmail.com',
} as const;

const ANDROID_PACKAGE = 'com.dosagecalculator.app';
const APP_STORE_ID = process.env.EXPO_PUBLIC_APP_STORE_ID || null;

/**
 * The store page for writing a review, or null on iOS until the numeric App
 * Store id is known (it exists only once the app is created in App Store
 * Connect).
 */
export const storeReviewUrl = (): string | null => {
  if (Platform.OS === 'android') {
    return `market://details?id=${ANDROID_PACKAGE}`;
  }
  if (Platform.OS === 'ios' && APP_STORE_ID) {
    return `itms-apps://itunes.apple.com/app/id${APP_STORE_ID}?action=write-review`;
  }
  return null;
};

export const mailto = (address: string) => `mailto:${address}`;

/**
 * Opens a link. If nothing on the device can handle it (no mail account, no
 * store app), shows the address instead so it can still be copied.
 */
export const openLink = async (
  url: string,
  title: string,
  shown: string = url
): Promise<void> => {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(title, shown);
  }
};
