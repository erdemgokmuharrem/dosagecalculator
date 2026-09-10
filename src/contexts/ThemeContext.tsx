import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';
import { reportError } from '../services/monitoring';

export type ThemeMode = 'light' | 'dark' | 'system';

interface Theme {
  colors: typeof COLORS;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  fontSizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
}

export const lightTheme: Theme = {
  colors: COLORS,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...COLORS,
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    secondary: '#94a3b8',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    disabled: '#64748b',
    shadow: '#000000',

    // Dose-safety severities re-tuned for the dark surface. Safety text must stay
    // readable in both themes — a warning nobody can read is a warning nobody sees.
    info: '#60a5fa',
    infoLight: '#1e3a8a',
    critical: '#f87171',
    criticalLight: '#450a0a',
    criticalText: '#fecaca',
    warningSurface: '#451a03',
    warningText: '#fde68a',
    infoSurface: '#172554',
    infoText: '#bfdbfe',
    safeSurface: '#052e16',
    safeText: '#86efac',
  },
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  // Starts on the system preference so the tree renders on the first frame.
  // Reading AsyncStorage behind a `return null` meant the whole app rendered
  // empty until storage resolved, which shows as a blank screen after the
  // splash — most visible on low-end devices, exactly where it matters least
  // to have one.
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'system' && systemColorScheme === 'dark');
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    let cancelled = false;

    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (
          !cancelled &&
          savedTheme &&
          ['light', 'dark', 'system'].includes(savedTheme)
        ) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        // A missing preference is not worth blocking startup for; fall back to
        // the system scheme, which is already what we are rendering.
        reportError(error, { area: 'theme.load' });
      }
    };

    loadTheme();
    return () => {
      cancelled = true;
    };
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    // Apply immediately so the toggle feels instant, then persist.
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      reportError(error, { area: 'theme.save' });
    }
  }, []);

  // Memoised: every screen calls useTheme() and rebuilds its StyleSheet from
  // the result, so a new object each render re-styles the entire tree.
  const value = useMemo(
    () => ({ theme, themeMode, setThemeMode, isDark }),
    [theme, themeMode, setThemeMode, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
