import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HistoryScreen from '../HistoryScreen';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { useAppStore } from '../../store';
import { LEGACY_WARNING } from '../../features/dosage/warnings';
import i18n from '../../locales/i18n';
import type { DosageCalculation } from '../../types';

/**
 * History renders persisted calculations. Those come back from AsyncStorage with
 * ISO-string timestamps (not Date objects) and, for pre-v2 records, legacy
 * warnings wrapped by the store migration. Both used to be crash or corruption
 * risks, so the screen is exercised with exactly that shape.
 */

jest.mock('../../components/AdBanner', () => ({ AdBanner: () => null }));

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const calculation = (over: Partial<DosageCalculation>): DosageCalculation =>
  ({
    id: 'c',
    patientId: 'p1',
    drugId: '1',
    calculatedDose: 500,
    unit: 'mg',
    frequency: 'q6h',
    warnings: [],
    parameters: { patientWeight: 70, patientAge: 40 },
    // Persisted timestamps are strings; the type says Date.
    timestamp: daysAgo(0) as unknown as Date,
    ...over,
  }) as DosageCalculation;

const renderScreen = () =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 47, left: 0, right: 0, bottom: 34 },
      }}
    >
      <ThemeProvider>
        <HistoryScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );

beforeAll(async () => {
  await i18n.changeLanguage('tr');
});

describe('HistoryScreen', () => {
  it('shows the empty state when nothing has been saved', () => {
    useAppStore.setState({ calculations: [], patients: [] });
    renderScreen();
    expect(screen.getByText('Henüz hesaplama geçmişi yok')).toBeTruthy();
  });

  it('renders persisted records with string timestamps, grouped by day', () => {
    useAppStore.setState({
      patients: [],
      calculations: [
        calculation({ id: 'today', drugId: '1', calculatedDose: 1000 }),
        calculation({
          id: 'yesterday',
          drugId: '2',
          timestamp: daysAgo(1) as unknown as Date,
        }),
      ],
    });
    renderScreen();

    expect(screen.getByText('Bugün')).toBeTruthy();
    expect(screen.getByText('Dün')).toBeTruthy();
    expect(screen.getAllByText(/1000\s*mg/).length).toBeGreaterThan(0);
  });

  it('translates a structured warning in the detail view', () => {
    useAppStore.setState({
      patients: [],
      calculations: [
        calculation({
          id: 'capped',
          drugId: '1',
          warnings: [
            {
              code: 'safety.cappedSingleDose',
              severity: 'critical',
              params: { calculated: 1050, max: 1000, unit: 'mg' },
            },
          ],
        }),
      ],
    });
    renderScreen();

    fireEvent.press(screen.getAllByText('Paracetamol')[0]);
    expect(screen.getByText(/SINIRLANDIRILDI/)).toBeTruthy();
  });

  it('renders a migrated legacy warning verbatim', () => {
    useAppStore.setState({
      patients: [],
      calculations: [
        calculation({
          id: 'legacy',
          drugId: '1',
          warnings: [
            {
              code: LEGACY_WARNING,
              severity: 'warning',
              params: { text: 'DİKKAT: Eski kayıttan gelen uyarı.' },
            },
          ],
        }),
      ],
    });
    renderScreen();

    fireEvent.press(screen.getAllByText('Paracetamol')[0]);
    expect(
      screen.getByText(/DİKKAT: Eski kayıttan gelen uyarı\./)
    ).toBeTruthy();
    // The sentinel itself must never leak onto the screen.
    expect(screen.queryByText(/__legacy__/)).toBeNull();
  });
});
