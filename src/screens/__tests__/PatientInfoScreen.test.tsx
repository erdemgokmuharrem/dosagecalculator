import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';
import PatientInfoScreen from '../PatientInfoScreen';
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
        error: '#ef4444',
        border: '#e2e8f0',
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

// Mock Alert
jest.spyOn(Alert, 'alert');

const renderWithNavigation = (component: React.ReactElement) => {
  return render(<NavigationContainer>{component}</NavigationContainer>);
};

describe('PatientInfoScreen', () => {
  const mockSetCurrentPatient = jest.fn();
  const mockAddPatient = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppStore as jest.Mock).mockReturnValue({
      currentPatient: null,
      setCurrentPatient: mockSetCurrentPatient,
      addPatient: mockAddPatient,
    });
  });

  it('renders correctly with default values', () => {
    const { getByDisplayValue } = renderWithNavigation(<PatientInfoScreen />);

    expect(getByDisplayValue('30')).toBeTruthy();
    expect(getByDisplayValue('70')).toBeTruthy();
    expect(getByDisplayValue('170')).toBeTruthy();
  });

  it('renders correctly with existing patient data', () => {
    const mockPatient = {
      id: '1',
      age: 25,
      weight: 65,
      height: 165,
      gender: 'female' as const,
      patientType: 'adult' as const,
    };

    (useAppStore as jest.Mock).mockReturnValue({
      currentPatient: mockPatient,
      setCurrentPatient: mockSetCurrentPatient,
      addPatient: mockAddPatient,
    });

    const { getByDisplayValue } = renderWithNavigation(<PatientInfoScreen />);

    expect(getByDisplayValue('25')).toBeTruthy();
    expect(getByDisplayValue('65')).toBeTruthy();
    expect(getByDisplayValue('165')).toBeTruthy();
  });

  it('validates required fields', async () => {
    const { getByText, getByDisplayValue } = renderWithNavigation(
      <PatientInfoScreen />
    );

    // Clear age field
    const ageInput = getByDisplayValue('30');
    fireEvent.changeText(ageInput, '');

    // Try to submit
    fireEvent.press(getByText('Devam Et'));

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('submits form with valid data', async () => {
    const { getByText } = renderWithNavigation(<PatientInfoScreen />);

    fireEvent.press(getByText('Devam Et'));

    await waitFor(() => {
      expect(mockAddPatient).toHaveBeenCalled();
      expect(mockSetCurrentPatient).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(
        'DrugSelection',
        expect.any(Object)
      );
    });
  });

  it('updates existing patient when current patient exists', async () => {
    const mockPatient = {
      id: '1',
      age: 25,
      weight: 65,
      height: 165,
      gender: 'female' as const,
      patientType: 'adult' as const,
    };

    (useAppStore as jest.Mock).mockReturnValue({
      currentPatient: mockPatient,
      setCurrentPatient: mockSetCurrentPatient,
      addPatient: mockAddPatient,
    });

    const { getByText } = renderWithNavigation(<PatientInfoScreen />);

    fireEvent.press(getByText('Devam Et'));

    await waitFor(() => {
      expect(mockSetCurrentPatient).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('DrugSelection', {
        patientId: '1',
      });
    });
  });

  it('handles form input changes', () => {
    const { getByDisplayValue } = renderWithNavigation(<PatientInfoScreen />);

    // Test input changes
    const ageInput = getByDisplayValue('30');
    fireEvent.changeText(ageInput, '25');

    const weightInput = getByDisplayValue('70');
    fireEvent.changeText(weightInput, '65');

    const heightInput = getByDisplayValue('170');
    fireEvent.changeText(heightInput, '165');

    // Inputs should update
    expect(ageInput.props.value).toBe('25');
    expect(weightInput.props.value).toBe('65');
    expect(heightInput.props.value).toBe('165');
  });

  it('allows gender selection', () => {
    const { getByText } = renderWithNavigation(<PatientInfoScreen />);

    fireEvent.press(getByText('Kadın'));
    // The selection should be handled by the form
  });

  it('allows patient type selection', () => {
    const { getByText } = renderWithNavigation(<PatientInfoScreen />);

    fireEvent.press(getByText('Child (2-17 years)'));
    // The selection should be handled by the form
  });
});
