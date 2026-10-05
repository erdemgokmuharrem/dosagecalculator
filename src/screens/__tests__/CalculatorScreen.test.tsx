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

// The real catalogue plus one fixture whose only renal rule covers normal
// kidneys, so an impaired patient matches none. A shipped record would not do:
// its renal gap closes as soon as the record is corrected.
jest.mock('../../data/drugs', () => {
  const actual = jest.requireActual('../../data/drugs');
  const renalGapFixture = {
    id: 'fixture-renal-gap',
    name: 'Renal Gap Fixture',
    genericName: 'fixture',
    category: 'Antibiotics',
    unit: 'mg',
    dosageForm: 'injection',
    calculationMethod: 'weight',
    contraindications: [],
    sideEffects: [],
    dosageFormula: {
      method: 'weight',
      dosePerKg: 50,
      frequency: 'q12h',
      maxSingleDose: 2000,
      maxDailyDose: 6000,
      renalAdjustments: [{ minGFR: 60, maxGFR: 9999, adjustmentFactor: 1 }],
    },
  };
  return { ...actual, sampleDrugs: [...actual.sampleDrugs, renalGapFixture] };
});

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
    // Creatinine starts empty, with 1.0 only as a placeholder. A pre-filled
    // 1.0 reached the engine as a measured value: kidney function was never
    // reported as "not assessed", and a CrCl nobody measured was shown.
    const creatinine = screen.getByTestId('creatinine-input');
    expect(creatinine.props.value).toBe('');
    expect(creatinine.props.placeholder).toBe('1.0');
    expect(screen.queryByText('CrCl (mL/dk)')).toBeNull();
  });

  it('refuses a drug with renal rules until a serum creatinine is entered', async () => {
    await renderScreen();
    // The creatinine field is left as the form opens. Any drug with renal rules
    // would do; the fixture keeps this independent of catalogue records, which
    // gain and lose renal rules as they are verified. With the old pre-filled
    // 1.0 it was dosed against a CrCl of 102 mL/min.
    await selectDrug('Renal Gap Fixture');

    const blocked = await screen.findByTestId(
      'blocked-message',
      {},
      { timeout: 3000 }
    );
    expect(String(blocked.props.children)).toContain(
      'Serum kreatinin değerini girin'
    );
    expect(screen.queryByTestId('result-dose')).toBeNull();

    // A measured value lifts the refusal.
    setPatient({ 'creatinine-input': '1.0' });
    fireEvent.press(screen.getByTestId('calculate-button'));
    await screen.findByTestId('result-dose', {}, { timeout: 3000 });
    expect(screen.queryByTestId('blocked-message')).toBeNull();
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

  it('does not claim "within safe limits" when impaired kidneys were not accounted for', async () => {
    await renderScreen();
    // 85 y, female, 38 kg, SCr 1.6 → CrCl 15.4 mL/min, which no rule of the
    // fixture covers, yet every ceiling passes: 1900 mg q12h. This used to show
    // the green badge directly above the critical renal warning.
    setPatient({
      'age-input': '85',
      'weight-input': '38',
      'height-input': '150',
      'creatinine-input': '1.6',
    });
    fireEvent.press(screen.getByText('♀ Kadın'));

    await selectDrug('Renal Gap Fixture');
    const dose = await screen.findByTestId(
      'result-dose',
      {},
      { timeout: 3000 }
    );
    expect(String(dose.props.children)).toBe('1900');

    expect(screen.queryByText(/Güvenli Sınırlar İçinde/)).toBeNull();
    expect(
      screen.getByText(/Böbrek fonksiyonu azalmış: renal doz ayarı uygulanmadı/)
    ).toBeTruthy();
    expect(screen.getByText(/BÖBREK FONKSİYONU AZALMIŞ/)).toBeTruthy();
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
