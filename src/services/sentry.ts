import * as Sentry from '@sentry/react-native';

// Initialize Sentry
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || 'YOUR_SENTRY_DSN_HERE',
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: __DEV__ ? 1.0 : 0.1,
  debug: __DEV__,
  beforeSend(event) {
    // Filter out development errors in production
    if (!__DEV__ && event.exception) {
      const error = event.exception.values?.[0];
      if (error?.type === 'ChunkLoadError') {
        return null; // Don't send chunk load errors
      }
    }
    return event;
  },
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation: new Sentry.ReactNavigationInstrumentation(),
    }),
  ],
});

export default Sentry;
