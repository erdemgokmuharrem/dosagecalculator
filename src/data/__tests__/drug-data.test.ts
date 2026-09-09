import {
  sampleDrugs,
  getDrugById,
  getDrugsByCategory,
  searchDrugs,
} from '../drugs';
import {
  getDosesPerDay,
  calculateDosage,
} from '../../features/dosage/calculations';
import type { Patient } from '../../types';

/**
 * Data-integrity guardrails for the shipped drug database.
 *
 * The calculation engine is only as safe as the records it is given. A drug that
 * ships without a single-dose ceiling, or with a frequency string the engine
 * cannot parse, silently degrades a safety check. These tests make that a build
 * failure rather than a field incident.
 */
describe('shipped drug database', () => {
  it('is non-empty', () => {
    expect(sampleDrugs.length).toBeGreaterThan(0);
  });

  it('has no duplicate ids', () => {
    const ids = sampleDrugs.map(d => d.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });

  it('gives every drug a dosage formula with a supported method', () => {
    const bad = sampleDrugs
      .filter(
        d =>
          !d.dosageFormula ||
          !['weight', 'bsa', 'age', 'fixed'].includes(d.dosageFormula.method)
      )
      .map(d => d.id);
    expect(bad).toEqual([]);
  });

  it('gives every drug the dose field its method requires', () => {
    const bad = sampleDrugs
      .filter(d => {
        const f = d.dosageFormula;
        if (f.method === 'weight')
          return !(typeof f.dosePerKg === 'number' && f.dosePerKg > 0);
        if (f.method === 'bsa')
          return !(typeof f.dosePerM2 === 'number' && f.dosePerM2 > 0);
        return !(typeof f.fixedDose === 'number' && f.fixedDose > 0);
      })
      .map(d => `${d.id} (${d.dosageFormula.method})`);
    expect(bad).toEqual([]);
  });

  it('gives every drug a maximum single dose so the engine can cap it', () => {
    const bad = sampleDrugs
      .filter(
        d =>
          typeof d.dosageFormula.maxSingleDose !== 'number' ||
          d.dosageFormula.maxSingleDose <= 0
      )
      .map(d => d.id);
    expect(bad).toEqual([]);
  });

  it('gives every drug a maximum daily dose', () => {
    const bad = sampleDrugs
      .filter(d => {
        const max = d.dosageFormula.maxDailyDose ?? d.maxDailyDose;
        return typeof max !== 'number' || max <= 0;
      })
      .map(d => d.id);
    expect(bad).toEqual([]);
  });

  it('uses only frequency codes the engine can convert to a daily total', () => {
    // A code the engine cannot parse disables the daily-overdose check for that drug.
    const bad = sampleDrugs
      .filter(d => getDosesPerDay(d.dosageFormula.frequency) === null)
      .map(d => `${d.id}: "${d.dosageFormula.frequency}"`);
    expect(bad).toEqual([]);
  });

  it('never sets a single-dose ceiling above the daily ceiling', () => {
    const bad = sampleDrugs
      .filter(d => {
        const single = d.dosageFormula.maxSingleDose;
        const daily = d.dosageFormula.maxDailyDose ?? d.maxDailyDose;
        return (
          typeof single === 'number' &&
          typeof daily === 'number' &&
          single > daily
        );
      })
      .map(d => d.id);
    expect(bad).toEqual([]);
  });

  it('keeps age bands ordered and non-inverted', () => {
    // adjustmentFactor === 0 is the data set's "contraindicated at this age"
    // marker (aspirin < 12, fluoroquinolones < 18). Only negatives are invalid.
    const bad = sampleDrugs
      .filter(d =>
        (d.dosageFormula.ageAdjustments ?? []).some(
          a => a.minAge > a.maxAge || a.adjustmentFactor < 0
        )
      )
      .map(d => d.id);
    expect(bad).toEqual([]);
  });

  it('never lets a contraindication band be shadowed by a permissive one', () => {
    // Bands use inclusive bounds, so adjacent ranges legitimately touch at a
    // single endpoint (maxAge 12 / minAge 12). Only a genuine span overlap is a
    // defect: that is what let a 0-factor contraindication band be shadowed by a
    // permissive one depending on array order.
    const overlapping = sampleDrugs
      .filter(d => {
        const bands = d.dosageFormula.ageAdjustments ?? [];
        return bands.some((a, i) =>
          bands.some(
            (b, j) => i !== j && a.minAge < b.maxAge && b.minAge < a.maxAge
          )
        );
      })
      .map(d => `${d.id} (${d.name})`);
    expect(overlapping).toEqual([]);
  });

  it('resolves an endpoint tie to the most restrictive band', () => {
    // A 12-year-old matches both aspirin's contraindication band (0-12) and its
    // 12-16 band. The contraindication must win.
    const aspirin = sampleDrugs.find(d => d.id === '11');
    expect(aspirin).toBeDefined();
    const twelve: Patient = {
      id: 'edge',
      age: 12,
      weight: 40,
      height: 150,
      gender: 'female',
      patientType: 'child',
    };
    expect(calculateDosage(twelve, aspirin!).status).toBe('blocked');
  });

  it('resolves every drug by id', () => {
    for (const drug of sampleDrugs) {
      expect(getDrugById(drug.id)?.id).toBe(drug.id);
    }
  });

  it('returns only matching drugs from a category lookup', () => {
    const category = sampleDrugs[0].category;
    for (const drug of getDrugsByCategory(category)) {
      expect(drug.category).toBe(category);
    }
  });

  it('finds a drug by its own name', () => {
    const target = sampleDrugs[0];
    expect(searchDrugs(target.name).map(d => d.id)).toContain(target.id);
  });
});

describe('every shipped drug produces a usable result for a standard adult', () => {
  const standardAdult: Patient = {
    id: 'std',
    age: 40,
    weight: 70,
    height: 175,
    gender: 'male',
    patientType: 'adult',
    serumCreatinine: 1.0,
  };

  it('never returns NaN and never exceeds its own single-dose ceiling', () => {
    const failures: string[] = [];

    for (const drug of sampleDrugs) {
      const result = calculateDosage(standardAdult, drug);

      if (result.status === 'blocked') {
        // Blocking is a legitimate safe state, but only for a declared reason.
        const expected =
          drug.requiresClinicalReview ||
          (drug.dosageFormula.ageAdjustments ?? []).some(
            a =>
              a.adjustmentFactor === 0 &&
              standardAdult.age >= a.minAge &&
              standardAdult.age <= a.maxAge
          );
        if (!expected)
          failures.push(
            `${drug.id}: unexpectedly blocked (${result.messageCode})`
          );
        continue;
      }

      if (!Number.isFinite(result.doseMg)) {
        failures.push(`${drug.id}: non-finite dose`);
        continue;
      }
      if (result.doseMg <= 0) {
        failures.push(`${drug.id}: non-positive dose ${result.doseMg}`);
      }
      const ceiling = drug.dosageFormula.maxSingleDose;
      if (typeof ceiling === 'number' && result.doseMg > ceiling) {
        failures.push(`${drug.id}: ${result.doseMg} > ceiling ${ceiling}`);
      }
      // PRN has no fixed schedule, so an automated daily ceiling check is not
      // possible — the engine flags that instead. Every other drug must be checked.
      if (
        !result.dailyCheckPerformed &&
        drug.dosageFormula.frequency !== 'prn'
      ) {
        failures.push(`${drug.id}: daily ceiling could not be verified`);
      }
    }

    expect(failures).toEqual([]);
  });

  it('refuses to dose drugs that are contraindicated at the patient’s age', () => {
    const child: Patient = {
      ...standardAdult,
      age: 8,
      weight: 25,
      height: 130,
      patientType: 'child',
    };
    // Aspirin (Reye's) and the fluoroquinolones are contraindicated in children.
    for (const id of ['11', '23', '24']) {
      const drug = sampleDrugs.find(d => d.id === id);
      if (!drug) continue;
      const result = calculateDosage(child, drug);
      expect(result.status).toBe('blocked');
      if (result.status === 'blocked') {
        expect(result.messageCode).toBe('blocked.contraindicatedAge');
      }
    }
  });

  it('doses ibuprofen for a five-year-old', () => {
    // Regression: the 0-6 band (written in months, read as years) previously
    // shadowed the paediatric band and blocked every child under six.
    const child: Patient = {
      ...standardAdult,
      age: 5,
      weight: 18,
      height: 110,
      patientType: 'child',
    };
    const ibuprofen = sampleDrugs.find(d => d.id === '2');
    expect(ibuprofen).toBeDefined();
    const result = calculateDosage(child, ibuprofen!);
    expect(result.status).toBe('success');
    if (result.status === 'success') expect(result.doseMg).toBeGreaterThan(0);
  });
});
