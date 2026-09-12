import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import VademecumScreen from '../VademecumScreen';
import { ThemeProvider } from '../../contexts/ThemeContext';
import i18n from '../../locales/i18n';

/**
 * The drug list: search (debounced), the favourites filter and opening a
 * monograph. Opening one must pass the drug's id, since DrugDetail looks the
 * drug up by it.
 */

jest.mock('../../components/AdBanner', () => ({ AdBanner: () => null }));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
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
        <VademecumScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );

const search = (text: string) =>
  fireEvent.changeText(
    screen.getByPlaceholderText(i18n.t('vademecum.searchPlaceholder')),
    text
  );

/** Search is debounced by 80ms; let the timer run and the list re-render. */
const flushSearchDebounce = async () => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 150));
  });
};

beforeAll(async () => {
  await i18n.changeLanguage('tr');
});

beforeEach(() => {
  mockNavigate.mockReset();
});

describe('VademecumScreen', () => {
  it('lists the catalogue', () => {
    renderScreen();
    expect(screen.getByText('Paracetamol')).toBeTruthy();
    // A card shows the name and the active ingredient, which for Ibuprofen are
    // the same string.
    expect(screen.getAllByText('Ibuprofen').length).toBeGreaterThan(0);
  });

  it('filters as the user types, after the debounce', async () => {
    renderScreen();
    search('ibupro');
    await flushSearchDebounce();
    expect(screen.getAllByText('Ibuprofen').length).toBeGreaterThan(0);
    expect(screen.queryByText('Paracetamol')).toBeNull();
  });

  it('says so when nothing matches', async () => {
    renderScreen();
    search('zzzzzz');
    await flushSearchDebounce();
    expect(screen.getByText(i18n.t('vademecum.noMatches'))).toBeTruthy();
  });

  it('opens a monograph with the drug id', () => {
    renderScreen();
    fireEvent.press(screen.getByText('Paracetamol'));
    expect(mockNavigate).toHaveBeenCalledWith('DrugDetail', { drugId: '1' });
  });

  it('shows the empty state when favourites are filtered and there are none', () => {
    renderScreen();
    fireEvent.press(screen.getByText(i18n.t('vademecum.favorites')));
    expect(screen.getByText(i18n.t('vademecum.noFavorites'))).toBeTruthy();
  });
});
