const { device, expect, element, by, waitFor } = require('detox');

/**
 * End-to-end dose calculation flow.
 *
 * The previous version of this spec drove a navigation flow that no longer
 * exists (Home → "Başla" → PatientInfo → "Devam Et" → DrugSelection) and
 * addressed testIDs that were never present in the app, so it could not have
 * passed. It now targets the single-screen calculator and the testIDs added
 * alongside it.
 */

const VISIBLE_TIMEOUT = 10000;

const fillPatient = async ({ age, weight, height, creatinine }) => {
  await element(by.id('age-input')).replaceText(age);
  await element(by.id('weight-input')).replaceText(weight);
  await element(by.id('height-input')).replaceText(height);
  if (creatinine !== undefined) {
    await element(by.id('creatinine-input')).replaceText(creatinine);
  }
};

const selectFirstDrug = async query => {
  await element(by.id('drug-search')).replaceText(query);
  await waitFor(element(by.id('drug-item-0')))
    .toBeVisible()
    .withTimeout(VISIBLE_TIMEOUT);
  await element(by.id('drug-item-0')).tap();
};

describe('Dosage calculation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    // The medical disclaimer gates the app on first launch and must be accepted.
    try {
      await waitFor(element(by.id('disclaimer-accept')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('disclaimer-accept')).tap();
    } catch {
      // Already accepted on this simulator install.
    }
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('calculates a dose for a standard adult', async () => {
    await fillPatient({ age: '30', weight: '70', height: '170' });
    await selectFirstDrug('Paracetamol');

    await waitFor(element(by.id('result-dose')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await expect(element(by.id('result-dose'))).toBeVisible();
  });

  it('caps the dose and warns when the single-dose ceiling is exceeded', async () => {
    // A heavy adult on a mg/kg drug drives the calculation past maxSingleDose.
    await fillPatient({ age: '40', weight: '150', height: '185' });
    await selectFirstDrug('Paracetamol');

    await waitFor(element(by.id('result-dose')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    // The capped-dose warning is critical and must be on screen with the dose.
    await expect(element(by.text(/SINIRLANDIRILDI|CAPPED/i))).toBeVisible();
  });

  it('refuses to dose a drug contraindicated at the patient’s age', async () => {
    // Aspirin is contraindicated under 12 (Reye's syndrome); the engine must
    // refuse rather than render a 0 mg dose.
    await fillPatient({ age: '8', weight: '25', height: '130' });
    await selectFirstDrug('Aspirin');

    await waitFor(element(by.id('blocked-message')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);
    await expect(element(by.id('result-dose'))).not.toBeVisible();
  });

  it('rejects an implausible weight at the field', async () => {
    await fillPatient({ age: '30', weight: '900', height: '170' });
    await selectFirstDrug('Paracetamol');

    // No dose may be produced from an out-of-range input.
    await expect(element(by.id('result-dose'))).not.toBeVisible();
  });

  it('clears a displayed dose when the patient changes', async () => {
    await fillPatient({ age: '30', weight: '70', height: '170' });
    await selectFirstDrug('Paracetamol');
    await waitFor(element(by.id('result-dose')))
      .toBeVisible()
      .withTimeout(VISIBLE_TIMEOUT);

    // A stale dose next to edited inputs is how a wrong number gets read out.
    await element(by.id('weight-input')).replaceText('55');
    await expect(element(by.id('result-dose'))).not.toBeVisible();
  });
});
