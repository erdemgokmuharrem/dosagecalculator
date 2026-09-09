import {
  parseDecimal,
  validatePatientForm,
  buildPatient,
  derivePatientMetrics,
  PatientFormState,
} from '../patientForm';

const form = (over: Partial<PatientFormState> = {}): PatientFormState => ({
  age: '40',
  weight: '70',
  height: '175',
  gender: 'male',
  patientType: 'adult',
  serumCreatinine: '1.0',
  ...over,
});

describe('parseDecimal', () => {
  it('parses plain and decimal numbers', () => {
    expect(parseDecimal('70')).toBe(70);
    expect(parseDecimal('70.5')).toBe(70.5);
    expect(parseDecimal('  12  ')).toBe(12);
    expect(parseDecimal('0.5')).toBe(0.5);
    expect(parseDecimal('.5')).toBe(0.5);
  });

  it('accepts a comma as the decimal separator', () => {
    // Four of the five shipped locales write 70,5 rather than 70.5.
    expect(parseDecimal('70,5')).toBe(70.5);
  });

  it('rejects anything that is not purely a number', () => {
    // parseFloat would silently return 70 for "70kg" and 1.2 for "1.2.3".
    expect(parseDecimal('70kg')).toBeNull();
    expect(parseDecimal('1.2.3')).toBeNull();
    expect(parseDecimal('abc')).toBeNull();
    expect(parseDecimal('')).toBeNull();
    expect(parseDecimal('  ')).toBeNull();
    expect(parseDecimal('-5')).toBeNull();
    expect(parseDecimal('1e5')).toBeNull();
    expect(parseDecimal('Infinity')).toBeNull();
  });
});

describe('validatePatientForm', () => {
  it('accepts a well-formed patient', () => {
    expect(validatePatientForm(form())).toEqual({});
  });

  it('accepts an empty serum creatinine — it is optional', () => {
    expect(validatePatientForm(form({ serumCreatinine: '' }))).toEqual({});
  });

  it.each([
    ['age', { age: '' }, 'validation.ageRequired'],
    ['age', { age: '200' }, 'validation.ageRange'],
    ['weight', { weight: '' }, 'validation.weightRequired'],
    ['weight', { weight: '900' }, 'validation.weightRange'],
    ['weight', { weight: '0' }, 'validation.weightRange'],
    ['height', { height: '' }, 'validation.heightRequired'],
    ['height', { height: '400' }, 'validation.heightRange'],
    [
      'serumCreatinine',
      { serumCreatinine: '99' },
      'validation.creatinineRange',
    ],
  ])('rejects %s with %o', (field, over, expected) => {
    const errors = validatePatientForm(form(over as Partial<PatientFormState>));
    expect(errors[field as keyof PatientFormState]).toBe(expected);
  });

  it.each(['weight', 'age', 'height', 'serumCreatinine'] as const)(
    'rejects non-numeric text in %s',
    field => {
      const errors = validatePatientForm(form({ [field]: '12abc' }));
      expect(errors[field]).toBe('validation.numberOnly');
    }
  );

  it('reports every invalid field at once, not just the first', () => {
    const errors = validatePatientForm(
      form({ age: '', weight: 'x', height: '999' })
    );
    expect(Object.keys(errors).sort()).toEqual(['age', 'height', 'weight']);
  });
});

describe('buildPatient', () => {
  it('returns null for an invalid form so a calculation cannot run on it', () => {
    expect(buildPatient(form({ weight: '' }))).toBeNull();
    expect(buildPatient(form({ height: 'abc' }))).toBeNull();
  });

  it('builds a domain patient with a derived BSA', () => {
    const patient = buildPatient(form());
    expect(patient).not.toBeNull();
    expect(patient!.age).toBe(40);
    expect(patient!.weight).toBe(70);
    expect(patient!.bsa).toBeCloseTo(1.84, 2);
    expect(patient!.serumCreatinine).toBe(1);
  });

  it('leaves serumCreatinine undefined when not measured', () => {
    // Defaulting to 1.0 mg/dL would invent a normal renal function the clinician
    // never entered, and silence the "renal function not assessed" warning.
    const patient = buildPatient(form({ serumCreatinine: '' }));
    expect(patient).not.toBeNull();
    expect(patient!.serumCreatinine).toBeUndefined();
  });

  it('honours a comma decimal separator', () => {
    expect(buildPatient(form({ weight: '70,5' }))!.weight).toBe(70.5);
  });
});

describe('derivePatientMetrics', () => {
  it('returns nulls rather than NaN for an invalid form', () => {
    expect(derivePatientMetrics(form({ weight: '' }))).toEqual({
      bsa: null,
      bmi: null,
      renal: null,
    });
  });

  it('derives BSA, BMI and an adult creatinine clearance', () => {
    const metrics = derivePatientMetrics(form());
    expect(metrics.bsa).toBeCloseTo(1.84, 2);
    expect(metrics.bmi).toBeCloseTo(22.9, 1);
    expect(metrics.renal?.method).toBe('cockcroft-gault');
  });

  it('switches to Schwartz for a paediatric patient', () => {
    const metrics = derivePatientMetrics(
      form({ age: '8', weight: '25', height: '130', serumCreatinine: '0.5' })
    );
    expect(metrics.renal?.method).toBe('schwartz');
    expect(metrics.renal?.unit).toBe('mL/min/1.73m²');
  });

  it('reports no renal estimate when creatinine was not entered', () => {
    expect(
      derivePatientMetrics(form({ serumCreatinine: '' })).renal
    ).toBeNull();
  });
});
