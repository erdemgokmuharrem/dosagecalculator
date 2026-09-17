# Doz doğrulama verisi

- `verification.json` — her ilaç kaydının halka açık kaynakla karşılaştırma
  sonucu (kimliğe göre): kayıttaki değer, kaynak, sonuç, ciddiyet, not,
  önerilen değer ve varsa çapraz kontrolün çürütme gerekçesi.
- `report.py` — bu dosyadan ve katalogdan `DOSE_VERIFICATION.md` üretir.

Raporu yeniden üretmek için (katalog TypeScript olduğu için önce Jest ile
JSON'a dökülür):

```bash
node scripts/dose-verification/dump-catalogue.mjs /tmp/catalogue.json
python3 scripts/dose-verification/report.py /tmp/catalogue.json
npx prettier --write DOSE_VERIFICATION.md
```

Düzeltmeler `scripts/apply-dose-patch.mjs` ile uygulanır. Kaynakla
karşılaştırma klinik imza değildir; hiçbir kayıt `REVIEWED` yapılmamalıdır.
