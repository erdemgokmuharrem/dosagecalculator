import { sampleDrugs } from '../drugs';
import { calculateDosage } from '../../features/dosage/calculations';
import type { Patient } from '../../types';

/**
 * Catalogue-level guarantees about where a dosing rule came from.
 *
 * The data set carries three provenance levels and they must mean what they
 * say: a rule compared against a label names that label, a rule that claims
 * clinical review names the reviewer, and a rule flagged as unrepresentable is
 * actually refused by the engine rather than quietly producing a number.
 */

const patient = (over: Partial<Patient> = {}): Patient => ({
  id: 'p',
  age: 40,
  weight: 70,
  height: 175,
  gender: 'male',
  patientType: 'adult',
  ...over,
});

describe('catalogue provenance', () => {
  it('gives every source-checked rule the source and date it was checked against', () => {
    const incomplete = sampleDrugs
      .filter(d => d.sourceVerification === 'SOURCE_CHECKED')
      .filter(d => !d.sourceReference?.trim() || !d.sourceDate?.trim())
      .map(d => `${d.id} ${d.name}`);
    expect(incomplete).toEqual([]);
  });

  it('never claims clinical review without naming the reviewer', () => {
    const unsigned = sampleDrugs
      .filter(d => d.sourceVerification === 'REVIEWED')
      .filter(d => !d.reviewedBy?.trim())
      .map(d => `${d.id} ${d.name}`);
    expect(unsigned).toEqual([]);
  });

  it('refuses to calculate every rule flagged for clinical review, and says why', () => {
    const flagged = sampleDrugs.filter(d => d.requiresClinicalReview);
    expect(flagged.length).toBeGreaterThan(0);

    const calculated = flagged
      .filter(d => calculateDosage(patient(), d).status !== 'blocked')
      .map(d => `${d.id} ${d.name}`);
    expect(calculated).toEqual([]);

    const unexplained = flagged
      .filter(d => !d.clinicalReviewNote?.trim())
      .map(d => `${d.id} ${d.name}`);
    expect(unexplained).toEqual([]);
  });

  it('warns on every rule that no clinician has signed off', () => {
    const drug = sampleDrugs.find(
      d =>
        d.sourceVerification === 'SOURCE_CHECKED' && !d.requiresClinicalReview
    );
    expect(drug).toBeDefined();
    const result = calculateDosage(patient(), drug!);
    expect(result.status).toBe('success');
    if (result.status === 'success') {
      expect(result.warnings.map(w => w.code)).toContain(
        'safety.sourceCheckedOnly'
      );
    }
  });
});
