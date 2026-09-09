import * as Sentry from '@sentry/react-native';

/**
 * Crash reporting.
 *
 * Two things this module must get right:
 *
 *  1. It has to actually run. The previous implementation called `Sentry.init`
 *     at module scope in a file nothing imported, so crash reporting was off in
 *     production while the release checklist said it was on. Initialisation is
 *     now explicit (`initMonitoring`) and called from the app root.
 *
 *  2. It must not leak patient data. This app handles age, weight, height and
 *     serum creatinine. Those never leave the device: default PII is off,
 *     console breadcrumbs are dropped in production, and anything that looks
 *     like a patient measurement is scrubbed from event text before sending.
 */

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim();
const RELEASE = process.env.EXPO_PUBLIC_RELEASE?.trim();
const ENVIRONMENT = __DEV__
  ? 'development'
  : process.env.EXPO_PUBLIC_ENV?.trim() || 'production';

/** Navigation instrumentation. Pass `.registerNavigationContainer(ref)` at the root. */
export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: false,
});

let initialised = false;

/**
 * Redacts numbers that could be patient measurements from free text.
 * Deliberately blunt: an over-redacted stack trace is recoverable, a leaked
 * health measurement is not.
 */
const scrubText = (input: string): string =>
  input
    .replace(
      /\b\d{1,3}([.,]\d+)?\s?(kg|cm|mg\/dL|mL\/min|m²|yr|y\/o|yaş)\b/gi,
      '[redacted]'
    )
    .replace(
      /\b(weight|height|age|creatinine|kilo|boy|yas|yaş|scr|crcl|bsa|bmi)\b\s*[:=]\s*[\d.,]+/gi,
      '$1:[redacted]'
    );

const scrubEvent = <T extends Sentry.ErrorEvent>(event: T): T => {
  if (event.message) event.message = scrubText(event.message);

  for (const exception of event.exception?.values ?? []) {
    if (exception.value) exception.value = scrubText(exception.value);
  }

  // Local variables captured by the SDK can contain the patient object wholesale.
  for (const exception of event.exception?.values ?? []) {
    for (const frame of exception.stacktrace?.frames ?? []) {
      delete frame.vars;
    }
  }

  delete event.user;
  if (event.request) delete event.request.cookies;

  return event;
};

export const initMonitoring = (): void => {
  if (initialised) return;

  if (!DSN) {
    // No DSN configured. Stay silent in production rather than crashing, but be
    // loud in development so a missing production key is caught before release.
    if (__DEV__) {
      console.warn(
        '[monitoring] EXPO_PUBLIC_SENTRY_DSN is not set — crash reporting is DISABLED. ' +
          'Set it in .env before building a release.'
      );
    }
    return;
  }

  Sentry.init({
    dsn: DSN,
    environment: ENVIRONMENT,
    release: RELEASE || undefined,
    debug: __DEV__,
    // Patient data must never be attached automatically.
    sendDefaultPii: false,
    tracesSampleRate: __DEV__ ? 1.0 : 0.1,
    attachStacktrace: true,
    integrations: [navigationIntegration],
    beforeSend: event => scrubEvent(event),
    beforeBreadcrumb: breadcrumb => {
      // Console breadcrumbs routinely contain whatever was logged, including
      // patient objects. Drop them outside development.
      if (!__DEV__ && breadcrumb.category === 'console') return null;
      if (breadcrumb.message)
        breadcrumb.message = scrubText(breadcrumb.message);
      return breadcrumb;
    },
  });

  initialised = true;
};

/** Reports a handled error. Safe to call when monitoring is disabled. */
export const reportError = (
  error: unknown,
  context?: Record<string, string>
): void => {
  if (__DEV__) {
    console.error('[monitoring]', error, context);
  }
  if (!initialised) return;
  Sentry.captureException(error, context ? { tags: context } : undefined);
};

/** Reports a non-fatal message (e.g. a data-integrity problem found at runtime). */
export const reportMessage = (
  message: string,
  context?: Record<string, string>
): void => {
  if (!initialised) return;
  Sentry.captureMessage(
    scrubText(message),
    context ? { tags: context } : undefined
  );
};

export const isMonitoringEnabled = (): boolean => initialised;

export default Sentry;
