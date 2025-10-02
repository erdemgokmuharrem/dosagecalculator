import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../HomeScreen';
import { useAppStore } from '../../store';

// Mock the store
jest.mock('../../store', () => ({
  useAppStore: jest.fn(),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock theme context
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#2563eb',
        surface: '#ffffff',
        background: '#f8fafc',
        text: '#1e293b',
        textSecondary: '#64748b',
        warning: '#f59e0b',
        secondary: '#64748b',
      },
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
    },
  }),
}));

const renderWithNavigation = (component: React.ReactElement) => {
  return render(<NavigationContainer>{component}</NavigationContainer>);
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly without current patient', () => {
    (useAppStore as jest.Mock).mockReturnValue({
      currentPatient: null,
    });

    const { getByText } = renderWithNavigation(<HomeScreen />);

    expect(getByText('navigation.calculator')).toBeTruthy();
    expect(getByText('Başla')).toBeTruthy();
  });

  it('renders correctly with current patient', () => {
    const mockPatient = {
      id: '1',
      age: 30,
      weight: 70,
      height: 170,
      gender: 'male' as const,
      patientType: 'adult' as const,
    };

    (useAppStore as jest.Mock).mockReturnValue({
      currentPatient: mockPatient,
    });

    const { getByText } = renderWithNavigation(<HomeScreen />);

    expect(getByText('Aktif Hasta: 30 yaş, 70kg, adult')).toBeTruthy();
    expect(getByText('İlaç Seç')).toBeTruthy();
  });

  it('navigates to PatientInfo when no current patient', () => {
    (useAppStore as jest.Mock).mockReturnValue({
      currentPatient: null,
    });

    const { getByText } = renderWithNavigation(<HomeScreen />);

    fireEvent.press(getByText('Başla'));
    expect(mockNavigate).toHaveBeenCalledWith('PatientInfo');
  });

  it('navigates to DrugSelection when current patient exists', () => {
    const mockPatient = {
      id: '1',
      age: 30,
      weight: 70,
      height: 170,
      gender: 'male' as const,
      patientType: 'adult' as const,
    };

    (useAppStore as jest.Mock).mockReturnValue({
      currentPatient: mockPatient,
    });

    const { getByText } = renderWithNavigation(<HomeScreen />);

    fireEvent.press(getByText('İlaç Seç'));
    expect(mockNavigate).toHaveBeenCalledWith('DrugSelection', {
      patientId: '1',
    });
  });

  it('navigates to History when history button is pressed', () => {
    (useAppStore as jest.Mock).mockReturnValue({
      currentPatient: null,
    });

    const { getByText } = renderWithNavigation(<HomeScreen />);

    fireEvent.press(getByText('Geçmişi Görüntüle'));
    expect(mockNavigate).toHaveBeenCalledWith('History');
  });

  it('navigates to PatientInfo when patient info button is pressed', () => {
    (useAppStore as jest.Mock).mockReturnValue({
      currentPatient: null,
    });

    const { getByText } = renderWithNavigation(<HomeScreen />);

    fireEvent.press(getByText('Hasta Bilgileri'));
    expect(mockNavigate).toHaveBeenCalledWith('PatientInfo');
  });

  it('navigates to Settings when settings button is pressed', () => {
    (useAppStore as jest.Mock).mockReturnValue({
      currentPatient: null,
    });

    const { getByText } = renderWithNavigation(<HomeScreen />);

    fireEvent.press(getByText('Ayarlar'));
    expect(mockNavigate).toHaveBeenCalledWith('Settings');
  });
});
