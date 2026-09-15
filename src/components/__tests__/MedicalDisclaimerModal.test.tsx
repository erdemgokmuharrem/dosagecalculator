import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MedicalDisclaimerModal } from '../MedicalDisclaimerModal';
import { ThemeProvider } from '../../contexts/ThemeContext';
import i18n from '../../locales/i18n';

/**
 * The medical disclaimer gates everything that must not happen before a
 * clinician has read it — currently the advertising-consent flow and its
 * tracking prompt. It must also fail closed: if its stored state cannot be
 * read, it is shown rather than skipped.
 */

jest.mock('../../services/monitoring', () => ({ reportError: jest.fn() }));

const ACCEPTED_KEY = '@medical_disclaimer_accepted';

// The modal renders after an AsyncStorage read. Under a full parallel test run
// that read has taken longer than the 1s default, which made this suite flaky;
// the assertions are about eventual state, not speed.
const SETTLE = { timeout: 5000 };

const renderModal = () => {
  const onAccepted = jest.fn();
  render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 47, left: 0, right: 0, bottom: 34 },
      }}
    >
      <ThemeProvider>
        <MedicalDisclaimerModal onAccepted={onAccepted} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
  return onAccepted;
};

beforeAll(async () => {
  await i18n.changeLanguage('tr');
});

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('MedicalDisclaimerModal', () => {
  it('shows on first launch and reports acceptance only once accepted', async () => {
    const onAccepted = renderModal();
    const accept = await screen.findByTestId('disclaimer-accept', {}, SETTLE);
    expect(onAccepted).not.toHaveBeenCalled();

    fireEvent.press(accept);

    await waitFor(() => expect(onAccepted).toHaveBeenCalledTimes(1), SETTLE);
    expect(await AsyncStorage.getItem(ACCEPTED_KEY)).toBe('true');
  });

  it('reports acceptance straight away when accepted in an earlier session', async () => {
    await AsyncStorage.setItem(ACCEPTED_KEY, 'true');
    const onAccepted = renderModal();
    await waitFor(() => expect(onAccepted).toHaveBeenCalledTimes(1), SETTLE);
    expect(screen.queryByTestId('disclaimer-accept')).toBeNull();
  });

  it('is shown when its stored state cannot be read', async () => {
    // The previous version showed nothing on a read error, skipping the
    // disclaimer entirely.
    jest
      .spyOn(AsyncStorage, 'getItem')
      .mockRejectedValueOnce(new Error('storage unavailable'));
    const onAccepted = renderModal();
    expect(
      await screen.findByTestId('disclaimer-accept', {}, SETTLE)
    ).toBeTruthy();
    expect(onAccepted).not.toHaveBeenCalled();
  });
});
