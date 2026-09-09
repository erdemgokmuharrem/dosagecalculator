import {
  calculateChemotherapyDose,
  calculateBSA,
  calculateGFR,
  getDoseReductionFactors,
  PatientInfo,
} from '../calculations';
import {
  CHEMOTHERAPY_DRUGS,
  ChemotherapyDrug,
} from '../../../data/chemotherapy';

/**
 * Chemotherapy engine.
 *
 * These are cytotoxic agents, so every test here is about the engine refusing to
 * guess. The behaviours locked down below all replaced a previous silent default.
 */

const adult = (over: Partial<PatientInfo> = {}): PatientInfo => ({
  weight: 70,
  height: 175,
  age: 55,
  gender: 'male',
  ...over,
});

const byId = (id: string): ChemotherapyDrug => {
  const drug = CHEMOTHERAPY_DRUGS.find(d => d.id === id);
  if (!drug) throw new Error(`fixture drug missing: ${id}`);
  return drug;
};

const ok = (r: ReturnType<typeof calculateChemotherapyDose>) => {
  if (r.status !== 'success')
    throw new Error(`expected success, blocked: ${r.messageCode}`);
  return r;
};

describe('anthropometrics', () => {
  it('matches the shared Mosteller implementation', () => {
    expect(calculateBSA(70, 175)).toBeCloseTo(Math.sqrt((175 * 70) / 3600), 10);
  });

  it('requires an explicit creatinine for GFR', () => {
    expect(calculateGFR(70, 55, 'male', 1.0)).toBeCloseTo(
      ((140 - 55) * 70) / (72 * 1),
      3
    );
    expect(calculateGFR(70, 55, 'female', 1.0)).toBeCloseTo(
      calculateGFR(70, 55, 'male', 1.0) * 0.85,
      3
    );
  });
});

describe('BSA-dosed agents', () => {
  it('uses the protocol rate recorded on the drug', () => {
    const result = ok(calculateChemotherapyDose(byId('cisplatin'), adult()));
    // BSA 1.8447 m² × 75 mg/m² = 138.35 mg, rounded to one decimal.
    expect(result.calculatedDose.dose).toBeCloseTo(138.3, 1);
    expect(result.calculatedDose.method).toBe('BSA');
  });

  it('compares against a BSA-scaled ceiling, not the raw mg/m² figure', () => {
    // cisplatin maxDailyDose is 100 mg/m². The old engine compared 138 mg against
    // 100 and reported an overdose for every patient above 1 m².
    const result = ok(calculateChemotherapyDose(byId('cisplatin'), adult()));
    expect(result.safety.maxDose).toBeCloseTo(184.5, 1);
    expect(result.safety.isWithinLimits).toBe(true);
    expect(result.safety.cappedByMaximumDose).toBe(false);
  });

  it('caps the dose when the BSA-scaled ceiling is exceeded', () => {
    // paclitaxel rate 175 mg/m² equals its 175 mg/m² ceiling, so any rounding
    // above it must clamp rather than warn-and-continue.
    const drug: ChemotherapyDrug = { ...byId('paclitaxel'), maxDailyDose: 100 };
    const result = ok(calculateChemotherapyDose(drug, adult()));
    expect(result.safety.cappedByMaximumDose).toBe(true);
    expect(result.calculatedDose.dose).toBeCloseTo(184.5, 1);
    expect(result.safety.warnings.map(w => w.code)).toContain(
      'chemo.safety.doseCapped'
    );
  });

  it('refuses a BSA agent that has no recorded protocol rate', () => {
    // Previously this returned bsa × (maxDailyDose × 0.8) — not a dose.
    const drug: ChemotherapyDrug = {
      ...byId('cisplatin'),
      standardDosePerM2: undefined,
    };
    const result = calculateChemotherapyDose(drug, adult());
    expect(result.status).toBe('blocked');
    if (result.status === 'blocked')
      expect(result.messageCode).toBe('chemo.blocked.noProtocolRate');
  });
});

describe('weight-dosed agents', () => {
  it('refuses when no mg/kg rate is recorded', () => {
    // Previously every weight-dosed cytotoxic returned a flat weight × 1.5.
    const drug: ChemotherapyDrug = {
      ...byId('cisplatin'),
      calculationMethod: 'Weight',
      standardDosePerKg: undefined,
    };
    const result = calculateChemotherapyDose(drug, adult());
    expect(result.status).toBe('blocked');
    if (result.status === 'blocked')
      expect(result.messageCode).toBe('chemo.blocked.noProtocolRate');
  });

  it('uses the recorded mg/kg rate when present', () => {
    const drug: ChemotherapyDrug = {
      ...byId('cisplatin'),
      calculationMethod: 'Weight',
      standardDosePerKg: 2,
      maxDailyDose: 1000,
    };
    const result = ok(calculateChemotherapyDose(drug, adult({ weight: 60 })));
    expect(result.calculatedDose.dose).toBe(120);
  });
});

