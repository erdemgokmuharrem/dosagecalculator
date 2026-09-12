import React from 'react';
import { Alert } from 'react-native';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import DrugDetailScreen from '../DrugDetailScreen';
import { ThemeProvider } from '../../contexts/ThemeContext';
import i18n from '../../locales/i18n';

/**
 * The drug monograph. It must survive an id that no longer exists (history and
 * deep links carry ids), and the PDF export is a Pro feature: a free user must
 * not be able to generate the file.
 */

jest.mock('expo-print', () => ({ printToFileAsync: jest.fn() }));
jest.mock('expo-sharing', () => ({ shareAsync: jest.fn() }));
jest.mock('../../services/monitoring', () => ({ reportError: jest.fn() }));
jest.mock('../../components/AdBanner', () => ({ AdBanner: () => null }));

const mockNavigate = jest.fn();
let mockDrugId = '1';
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
  useRoute: () => ({ params: { drugId: mockDrugId } }),
}));

const mockSubscription = { isPro: false };
jest.mock('../../contexts/SubscriptionContext', () => ({
  useSubscription: () => mockSubscription,
}));

const renderScreen = () =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 47, left: 0, right: 0, bottom: 34 },
      }}
    >
      <ThemeProvider>
        <DrugDetailScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );

const shareButton = () => screen.getByText(i18n.t('vademecum.share'));

beforeAll(async () => {
  await i18n.changeLanguage('tr');
});

beforeEach(() => {
  mockDrugId = '1';
  mockSubscription.isPro = false;
  mockNavigate.mockReset();
  jest
    .mocked(Print.printToFileAsync)
    .mockReset()
    .mockResolvedValue({
      uri: 'file:///tmp/paracetamol.pdf',
    } as never);
  jest.mocked(Sharing.shareAsync).mockReset().mockResolvedValue(undefined);
});

describe('DrugDetailScreen', () => {
  it('renders the monograph of the drug it was opened with', () => {
    renderScreen();
    expect(screen.getByText('Paracetamol')).toBeTruthy();
  });

  it('shows a not-found state for an id that no longer exists', () => {
    mockDrugId = 'removed-drug';
    renderScreen();
    expect(screen.getByText(i18n.t('drug.noResults'))).toBeTruthy();
    expect(screen.queryByText('Paracetamol')).toBeNull();
  });

  it('does not generate the PDF for a free user', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    renderScreen();
    fireEvent.press(shareButton());
    await waitFor(() => expect(alert).toHaveBeenCalled());
    expect(alert.mock.calls[0][1]).toBe(i18n.t('vademecum.pdfProOnly'));
    expect(Print.printToFileAsync).not.toHaveBeenCalled();
    expect(Sharing.shareAsync).not.toHaveBeenCalled();
    alert.mockRestore();
  });

  it('generates and shares the PDF for a Pro user', async () => {
    mockSubscription.isPro = true;
    renderScreen();
    fireEvent.press(shareButton());
    await waitFor(() =>
      expect(Print.printToFileAsync).toHaveBeenCalledTimes(1)
    );
    expect(Sharing.shareAsync).toHaveBeenCalledWith(
      'file:///tmp/paracetamol.pdf',
      expect.anything()
    );
  });
});
