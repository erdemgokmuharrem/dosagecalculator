import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Patient, DosageCalculation, Drug, DoseWarning } from '../types';
import { LEGACY_WARNING } from '../features/dosage/warnings';

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

/**
 * Bump when the persisted shape changes; `migrateState` must handle the upgrade.
 *
 * v1 → v2: `DosageCalculation.warnings` changed from pre-translated `string[]`
 * to structured `DoseWarning[]` so history follows the UI language. Existing
 * entries are wrapped so old records still render.
 */
export const STORE_VERSION = 2;

export type PersistedShape = {
  patients?: Patient[];
  calculations?: Array<
    Omit<DosageCalculation, 'warnings'> & { warnings?: unknown }
  >;
};

/**
 * Wraps a v1 warning (a pre-translated string) as a structured warning.
 *
 * The text is carried in `params.text` under the LEGACY_WARNING sentinel rather
 * than being used as the code, so rendering old history never depends on an
 * i18next lookup keyed by translated prose (':' is i18next's namespace
 * separator). `formatWarning` returns the text verbatim.
 */
const toWarning = (value: unknown): DoseWarning =>
  typeof value === 'string'
    ? { code: LEGACY_WARNING, severity: 'warning', params: { text: value } }
    : (value as DoseWarning);

/** Exported for tests: migrating user history wrongly loses real records. */
export const migrateState = (
  persisted: unknown,
  version: number
): PersistedShape => {
  const state = (persisted ?? {}) as PersistedShape;
  if (version >= STORE_VERSION) return state;

  return {
    ...state,
    calculations: (state.calculations ?? []).map(calc => ({
      ...calc,
      warnings: Array.isArray(calc.warnings)
        ? calc.warnings.map(toWarning)
        : [],
    })),
  };
};

export const useAppStore = create<AppState>()(
  persist(
    set => ({
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
      // Without an explicit storage adapter, zustand/persist falls back to
      // `localStorage`, which does not exist in React Native — so nothing was
      // ever persisted and the calculation history was lost on every restart.
      storage: createJSONStorage(() => AsyncStorage),
      version: STORE_VERSION,
      migrate: migrateState,
      partialize: state => ({
        patients: state.patients,
        calculations: state.calculations,
        // `drugs` is bundled static data, not user state. Persisting it wrote a
        // multi-megabyte copy of the catalogue into AsyncStorage on every change.
      }),
    }
  )
);
