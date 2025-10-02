// Analytics service for tracking user interactions
// This is a mock implementation - replace with your preferred analytics service

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

class AnalyticsService {
  private isEnabled: boolean = !__DEV__; // Disable in development

  init() {
    if (this.isEnabled) {
      console.log('Analytics initialized');
      // Initialize your analytics service here (e.g., Firebase Analytics, Mixpanel, etc.)
    }
  }

  track(event: AnalyticsEvent) {
    if (!this.isEnabled) {
      console.log('Analytics Event:', event);
      return;
    }

    // Send event to analytics service
    console.log('Tracking event:', event);

    // Example implementation for Firebase Analytics:
    // firebase.analytics().logEvent(event.name, event.properties);

    // Example implementation for Mixpanel:
    // mixpanel.track(event.name, event.properties);
  }

  setUserProperties(properties: Record<string, any>) {
    if (!this.isEnabled) return;

    console.log('Setting user properties:', properties);

    // Example implementation:
    // firebase.analytics().setUserProperties(properties);
  }

  setUserId(userId: string) {
    if (!this.isEnabled) return;

    console.log('Setting user ID:', userId);

    // Example implementation:
    // firebase.analytics().setUserId(userId);
  }

  // Specific tracking methods for dosage calculator
  trackDosageCalculation(
    patientType: string,
    drugCategory: string,
    hasWarnings: boolean
  ) {
    this.track({
      name: 'dosage_calculation',
      properties: {
        patient_type: patientType,
        drug_category: drugCategory,
        has_warnings: hasWarnings,
      },
    });
  }

  trackPatientInfoEntered(patientType: string, age: number) {
    this.track({
      name: 'patient_info_entered',
      properties: {
        patient_type: patientType,
        age_range: this.getAgeRange(age),
      },
    });
  }

  trackDrugSelected(drugCategory: string, calculationMethod: string) {
    this.track({
      name: 'drug_selected',
      properties: {
        drug_category: drugCategory,
        calculation_method: calculationMethod,
      },
    });
  }

  trackAppOpened() {
    this.track({
      name: 'app_opened',
      properties: {
        timestamp: new Date().toISOString(),
      },
    });
  }

  trackError(error: Error, context?: string) {
    this.track({
      name: 'error_occurred',
      properties: {
        error_message: error.message,
        error_stack: error.stack,
        context: context,
      },
    });
  }

  private getAgeRange(age: number): string {
    if (age < 2) return 'neonate';
    if (age < 18) return 'child';
    if (age < 65) return 'adult';
    return 'elderly';
  }
}

export const analytics = new AnalyticsService();
export default analytics;
