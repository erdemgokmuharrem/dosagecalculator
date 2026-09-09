# TEST PLAN (DOZ HESAPLAMA DOĞRULAMASI)

## Mimari

Test mimarisi **Jest** üzerine kurulacak ve mülk tabanlı (property-based) testler için **fast-check** kütüphanesi kullanılacaktır.

## 1. Sınır (Boundary) ve Hata Testleri

Her etken madde/preparat kombinasyonu için `jest` kullanılarak statik test senaryoları koşulacaktır:

- **Eksik Veri:** Hasta kilosu, boyu veya yaşı verilmediğinde (veya 0 / negatif girildiğinde) hesaplamanın TypeError veya undefined yerine güvenli bir şekilde `{ status: 'blocked', reason: 'MISSING_PATIENT_DATA' }` dönüp dönmediği.
- **Maksimum Doz Sınırı:** Parasetamol (maks 1000mg/tek doz, 4000mg/günlük). 100 kg bir hasta için 15mg/kg'dan 1500mg hesaplandığında, sistemin dozu 1000mg'a çekip `cappedByMaximumDose: true` işareti koyup koymadığı.
- **Konsantrasyon Çevrimi:** 100mg/5mL formülündeki ilacın 400mg doz istendiğinde 20 mL olarak hacim (volume) çıkarıp çıkarmadığı.

## 2. Property-Based Testing (fast-check)

Dozaj formülleri için matematiksel sarsılmaz kurallar (invariants) test edilecek:

```typescript
fc.assert(
  fc.property(
    fc.integer({ min: 1, max: 200 }), // Kilo (kg)
    (weight) => {
      const result = calculateDosage({ weight, ... }, paracetamolDrug);
      // Kural 1: Hesaplanan doz ASLA maksimum tek dozu (1000mg) geçemez.
      return result.doseMg <= 1000;
    }
  )
);
```

```typescript
fc.assert(
  fc.property(
    fc.integer({ min: 1, max: 150 }), // Kilo (kg)
    (weight) => {
      const result = calculateDosage({ weight, ... }, amoxicillin);
      // Kural 2: Negatif kilo üretimi engellendiğinden her zaman pozitif doz veya blocked döner.
      return result.status === 'blocked' || result.doseMg > 0;
    }
  )
);
```

## 3. Golden Test Veri Seti

`__tests__/golden-dataset.json` dosyası oluşturulup, TİTCK veya FDA kılavuzundan birebir alınmış spesifik örnek vakalar (ör: 5 yaşında, 20 kg çocuk -> Parasetamol dozu X mg'dır) sisteme girilecek ve motorun bu beklenen sonucu miligramına kadar (yuvarlama kuralı dâhil) tam eşleştirmesi sağlanacaktır. (Regression Testing).
