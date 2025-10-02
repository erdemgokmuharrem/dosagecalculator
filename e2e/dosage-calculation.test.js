const { device, expect, element, by, waitFor } = require('detox');

describe('Dosage Calculation Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete full dosage calculation flow', async () => {
    // Wait for home screen to load
    await waitFor(element(by.text('İlaç Doz Hesaplama')))
      .toBeVisible()
      .withTimeout(10000);

    // Start calculation by tapping "Başla" button
    await element(by.text('Başla')).tap();

    // Wait for patient info screen
    await waitFor(element(by.text('Hasta Bilgileri')))
      .toBeVisible()
      .withTimeout(5000);

    // Fill patient information
    await element(by.id('age-input')).typeText('30');
    await element(by.id('weight-input')).typeText('70');
    await element(by.id('height-input')).typeText('170');

    // Select gender (male)
    await element(by.text('Erkek')).tap();

    // Select patient type (adult)
    await element(by.text('Adult (18-64 years)')).tap();

    // Submit form
    await element(by.text('Devam Et')).tap();

    // Wait for drug selection screen
    await waitFor(element(by.text('İlaç Seç')))
      .toBeVisible()
      .withTimeout(5000);

    // Search for a drug
    await element(by.id('drug-search')).typeText('paracetamol');

    // Select first drug from results
    await element(by.id('drug-item-0')).tap();

    // Wait for dosage calculation screen
    await waitFor(element(by.text('Hesaplanan Doz')))
      .toBeVisible()
      .withTimeout(5000);

    // Verify calculation result is displayed
    await expect(element(by.id('dosage-result'))).toBeVisible();

    // Save calculation
    await element(by.text('Kaydet')).tap();

    // Navigate to history
    await element(by.text('Hesaplama Geçmişi')).tap();

    // Verify calculation appears in history
    await waitFor(element(by.id('calculation-history-item-0')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should validate patient information', async () => {
    // Start calculation
    await element(by.text('Başla')).tap();

    // Try to submit without filling required fields
    await element(by.text('Devam Et')).tap();

    // Should show validation error
    await expect(element(by.text('Yaş 0\'dan büyük olmalıdır'))).toBeVisible();
  });

  it('should handle drug search and filtering', async () => {
    // Navigate to drug selection
    await element(by.text('Başla')).tap();
    
    // Fill minimal patient info
    await element(by.id('age-input')).typeText('30');
    await element(by.id('weight-input')).typeText('70');
    await element(by.id('height-input')).typeText('170');
    await element(by.text('Devam Et')).tap();

    // Test drug search
    await element(by.id('drug-search')).typeText('antibiotic');
    
    // Verify search results
    await waitFor(element(by.id('drug-list')))
      .toBeVisible()
      .withTimeout(5000);

    // Test category filtering
    await element(by.text('Antibiotics')).tap();
    
    // Verify filtered results
    await expect(element(by.id('drug-list'))).toBeVisible();
  });
});
