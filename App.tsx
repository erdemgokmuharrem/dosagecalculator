import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './src/locales/i18n';
import { loadSavedLanguage } from './src/locales/i18n';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SubscriptionProvider } from './src/contexts/SubscriptionContext';
import { AdProvider, useAdManager } from './src/contexts/AdContext';
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
 * The medical disclaimer gates advertising consent.
 *
 * Consent (Google UMP, then App Tracking Transparency on iOS) is requested only
 * after the clinician has accepted the disclaimer, or at launch if it was
 * accepted in an earlier session. The tracking prompt used to be requested on a
 * timer and opened on top of the disclaimer on first launch.
 */
const DisclaimerGate: React.FC = () => {
  const { requestAdConsent } = useAdManager();
  return <MedicalDisclaimerModal onAccepted={requestAdConsent} />;
};

export default function App() {
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
              <DisclaimerGate />
              <AppNavigator />
            </AdProvider>
          </SubscriptionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
