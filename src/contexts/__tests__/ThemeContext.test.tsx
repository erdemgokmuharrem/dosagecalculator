import React from 'react';
import { Text } from 'react-native';
import { render, screen, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from '../ThemeContext';

/**
 * The provider used to `return null` until it had read the stored theme from
 * AsyncStorage, so the entire app rendered empty on the first frame — a blank
 * screen between the splash and the UI. These tests pin the behaviour that
 * replaced it: render immediately on the system scheme, then adopt the stored
 * preference when it arrives.
 */

const Probe: React.FC = () => {
  const { theme, themeMode, isDark } = useTheme();
  return (
    <>
      <Text testID="mode">{themeMode}</Text>
      <Text testID="dark">{String(isDark)}</Text>
      <Text testID="bg">{theme.colors.background}</Text>
    </>
  );
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('ThemeProvider', () => {
  it('renders its children synchronously, before storage resolves', () => {
    // No await: if the provider gated on AsyncStorage this query would fail.
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode')).toBeTruthy();
    expect(screen.getByTestId('bg').props.children).toBeTruthy();
  });

  it('defaults to the system preference', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode').props.children).toBe('system');
  });

  it('adopts a stored preference once it loads', async () => {
    await AsyncStorage.setItem('themeMode', 'dark');

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mode').props.children).toBe('dark');
    });
    expect(screen.getByTestId('dark').props.children).toBe('true');
  });

  it('ignores a corrupted stored value rather than crashing', async () => {
    await AsyncStorage.setItem('themeMode', 'chartreuse');

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mode').props.children).toBe('system');
    });
  });

  it('applies a theme change immediately and persists it', async () => {
    // The context declares setThemeMode as fire-and-forget (returns void) even
    // though the implementation is async, so mirror that signature here.
    let setMode: ((mode: 'light' | 'dark' | 'system') => void) | null = null;

    const Controller: React.FC = () => {
      const { setThemeMode, themeMode } = useTheme();
      setMode = setThemeMode;
      return <Text testID="mode">{themeMode}</Text>;
    };

    render(
      <ThemeProvider>
        <Controller />
      </ThemeProvider>
    );

    await act(async () => {
      setMode!('dark');
    });

    // The toggle must not wait on the write to feel responsive.
    expect(screen.getByTestId('mode').props.children).toBe('dark');
    expect(await AsyncStorage.getItem('themeMode')).toBe('dark');
  });

  it('keeps the context value stable across re-renders', () => {
    const seen: unknown[] = [];

    const Capture: React.FC = () => {
      seen.push(useTheme());
      return null;
    };

    const { rerender } = render(
      <ThemeProvider>
        <Capture />
      </ThemeProvider>
    );
    rerender(
      <ThemeProvider>
        <Capture />
      </ThemeProvider>
    );

    // Every screen rebuilds its StyleSheet from this object; a fresh identity on
    // each render re-styles the whole tree.
    expect(seen.length).toBeGreaterThan(1);
    expect(seen[seen.length - 1]).toBe(seen[seen.length - 2]);
  });
});