describe('carboplatin (Calvert)', () => {
  const carboplatin = () => byId('carboplatin');

  it('refuses without a target AUC', () => {
    const result = calculateChemotherapyDose(
      carboplatin(),
      adult({ serumCreatinine: 1.0 })
    );
    expect(result.status).toBe('blocked');
    if (result.status === 'blocked')
      expect(result.messageCode).toBe('chemo.blocked.aucRequired');
  });

  it('refuses without a measured renal function', () => {
    // The old engine defaulted creatinine to 1.0 mg/dL and dosed off the result.
    const result = calculateChemotherapyDose(carboplatin(), adult({ auc: 5 }));
    expect(result.status).toBe('blocked');
    if (result.status === 'blocked')
      expect(result.messageCode).toBe('chemo.blocked.gfrRequired');
  });

  it('applies the Calvert equation with a measured GFR', () => {
    const result = ok(
      calculateChemotherapyDose(carboplatin(), adult({ auc: 5, gfr: 80 }))
    );
    // 5 × (80 + 25) = 525 mg, under the BSA-scaled ceiling.
    expect(result.calculatedDose.dose).toBeCloseTo(525, 1);
    expect(result.calculatedDose.method).toContain('Calvert');
  });

  it('caps GFR at 125 mL/min, as the Calvert method requires', () => {
    const result = ok(
      calculateChemotherapyDose(carboplatin(), adult({ auc: 5, gfr: 200 }))
    );
    // Without the cap this would be 5 × 225 = 1125 mg.
    expect(result.calculatedDose.dose).toBeCloseTo(750, 1);
    expect(result.safety.warnings.map(w => w.code)).toContain(
      'chemo.safety.gfrCapped'
    );
  });

  it('derives GFR from a serum creatinine when no GFR is supplied', () => {
    const result = ok(
      calculateChemotherapyDose(
        carboplatin(),
        adult({ auc: 5, serumCreatinine: 1.0 })
      )
    );
    expect(result.patientInfo.gfr).toBeCloseTo(82.6, 0);
  });
});

describe('refusals on bad input', () => {
  it.each([
    ['zero weight', { weight: 0 }],
    ['negative height', { height: -10 }],
    ['NaN age', { age: NaN }],
  ])('refuses %s', (_label, over) => {
    const result = calculateChemotherapyDose(
      byId('cisplatin'),
      adult(over as Partial<PatientInfo>)
    );
    expect(result.status).toBe('blocked');
  });

  it('refuses implausible anthropometrics', () => {
    const result = calculateChemotherapyDose(
      byId('cisplatin'),
      adult({ weight: 900 })
    );
    expect(result.status).toBe('blocked');
    if (result.status === 'blocked') {
      expect(result.messageCode).toBe('chemo.blocked.implausiblePatient');
    }
  });

  it('refuses an unknown calculation method instead of throwing', () => {
    const drug = {
      ...byId('cisplatin'),
      calculationMethod: 'Telepathy',
    } as unknown as ChemotherapyDrug;
    // The old engine threw a raw Error that the screen did not catch.
    expect(() => calculateChemotherapyDose(drug, adult())).not.toThrow();
    expect(calculateChemotherapyDose(drug, adult()).status).toBe('blocked');
  });
});

describe('clinical flags', () => {
  it('escalates paediatric patients', () => {
    const result = ok(
      calculateChemotherapyDose(
        byId('cisplatin'),
        adult({ age: 12, weight: 40, height: 150 })
      )
    );
    const warning = result.safety.warnings.find(
      w => w.code === 'chemo.safety.pediatric'
    );
    expect(warning?.severity).toBe('critical');
  });

  it('says so when renal function was never measured', () => {
    const result = ok(calculateChemotherapyDose(byId('cisplatin'), adult()));
    expect(result.safety.warnings.map(w => w.code)).toContain(
      'chemo.safety.renalNotAssessed'
    );
  });

  it('flags severe renal impairment as critical', () => {
    const result = ok(
      calculateChemotherapyDose(
        byId('cisplatin'),
        adult({ age: 75, weight: 60, serumCreatinine: 4.0 })
      )
    );
    const warning = result.safety.warnings.find(
      w => w.code === 'chemo.safety.severeRenal'
    );
    expect(warning?.severity).toBe('critical');
  });

  it('always marks the rule as unverified', () => {
    const result = ok(calculateChemotherapyDose(byId('cisplatin'), adult()));
    expect(result.safety.warnings.map(w => w.code)).toContain(
      'chemo.safety.unverified'
    );
  });
});

describe('dose reduction factors', () => {
  it('applies no renal factor when renal function is unknown', () => {
    // Previously a creatinine of 1.0 was assumed and a factor derived from it.
    expect(getDoseReductionFactors(adult({ age: 60 })).renal).toBeUndefined();
  });

  it('applies a renal factor once a creatinine is supplied', () => {
    const factors = getDoseReductionFactors(
      adult({ age: 75, weight: 60, serumCreatinine: 4.0 })
    );
    expect(factors.renal).toBe(0.5);
  });

  it('applies an age factor above 70', () => {
    expect(getDoseReductionFactors(adult({ age: 75 })).age).toBe(0.8);
    expect(getDoseReductionFactors(adult({ age: 55 })).age).toBeUndefined();
  });
});

describe('every shipped chemotherapy drug', () => {
  it('either doses a standard adult or refuses for a declared reason', () => {
    const failures: string[] = [];

    for (const drug of CHEMOTHERAPY_DRUGS) {
      const patient = adult({ serumCreatinine: 1.0, auc: 5 });
      const result = calculateChemotherapyDose(drug, patient);

      if (result.status === 'blocked') {
        failures.push(`${drug.id}: blocked (${result.messageCode})`);
        continue;
      }
      if (
        !Number.isFinite(result.calculatedDose.dose) ||
        result.calculatedDose.dose <= 0
      ) {
        failures.push(`${drug.id}: invalid dose ${result.calculatedDose.dose}`);
      }
      if (
        typeof result.safety.maxDose === 'number' &&
        result.calculatedDose.dose > result.safety.maxDose
      ) {
        failures.push(
          `${drug.id}: ${result.calculatedDose.dose} exceeds ceiling ${result.safety.maxDose}`
        );
      }
    }

    expect(failures).toEqual([]);
  });
});
