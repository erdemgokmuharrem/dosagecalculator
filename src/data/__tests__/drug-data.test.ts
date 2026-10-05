import {
  sampleDrugs,
  getDrugById,
  getDrugsByCategory,
  searchDrugs,
} from '../drugs';
import {
  getDosesPerDay,
  calculateDosage,
  isUnscheduledFrequency,
} from '../../features/dosage/calculations';
import { hasCritical } from '../../features/dosage/warnings';
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

  it('keeps renal bands ordered, with factors between 0 and 1', () => {
    // The engine applies a renal factor after the single-dose ceiling and
    // ignores one outside 0-1, since above 1 it would lift the dose over the
    // ceiling. An ignored band is a renal rule lost, so it must not ship.
    const bad = sampleDrugs
      .filter(d =>
        (d.dosageFormula.renalAdjustments ?? []).some(
          r =>
            !(r.minGFR < r.maxGFR) ||
            !(r.adjustmentFactor >= 0 && r.adjustmentFactor <= 1)
        )
      )
      .map(d => `${d.id} (${d.name})`);
    expect(bad).toEqual([]);
  });

  it('never lets renal bands overlap', () => {
    // Bands are half-open [minGFR, maxGFR), so 0-30 and 30-60 only touch. The
    // engine resolves a real overlap to the most restrictive band, but which
    // rule applies should come from the record, not from that fallback.
    const overlapping = sampleDrugs
      .filter(d => {
        const bands = d.dosageFormula.renalAdjustments ?? [];
        return bands.some((a, i) =>
          bands.some(
            (b, j) => i !== j && a.minGFR < b.maxGFR && b.minGFR < a.maxGFR
          )
        );
      })
      .map(d => `${d.id} (${d.name})`);
    expect(overlapping).toEqual([]);
  });

  it('cannot hide a daily-ceiling breach behind a dose reduction', () => {
    // A reduction (a renal factor, or an age band below 1) scales the dose after
    // the single-dose ceiling, but the daily total is checked against the
    // record's unreduced daily maximum. Halving a regimen that breaches that
    // maximum can bring it under the maximum while it is still over half of it,
    // and nothing flags that. A single-dose ceiling that fits the daily maximum
    // on every schedule the record uses rules it out.
    const bad = sampleDrugs.flatMap(d => {
      const f = d.dosageFormula;
      const single = f.maxSingleDose;
      const daily = f.maxDailyDose ?? d.maxDailyDose;
      const reduces = [
        ...(f.ageAdjustments ?? []),
        ...(f.renalAdjustments ?? []),
      ].some(b => b.adjustmentFactor > 0 && b.adjustmentFactor < 1);
      if (!reduces || typeof single !== 'number' || typeof daily !== 'number')
        return [];
      return [
        f.frequency,
        ...(f.renalAdjustments ?? []).map(r => r.frequencyOverride),
      ]
        .filter(
          (s): s is string =>
            typeof s === 'string' && !isUnscheduledFrequency(s)
        )
        .filter(s => single * (getDosesPerDay(s) ?? 0) > daily + 1e-9)
        .map(s => `${d.id} (${d.name}): ${single} ${d.unit} ${s} > ${daily}`);
    });
    expect(bad).toEqual([]);
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

  it('never shows a dose as within safe limits above a critical warning', () => {
    // Regression: with the 85-year-old below (CrCl 15.4), meropenem,
    // ampicillin/sulbactam and ticarcillin/clavulanate were "within safe
    // limits" while warning that no renal rule covered her kidney function.
    const panel: Patient[] = [
      standardAdult,
      {
        ...standardAdult,
        age: 85,
        weight: 38,
        height: 150,
        gender: 'female',
        serumCreatinine: 1.6,
        patientType: 'elderly',
      },
      { ...standardAdult, age: 70, weight: 110, serumCreatinine: 4.0 },
      {
        ...standardAdult,
        age: 8,
        weight: 30,
        height: 130,
        serumCreatinine: 2.0,
        patientType: 'child',
      },
    ];
    const failures: string[] = [];
    for (const drug of sampleDrugs) {
      for (const p of panel) {
        const result = calculateDosage(p, drug);
        if (
          result.status === 'success' &&
          result.isWithinLimits &&
          hasCritical(result.warnings)
        ) {
          failures.push(`${drug.id} (${drug.name}), age ${p.age}`);
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it('never lets the single-dose ceiling absorb a renal reduction', () => {
    // Regression: the renal factor was applied before the cap, so at CrCl < 30
    // clarithromycin (500 mg cap, halved) gave an 80 kg adult 300 mg and a
    // 100 kg one 375 mg instead of 250 mg.
    const failures: string[] = [];
    for (const drug of sampleDrugs) {
      const ceiling = drug.dosageFormula.maxSingleDose;
      if (!drug.dosageFormula.renalAdjustments?.length) continue;
      if (typeof ceiling !== 'number') continue;
      for (const weight of [60, 80, 100, 140]) {
        for (const serumCreatinine of [1.5, 3, 6]) {
          const result = calculateDosage(
            { ...standardAdult, age: 70, weight, serumCreatinine },
            drug
          );
          if (
            result.status === 'success' &&
            result.doseMg > ceiling * result.renalFactor
          ) {
            failures.push(
              `${drug.id} (${drug.name}), ${weight} kg, SCr ${serumCreatinine}: ${result.doseMg} > ${ceiling} × ${result.renalFactor}`
            );
          }
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it('never lets the single-dose ceiling absorb an age reduction', () => {
    // Regression: an age factor below 1 was applied before the cap, so a band
    // for older patients on a per-kg record did nothing once the dose came from
    // the ceiling (15 mg/kg, max 1000 mg, 0.8 from 65 y: 1000 mg from 84 kg).
    const failures: string[] = [];
    for (const drug of sampleDrugs) {
      const ceiling = drug.dosageFormula.maxSingleDose;
      if (typeof ceiling !== 'number') continue;
      for (const band of drug.dosageFormula.ageAdjustments ?? []) {
        if (!(band.adjustmentFactor > 0 && band.adjustmentFactor < 1)) continue;
        const age = (band.minAge + band.maxAge) / 2;
        for (const weight of [20, 60, 100, 140]) {
          const result = calculateDosage(
            { ...standardAdult, age, weight, height: 170 },
            drug
          );
          if (result.status !== 'success') continue;
          if (
            result.doseMg >
            ceiling * result.ageFactor * result.renalFactor + 0.01
          ) {
            failures.push(
              `${drug.id} (${drug.name}), age ${age}, ${weight} kg: ${result.doseMg} > ${ceiling} × ${result.ageFactor} × ${result.renalFactor}`
            );
          }
        }
      }
    }
    expect(failures).toEqual([]);
  });
});
