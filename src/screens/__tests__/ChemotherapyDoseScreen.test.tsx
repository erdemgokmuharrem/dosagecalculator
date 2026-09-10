import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChemotherapyDoseScreen from '../ChemotherapyDoseScreen';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { CHEMOTHERAPY_DRUGS } from '../../data/chemotherapy';
import i18n from '../../locales/i18n';

/**
 * Render tests for the chemotherapy screen — the cytotoxic dosing path.
 *
 * They pin behaviour that previously failed silently: safety warnings computed
 * but never shown, carboplatin with no way to enter a GFR, and a dose that stayed
 * on screen after the patient's values changed.
 */

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const drugName = (id: string): string => {
  const drug = CHEMOTHERAPY_DRUGS.find(d => d.id === id);
  if (!drug) throw new Error(`fixture drug missing: ${id}`);
  return drug.name;
};

const renderScreen = async () => {
  render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 47, left: 0, right: 0, bottom: 34 },
      }}
    >
      <ThemeProvider>
        <ChemotherapyDoseScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
  await screen.findByTestId('chemo-weight-input');
};

const selectDrug = (id: string) => {
  fireEvent.press(screen.getAllByText(new RegExp(escape(drugName(id))))[0]);
};

const doseText = async () =>
  String((await screen.findByTestId('chemo-result-dose')).props.children);

beforeAll(async () => {
  await i18n.changeLanguage('tr');
});

describe('ChemotherapyDoseScreen', () => {
  it('calculates a BSA-based dose and shows it', async () => {
    await renderScreen();
    fireEvent.changeText(screen.getByTestId('chemo-weight-input'), '70');
    fireEvent.changeText(screen.getByTestId('chemo-height-input'), '170');

    selectDrug('cisplatin');
    fireEvent.press(screen.getByTestId('chemo-calculate'));

    // sqrt(170 × 70 / 3600) = 1.818 m² × 75 mg/m² = 136.4 mg
    expect(await doseText()).toContain('136.4');
  });

  it('renders the engine’s safety warnings', async () => {
    await renderScreen();
    selectDrug('cisplatin');
    fireEvent.press(screen.getByTestId('chemo-calculate'));
    await screen.findByTestId('chemo-result-dose');

    // Computed by the engine but, until recently, never rendered.
    expect(screen.getByText(/Böbrek fonksiyonu ölçülmedi/)).toBeTruthy();
    expect(
      screen.getByText(/bağımsız klinik incelemeden geçmemiştir/)
    ).toBeTruthy();
  });

  it('clears a displayed dose when the patient changes', async () => {
    await renderScreen();
    selectDrug('cisplatin');
    fireEvent.press(screen.getByTestId('chemo-calculate'));
    await screen.findByTestId('chemo-result-dose');

    fireEvent.changeText(screen.getByTestId('chemo-weight-input'), '85');
    await waitFor(() => {
      expect(screen.queryByTestId('chemo-result-dose')).toBeNull();
    });
  });

  it('refuses carboplatin without a measured renal function, then doses it once given', async () => {
    await renderScreen();
    selectDrug('carboplatin');

    fireEvent.changeText(await screen.findByTestId('chemo-auc-input'), '5');
    fireEvent.press(screen.getByTestId('chemo-calculate'));

    const blocked = await screen.findByTestId('chemo-blocked-message');
    expect(String(blocked.props.children)).toMatch(/ölçülmüş GFR gerektirir/);
    expect(screen.queryByTestId('chemo-result-dose')).toBeNull();

    // The screen now offers a GFR field, so the clinician has a route forward.
    fireEvent.changeText(screen.getByTestId('gfr-input'), '80');
    fireEvent.press(screen.getByTestId('chemo-calculate'));

    // Calvert: 5 × (80 + 25) = 525 mg
    expect(await doseText()).toContain('525');
  });
});
