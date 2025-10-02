import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Patient, DosageCalculation, Drug } from '../types';

interface AppState {
  // Patient state
  currentPatient: Patient | null;
  patients: Patient[];

  // Drug state
  drugs: Drug[];
  selectedDrug: Drug | null;

  // Calculation history
  calculations: DosageCalculation[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentPatient: (patient: Patient | null) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  setDrugs: (drugs: Drug[]) => void;
  setSelectedDrug: (drug: Drug | null) => void;

  addCalculation: (calculation: DosageCalculation) => void;
  clearCalculations: () => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentPatient: null,
      patients: [],
      drugs: [],
      selectedDrug: null,
      calculations: [],
      isLoading: false,
      error: null,

      // Patient actions
      setCurrentPatient: patient => set({ currentPatient: patient }),

      addPatient: patient =>
        set(state => ({
          patients: [...state.patients, patient],
        })),

      updatePatient: (id, updates) =>
        set(state => ({
          patients: state.patients.map(patient =>
            patient.id === id ? { ...patient, ...updates } : patient
          ),
          currentPatient:
            state.currentPatient?.id === id
              ? { ...state.currentPatient, ...updates }
              : state.currentPatient,
        })),

      deletePatient: id =>
        set(state => ({
          patients: state.patients.filter(patient => patient.id !== id),
          currentPatient:
            state.currentPatient?.id === id ? null : state.currentPatient,
        })),

      // Drug actions
      setDrugs: drugs => set({ drugs }),

      setSelectedDrug: drug => set({ selectedDrug: drug }),

      // Calculation actions
      addCalculation: calculation =>
        set(state => ({
          calculations: [calculation, ...state.calculations],
        })),

      clearCalculations: () => set({ calculations: [] }),

      // UI actions
      setLoading: loading => set({ isLoading: loading }),

      setError: error => set({ error }),
    }),
    {
      name: 'dosage-calculator-storage',
      partialize: state => ({
        patients: state.patients,
        calculations: state.calculations,
        drugs: state.drugs,
      }),
    }
  )
);
