import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mobileAds, {
  AdsConsent,
  AdsConsentPrivacyOptionsRequirementStatus,
  AdsConsentStatus,
} from 'react-native-google-mobile-ads';
import * as TrackingTransparency from 'expo-tracking-transparency';
import { reportError } from './monitoring';

/**
 * Advertising consent.
 *
 * Ads are requested personalised only when every applicable consent allows it:
 *
 *  - Google UMP (GDPR/UK and similar regimes). Outside regulated regions UMP
 *    reports NOT_REQUIRED; inside them the user's recorded choices must permit
 *    personalised ads and storing information on the device.
 *  - App Tracking Transparency, on iOS only.
 *
 * Anything that cannot be established falls back to non-personalised ads, which
 * need neither consent. This flow never blocks the clinical UI.
 *
 * Order follows Google's guidance: UMP first, then ATT, then SDK initialisation,
 * then ad requests. The caller starts it only after the medical disclaimer has
 * been accepted, so the tracking prompt never opens on top of the disclaimer.
 */

export interface AdConsentResult {
  /** UMP allows an ad request of any kind. */
  canRequestAds: boolean;
  /** Every applicable consent allows personalised ads. */
  personalized: boolean;
  /**
   * UMP requires an in-app way to revisit consent (EEA/UK). Settings shows a
   * privacy-options entry point while this is true.
   */
  privacyOptionsRequired: boolean;
}

/**
 * Local record of the last consent run.
 *
 * Holds no identifiers — only statuses and, if UMP failed, its error message —
 * so support and QA can see why ads are or are not personalised on a device
 * without a debugger attached. Release builds log nothing to the console and
 * report to Sentry only when a DSN is configured; without this record a failed
 * consent flow is invisible.
 */
export const AD_CONSENT_STATE_KEY = '@ad_consent_state';

export interface AdConsentDiagnostics {
  umpStatus: string;
  umpError: string | null;
  /** Whether the ATT step ran (it only runs when UMP allows personalisation). */
  trackingChecked: boolean;
  trackingAllowed: boolean;
  result: AdConsentResult;
  at: string;
}

const describeError = (error: unknown): string =>
  (error instanceof Error ? error.message : String(error)).slice(0, 200);

const umpAllowsPersonalization = async (
  status: AdsConsentStatus
): Promise<boolean> => {
  if (status === AdsConsentStatus.NOT_REQUIRED) return true;
  if (status !== AdsConsentStatus.OBTAINED) return false;
  const choices = await AdsConsent.getUserChoices();
  // Personalised ads need the ad-personalisation purpose and device storage.
  return Boolean(
    choices.selectPersonalisedAds && choices.storeAndAccessInformationOnDevice
  );
};

/** App Tracking Transparency: asks only while undetermined, iOS only. */
const askTracking = async (): Promise<boolean> => {
  if (Platform.OS !== 'ios') return true;
  const current = await TrackingTransparency.getTrackingPermissionsAsync();
  if (current.status !== 'undetermined') return current.status === 'granted';
  const answer = await TrackingTransparency.requestTrackingPermissionsAsync();
  return answer.status === 'granted';
};

const recordDiagnostics = async (
  diagnostics: AdConsentDiagnostics
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      AD_CONSENT_STATE_KEY,
      JSON.stringify(diagnostics)
    );
  } catch (error) {
    reportError(error, { area: 'ads.consentState' });
  }
};

const gather = async (): Promise<AdConsentResult> => {
  let canRequestAds = true;
  let personalizationConsented = false;
  let privacyOptionsRequired = false;
  let umpStatus = 'UNKNOWN';
  let umpError: string | null = null;

  // 1. Google UMP. Shows the consent form only where it is required.
  try {
    const info = await AdsConsent.gatherConsent();
    umpStatus = info.status;
    canRequestAds = info.canRequestAds;
    privacyOptionsRequired =
      info.privacyOptionsRequirementStatus ===
      AdsConsentPrivacyOptionsRequirementStatus.REQUIRED;
    personalizationConsented =
      info.canRequestAds && (await umpAllowsPersonalization(info.status));
  } catch (error) {
    // No consent message configured, offline, or an SDK error. Non-personalised
    // ads need no consent, so continue with those.
    umpError = describeError(error);
    reportError(error, { area: 'ump' });
  }

  // 2. ATT, only when the answer could change what is served. Asking for a
  //    tracking permission that will never be used is itself a review problem.
  let trackingChecked = false;
  let tracking = false;
  if (personalizationConsented) {
    trackingChecked = true;
    try {
      tracking = await askTracking();
    } catch (error) {
      reportError(error, { area: 'att' });
    }
  }

  // 3. Initialise the SDK after consent, so the first request honours it.
  let result: AdConsentResult;
  try {
    await mobileAds().initialize();
    result = {
      canRequestAds,
      personalized: canRequestAds && personalizationConsented && tracking,
      privacyOptionsRequired,
    };
  } catch (error) {
    reportError(error, { area: 'ads.init' });
    result = {
      canRequestAds: false,
      personalized: false,
      privacyOptionsRequired,
    };
  }

  await recordDiagnostics({
    umpStatus,
    umpError,
    trackingChecked,
    trackingAllowed: tracking,
    result,
    at: new Date().toISOString(),
  });
  return result;
};

let inFlight: Promise<AdConsentResult> | null = null;

/** Runs the consent flow once per app session; later callers share the result. */
export const resolveAdConsent = (): Promise<AdConsentResult> => {
  if (!inFlight) inFlight = gather();
  return inFlight;
};

/**
 * Shows UMP's privacy-options form so the user can change their choice, then
 * recomputes consent from scratch. Only meaningful while
 * `privacyOptionsRequired` is true.
 */
export const openPrivacyOptions = async (): Promise<AdConsentResult> => {
  try {
    await AdsConsent.showPrivacyOptionsForm();
  } catch (error) {
    reportError(error, { area: 'ump.privacyOptions' });
  }
  inFlight = null;
  return resolveAdConsent();
};

/** Test-only: forget the cached result so each test starts fresh. */
export const resetAdConsentForTests = (): void => {
  inFlight = null;
};
