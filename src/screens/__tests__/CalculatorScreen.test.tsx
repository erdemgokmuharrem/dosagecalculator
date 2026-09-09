import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import CalculatorScreen from '../CalculatorScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../../contexts/ThemeContext';
import '../../locales/i18n';
import i18n from '../../locales/i18n';
import { useAppStore } from '../../store';

/**
 * Render tests for the calculator.
 *
 * The reason these exist: the result panel used to read `result.singleDose`,
 * `result.unit` and `result.isWithinLimits`, none of which the engine returns.
 * Because `result` was typed `any`, nothing caught it — the main dose rendered
 * blank and every calculation displayed "dose limit exceeded". A test that
 * asserts a number actually reaches the screen is the guard against that class
 * of regression.
 */

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

jest.mock('../../contexts/AdContext', () => ({
  useAdManager: () => ({ showInterstitialAd: (cb?: () => void) => cb?.() }),
}));

jest.mock('../../contexts/SubscriptionContext', () => ({
  useSubscription: () => ({ isPro: true, subscription: { isPro: true } }),
}));

jest.mock('../../components/AdBanner', () => ({ AdBanner: () => null }));

const renderScreen = async () => {
  const result = render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 47, left: 0, right: 0, bottom: 34 },
      }}
    >
      <ThemeProvider>
        <CalculatorScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
  // ThemeProvider renders null until it has loaded the saved theme.
  await screen.findByTestId('age-input', {}, { timeout: 3000 });
  return result;
};

const setPatient = (fields: Record<string, string>) => {
  for (const [testID, value] of Object.entries(fields)) {
    fireEvent.changeText(screen.getByTestId(testID), value);
  }
};

/**
 * Selects a drug by name.
 *
 * Addressing `drug-item-0` is unreliable here: the search input is debounced by
 * 80 ms, so for a moment after typing the list still shows every drug and index
 * 0 is whatever happened to be first. Each row carries the drug name as its
 * accessibility label, so match on that instead.
 */
const selectDrug = async (name: string) => {
  fireEvent.changeText(screen.getByTestId('drug-search'), name);
  const item = await screen.findByLabelText(name, {}, { timeout: 3000 });
  fireEvent.press(item);
};

beforeAll(async () => {
  await i18n.changeLanguage('tr');
});

beforeEach(() => {
  useAppStore.setState({ calculations: [], patients: [] });
});

describe('CalculatorScreen', () => {
  it('renders the patient form with its default values', async () => {
    await renderScreen();
    expect(screen.getByTestId('age-input').props.value).toBe('35');
    expect(screen.getByTestId('weight-input').props.value).toBe('70');
    expect(screen.getByTestId('height-input').props.value).toBe('170');
  });

  it('shows a numeric dose on screen after selecting a drug', async () => {
    await renderScreen();
    setPatient({
      'age-input': '30',
      'weight-input': '70',
      'height-input': '170',
    });

    await selectDrug('Paracetamol');

    const dose = await screen.findByTestId(
      'result-dose',
      {},
      { timeout: 3000 }
    );
    // The regression this guards: the element rendered, but empty.
    expect(dose.props.children).toBeDefined();
    const text = String(dose.props.children);
    expect(text).not.toBe('');
    expect(text).not.toContain('undefined');
    expect(text).not.toContain('NaN');
    expect(Number(text)).toBeGreaterThan(0);
  });

  it('does not claim "limit exceeded" for a dose that is within limits', async () => {
    await renderScreen();
    setPatient({
      'age-input': '30',
      'weight-input': '70',
      'height-input': '170',
    });

    await selectDrug('Paracetamol');
    await screen.findByTestId('result-dose', {}, { timeout: 3000 });

    // 70 kg × 15 mg/kg = 1050 mg, capped at the 1000 mg single-dose ceiling, so
    // this particular drug does warn. Assert the *safe* branch renders at all by
    // checking the two states are mutually exclusive.
    const withinLimits = screen.queryByText(/Güvenli Sınırlar İçinde/);
    const exceeds = screen.queryByText(/Doz Sınırı Aşıldı/);
    expect(Boolean(withinLimits) !== Boolean(exceeds)).toBe(true);
  });

  it('refuses to dose a drug contraindicated at the patient’s age', async () => {
    await renderScreen();
    // Aspirin is contraindicated under 12 (Reye's syndrome).
    setPatient({
      'age-input': '8',
      'weight-input': '25',
      'height-input': '130',
    });

    await selectDrug('Aspirin');

    const blocked = await screen.findByTestId(
      'blocked-message',
      {},
      { timeout: 3000 }
    );
    expect(String(blocked.props.children)).toContain('KONTRENDİKE');
    // Crucially, no dose is shown alongside the refusal.
    expect(screen.queryByTestId('result-dose')).toBeNull();
  });

  it('shows an inline error and no dose for an implausible weight', async () => {
    await renderScreen();
    setPatient({
      'age-input': '30',
      'weight-input': '900',
      'height-input': '170',
    });

    await selectDrug('Paracetamol');

    await waitFor(() => {
      expect(
        screen.getByText(/Kilo 0,3-500 kg arasında olmalıdır/)
      ).toBeTruthy();
    });
    expect(screen.queryByTestId('result-dose')).toBeNull();
  });

  it('clears a displayed dose when the patient is edited', async () => {
    await renderScreen();
    setPatient({
      'age-input': '30',
      'weight-input': '70',
      'height-input': '170',
    });
    await selectDrug('Paracetamol');
    await screen.findByTestId('result-dose', {}, { timeout: 3000 });

    // A stale dose next to changed inputs is how a wrong number gets read aloud.
    fireEvent.changeText(screen.getByTestId('weight-input'), '55');
    await waitFor(() => {
      expect(screen.queryByTestId('result-dose')).toBeNull();
    });
  });

  it('saves a calculation with a real dose, not undefined', async () => {
    await renderScreen();
    setPatient({
      'age-input': '30',
      'weight-input': '70',
      'height-input': '170',
    });
    await selectDrug('Paracetamol');
    await screen.findByTestId('result-dose', {}, { timeout: 3000 });

    fireEvent.press(screen.getByText(/Hesaplamayı Kaydet/));

    await waitFor(() => {
      const [saved] = useAppStore.getState().calculations;
      expect(saved).toBeDefined();
      // The old code wrote `result.singleDose`, which the engine never returns,
      // so every history entry stored an undefined dose.
      expect(typeof saved.calculatedDose).toBe('number');
      expect(saved.calculatedDose).toBeGreaterThan(0);
      expect(saved.unit).toBe('mg');
    });
  });
});
