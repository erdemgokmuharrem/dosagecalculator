import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as TrackingTransparency from 'expo-tracking-transparency';

import './src/locales/i18n';
import { loadSavedLanguage } from './src/locales/i18n';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SubscriptionProvider } from './src/contexts/SubscriptionContext';
import { AdProvider } from './src/contexts/AdContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { MedicalDisclaimerModal } from './src/components/MedicalDisclaimerModal';
import AppNavigator from './src/navigation/AppNavigator';
import { initMonitoring, reportError } from './src/services/monitoring';

/**
 * Application root.
 *
 * This file previously carried ~9,500 lines: a complete second set of screens,
 * a second theme provider, a third translation table, and a second dose-calculation
 * engine — none of it reachable, because the default export only ever rendered
 * `AppNavigator`. That dead engine applied unreferenced multipliers (including a
 * 1.1x dose increase for obesity) and had no single-dose ceiling, so anyone
 * wiring it back up would have shipped unsafe doses. It has been removed; the
 * live application lives entirely under `src/`.
 */

// Crash reporting is initialised before the tree mounts so early failures are captured.
initMonitoring();

/**
 * App Tracking Transparency.
 *
 * The app bundles Google Mobile Ads and declares NSUserTrackingUsageDescription,
 * but never actually requested permission — App Review rejects that under
 * guideline 5.1.2. The prompt must come *after* the first frame, otherwise iOS
 * silently discards it while the app is still inactive.
 */
const useTrackingPermission = () => {
  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const current =
          await TrackingTransparency.getTrackingPermissionsAsync();
        if (cancelled || current.status !== 'undetermined') return;
        await TrackingTransparency.requestTrackingPermissionsAsync();
      } catch (error) {
        // Declining tracking is a normal outcome; never block startup on it.
        reportError(error, { area: 'att' });
      }
    }, 800);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);
};

export default function App() {
  useTrackingPermission();

  useEffect(() => {
    loadSavedLanguage().catch(error => reportError(error, { area: 'i18n' }));
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <SubscriptionProvider>
            <AdProvider>
              <StatusBar style="auto" />
              {/* Shown until the clinician accepts; required for medical-app review. */}
              <MedicalDisclaimerModal />
              <AppNavigator />
            </AdProvider>
          </SubscriptionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
