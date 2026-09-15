# Doz Verisi Doğrulama Raporu

Son güncelleme: 2026-09-15

## Bu belge ne değildir

Bu bir **klinik onay değildir**. Kayıtlar halka açık otoriter kaynaklarla
(FDA etiketleri, ürün bilgileri, klinik kılavuzlar) karşılaştırılmıştır.
Hiçbir kayda hekim veya farmakolog onayı verilmemiştir; bu nedenle
`sourceVerification` alanı `REVIEWED` yapılmamıştır ve uygulama içindeki
"bağımsız klinik incelemeden geçmemiştir" uyarısı yerinde durmaktadır.

Aşağıdaki bulguların bir kısmı hasta zararına yol açabilecek büyüklüktedir.

## Öne çıkan kalıp: gün başına doz, doz başına girilmiş

Etiketler pek çok ilacın dozunu **mg/kg/gün** olarak verir ve bunu güne bölerek
uygular. Veri setinde aynı sayı **doz başına** alanına girilmiş ve üstüne
sıklık uygulanmıştır. Sonuç, sıklık kadar (2-4 kat) yüksek günlük dozdur.
Şimdiye kadar amoksisilin, gentamisin, tobramisin ve demirde doğrulanmıştır.

## 1. Yapısal denetim (kaynağa bakmadan, verinin kendi içinden)

### 1a. Mükerrer ilaç kayıtları: 12 grup

Aynı etkin madde birden fazla kayıtta var ve bazılarında doz farklı. Kullanıcının hangi kaydı seçtiğine göre farklı doz görmesi tek başına bir güvenlik hatasıdır.

| Etkin madde                  | Kayıtlar                                                                                                                  | Günlük doz |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------- |
| atorvastatin                 | id 14: Atorvastatin — 20 mg (sabit, q24h) <br> id 73: Atorvastatin — 20 mg (sabit, q24h)                                  | aynı       |
| ceftriaxone                  | id 19: Ceftriaxone — 50 mg (kg başına, q12h) <br> id 66: Seftriakson — 50 mg (kg başına, q24h)                            | **farklı** |
| clarithromycin               | id 28: Clarithromycin — 7.5 mg (kg başına, q12h) <br> id 65: Klaritromisin — 500 mg (sabit, bid)                          | **farklı** |
| doxycycline                  | id 29: Doxycycline — 100 mg (sabit, q12h) <br> id 69: Doksisiklin — 100 mg (sabit, bid)                                   | aynı       |
| furosemid                    | id 9: Furosemide — 1 mg (kg başına, q12h) <br> id 89: Furosemid — 1 mg (kg başına, q8h)                                   | **farklı** |
| ibuprofen                    | id 2: Ibuprofen — 10 mg (kg başına, q8h) <br> id extra-001: Ibuprofen Pediatrik Şurup — 100 mg (sabit, q8h)               | **farklı** |
| levofloxacin                 | id 24: Levofloxacin — 10 mg (kg başına, q24h) <br> id 64: Levofloksasin — 500 mg (sabit, q24h)                            | **farklı** |
| meropenem                    | id 16: Meropenem — 20 mg (kg başına, q8h) <br> id 62: Meropenem — 20 mg (kg başına, q8h)                                  | aynı       |
| metronidazol                 | id 31: Metronidazole — 7.5 mg (kg başına, q8h) <br> id 67: Metronidazol — 7.5 mg (kg başına, q8h)                         | aynı       |
| piperacillintazobactam       | id 21: Piperacillin/Tazobactam — 100 mg (kg başına, q6h) <br> id 61: Piperasilin/Tazobaktam — 100 mg (kg başına, q8h)     | **farklı** |
| trimethoprimsulfamethoxazole | id 55: Trimethoprim/Sulfamethoxazole — 5 mg (kg başına, q12h) <br> id 70: Kotrimoksazol (TMP/SMX) — 5 mg (kg başına, bid) | aynı       |
| vancomycin                   | id 22: Vancomycin — 15 mg (kg başına, q8h) <br> id 63: Vankomisin — 15 mg (kg başına, q12h)                               | **farklı** |

### 1b. Kendi tavanıyla çelişen kayıtlar: 32

70 kg erişkin için doz × sıklık, kaydın kendi günlük tavanını aşıyor. Bir kısmı tasarım gereğidir (pediatrik kilo başına doz + erişkin tavanı); ama o durumda da her erişkin hesabında uyarı çıkar ve gerçek uyarıların ciddiye alınmamasına yol açar.

| id       | İlaç                    | Tek doz | Sıklık | Günlük | Kaydın tavanı | Kat    |
| -------- | ----------------------- | ------- | ------ | ------ | ------------- | ------ |
| supp-005 | Magnezyum Sülfat        | 3500    | q6h    | 14000  | 40            | 350.0x |
| 45       | Ceftolozane/Tazobactam  | 3500    | q8h    | 10500  | 4500          | 2.3x   |
| 25       | Gentamicin              | 350     | q8h    | 1050   | 480           | 2.2x   |
| supp-002 | Demir (Ferröz Sülfat)   | 210     | tid    | 630    | 300           | 2.1x   |
| 3        | Amoxicillin             | 1750    | q8h    | 5250   | 3000          | 1.8x   |
| 19       | Ceftriaxone             | 3500    | q12h   | 7000   | 4000          | 1.8x   |
| 20       | Cefepime                | 3500    | q8h    | 10500  | 6000          | 1.8x   |
| 36       | Ceftazidime             | 3500    | q8h    | 10500  | 6000          | 1.8x   |
| 39       | Cefiderocol             | 3500    | q8h    | 10500  | 6000          | 1.8x   |
| 42       | Cefuroxime              | 1750    | q8h    | 5250   | 3000          | 1.8x   |
| 49       | Tobramycin              | 210     | q8h    | 630    | 360           | 1.8x   |
| 21       | Piperacillin/Tazobactam | 7000    | q6h    | 28000  | 18000         | 1.6x   |
| 5        | Digoxin                 | 700     | q24h   | 700    | 500           | 1.4x   |
| 38       | Ceftazidime/Avibactam   | 3500    | q8h    | 10500  | 7500          | 1.4x   |
| 51       | Erythromycin            | 700     | q6h    | 2800   | 2000          | 1.4x   |
| 54       | Minocycline             | 140     | q12h   | 280    | 200           | 1.4x   |
| 23       | Ciprofloxacin           | 700     | q12h   | 1400   | 1200          | 1.2x   |
| 32       | Linezolid               | 700     | q12h   | 1400   | 1200          | 1.2x   |
| 34       | Colistin                | 175     | q12h   | 350    | 300           | 1.2x   |
| 37       | Cefotaxime              | 3500    | q6h    | 14000  | 12000         | 1.2x   |
| 40       | Ampicillin/Sulbactam    | 3500    | q6h    | 14000  | 12000         | 1.2x   |
| 41       | Ticarcillin/Clavulanate | 5250    | q6h    | 21000  | 18000         | 1.2x   |
| 52       | Roxithromycin           | 350     | q12h   | 700    | 600           | 1.2x   |
| 58       | Rifampin                | 700     | q24h   | 700    | 600           | 1.2x   |
| 59       | Isoniazid               | 350     | q24h   | 350    | 300           | 1.2x   |
| 61       | Piperasilin/Tazobaktam  | 7000    | q8h    | 21000  | 18000         | 1.2x   |
| 1        | Paracetamol             | 1050    | q6h    | 4200   | 4000          | 1.1x   |
| 7        | Insulin Regular         | 35      | q8h    | 105    | 100           | 1.1x   |
| 17       | Imipenem/Cilastatin     | 1050    | q6h    | 4200   | 4000          | 1.1x   |
| 18       | Ertapenem               | 1050    | q24h   | 1050   | 1000          | 1.1x   |
| 28       | Clarithromycin          | 525     | q12h   | 1050   | 1000          | 1.1x   |
| 30       | Clindamycin             | 700     | q6h    | 2800   | 2700          | 1.0x   |

## 2. Kaynakla karşılaştırılan kayıtlar (15/105)

### Magnezyum Sülfat (id supp-005) — BİRİM HATASI

- **Bulunduğunda kayıtta:** unit 'g', dosePerKg 50, max single 4, max daily 40
- **Şu an kayıtta:** 50 mg (kg başına, prn), tek doz tavanı 4000, günlük tavan 30000 — hesap reddediliyor, kaynakla karşılaştırıldı
- **Kaynak:** Paediatric bolus 25-75 mg/kg; adult eclampsia 4-6 g load then 1-2 g/h
- **Not:** 50 with unit g means 50 g/kg — 1000x the intended 50 mg/kg. Real regimen is load plus infusion, which this model cannot express.
- Bağlantı: https://www.accessdata.fda.gov/drugsatfda_docs/label/2019/020488Orig1s024lbl.pdf

### Digoxin (id 5) — KAYNAKLA UYUŞMUYOR

- **Bulunduğunda kayıtta:** 10 mcg/kg q24h, max single 250 mcg, max daily 500 mcg, no renal rules
- **Şu an kayıtta:** 4 mcg (kg başına, q24h), tek doz tavanı 250, günlük tavan 250 — hesap reddediliyor, kaynakla karşılaştırıldı
- **Kaynak:** FDA LANOXIN label: maintenance 3-4.5 mcg/kg/day (adults and children >10 y); 5.6-11.3 mcg/kg/day divided BID for ages 5-10
- **Not:** Adult base dose 2-3x the label. Renally cleared with no renal adjustment in the record; level-guided in practice.
- Bağlantı: https://www.accessdata.fda.gov/drugsatfda_docs/label/2016/020405s013lbl.pdf

### Amoxicillin (id 3) — KAYNAKLA UYUŞMUYOR

- **Bulunduğunda kayıtta:** 25 mg/kg PER DOSE q8h = 75 mg/kg/day, max single 1000, max daily 3000
- **Şu an kayıtta:** 20 mg (kg başına, q12h), tek doz tavanı 1000, günlük tavan 3000 — kaynakla karşılaştırıldı
- **Kaynak:** FDA label: 25-45 mg/kg/DAY divided q12h, or 20-40 mg/kg/DAY divided q8h
- **Not:** Label figures are per DAY; the record uses the same number per DOSE, giving ~2-3x the standard daily dose (75 vs 20-40 mg/kg/day). High-dose AOM regimens reach 80-90 mg/kg/day, so it is not absurd, but it must not be the default.
- Bağlantı: https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/050564s059,050575s048,050597s051,050720s033,050725s035,050726s026lbl.pdf

### Ceftriaxone (id 19) (id 19) — KAYNAKLA UYUŞMUYOR

- **Bulunduğunda kayıtta:** 50 mg/kg q12h = 100 mg/kg/day, max daily 4000
- **Şu an kayıtta:** 50 mg (kg başına, q24h), tek doz tavanı 2000, günlük tavan 4000 — kaynakla karşılaştırıldı
- **Kaynak:** FDA label: total daily 50-75 mg/kg (max 2 g/day); 100 mg/kg/day (max 4 g) reserved for meningitis/severe
- **Not:** Meningitis dose used as the default. Duplicate record id 66 gives 50 mg/kg/day for the same drug.
- Bağlantı: https://www.accessdata.fda.gov/drugsatfda_docs/label/2013/050796s014lbl.pdf

### Gentamicin (id 25) — KAYNAKLA UYUŞMUYOR

- **Bulunduğunda kayıtta:** 5 mg/kg q8h = 15 mg/kg/day, max daily 480
- **Şu an kayıtta:** 5 mg (kg başına, q24h), tek doz tavanı 500, günlük tavan 500 — hesap reddediliyor, kaynakla karşılaştırıldı
- **Kaynak:** Conventional 3-5 mg/kg/day divided q8h (1.7-2.5 mg/kg/dose); once-daily 5-7 mg/kg/day
- **Not:** Three times the conventional daily dose for an aminoglycoside; nephro/ototoxic. No renal rules on the record.
- Bağlantı: https://www.ncbi.nlm.nih.gov/books/NBK557550/

### Metronidazole (id 31) — KAYNAKLA UYUŞMUYOR

- **Bulunduğunda kayıtta:** 7.5 mg/kg q8h = 22.5 mg/kg/day; duplicate id 67 same dose, max daily 2000 vs 4000
- **Şu an kayıtta:** 10 mg (kg başına, q8h), tek doz tavanı 500, günlük tavan 4000 — kaynakla karşılaştırıldı
- **Kaynak:** FDA label: adults 7.5 mg/kg q6h (max 4 g/day); paediatric 35-50 mg/kg/day divided TID
- **Not:** Paediatric daily dose below label range; duplicate records disagree on the daily ceiling.
- Bağlantı: https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/018845s014,018930s013lbl.pdf

### Demir (Ferröz Sülfat) (id supp-002) — KAYNAKLA UYUŞMUYOR

- **Bulunduğunda kayıtta:** 3 mg/kg TID = 9 mg/kg/day
- **Şu an kayıtta:** 3 mg (kg başına, q24h), tek doz tavanı 200, günlük tavan 200 — kaynakla karşılaştırıldı
- **Kaynak:** Guidelines: 3-6 mg/kg/DAY elemental iron in 1-3 divided doses
- **Not:** Per-day figure applied per dose. Also ambiguous whether the number is elemental iron or ferrous sulfate salt.
- Bağlantı: https://www.rch.org.au/clinicalguide/guideline_index/iron_deficiency/

### Adrenalin (Epinefrin) (id 86) — KAYNAKLA UYUŞMUYOR

- **Bulunduğunda kayıtta:** 0.01 mg/kg prn, max single 1 mg, max daily 10 mg
- **Şu an kayıtta:** 0.01 mg (kg başına, prn), tek doz tavanı 0.5, günlük tavan 10 — kaynakla karşılaştırıldı
- **Kaynak:** Anaphylaxis IM: 0.01 mg/kg to a maximum of 0.5 mg per dose. Cardiac arrest IV: 1 mg per dose
- **Not:** The per-kg rule is the anaphylaxis rule but the cap is the cardiac-arrest dose, so a 70 kg adult is told 0.7 mg IM — above the 0.5 mg label maximum. Route and indication are conflated in one record.
- Bağlantı: https://www.ncbi.nlm.nih.gov/books/NBK482160/

### Tobramycin (id 49) — KAYNAKLA UYUŞMUYOR

- **Bulunduğunda kayıtta:** 3 mg/kg PER DOSE q8h = 9 mg/kg/day, max daily 360 mg
- **Şu an kayıtta:** 5 mg (kg başına, q24h), tek doz tavanı 500, günlük tavan 500 — hesap reddediliyor, kaynakla karşılaştırıldı
- **Kaynak:** Label: serious infections 3 mg/kg/DAY in three divided doses; up to 5 mg/kg/day only in life-threatening infection, and never above 5 mg/kg/day without serum levels
- **Not:** Same per-day-as-per-dose error as gentamicin: roughly three times the labelled daily dose of an aminoglycoside.
- Bağlantı: https://www.drugs.com/dosage/tobramycin.html

### Colistin (id 34) — KAYNAKLA UYUŞMUYOR

- **Bulunduğunda kayıtta:** 2.5 mg/kg q12h = 5 mg/kg/day, max daily 300 mg
- **Şu an kayıtta:** 1.25 mg (kg başına, q12h), tek doz tavanı 150, günlük tavan 300 — hesap reddediliyor, kaynakla karşılaştırıldı
- **Kaynak:** Label: 2.5-5 mg/kg/day of colistin BASE activity in 2-4 divided doses; must not exceed 5 mg/kg/day with normal renal function
- **Not:** Defaults to the very top of the range. The record also does not say whether the number is colistin base activity, colistimethate or IU — three non-interchangeable units (1 mg CMS is about 0.4 mg CBA).
- Bağlantı: https://www.drugs.com/dosage/colistimethate.html

### Methotrexate (id 4) — MODEL YANLIŞ

- **Bulunduğunda kayıtta:** 7.5 mg/m2 weekly (bsa), max 30 mg
- **Şu an kayıtta:** 7.5 mg (m2 başına, q7d), tek doz tavanı 30, günlük tavan 30 — hesap reddediliyor, kaynakla karşılaştırıldı
- **Kaynak:** FDA methotrexate tablets label: RA starting dose 7.5 mg ORALLY ONCE WEEKLY as a fixed dose; 10 mg/m2 weekly applies to polyarticular JIA
- **Not:** Per-m2 scaling turns the 7.5 mg adult RA dose into ~13.5 mg at 1.8 m2. Indication-dependent; the single-formula model cannot represent it.
- Bağlantı: https://www.accessdata.fda.gov/drugsatfda_docs/label/2016/008085s066lbl.pdf

### Levothyroxine (id 15) — MODEL YANLIŞ

- **Bulunduğunda kayıtta:** 1.6 mcg/kg q24h, max single 200, max daily 300 (record already flagged requiresClinicalReview)
- **Şu an kayıtta:** 1.6 mcg (kg başına, q24h), tek doz tavanı 200, günlük tavan 300 — hesap reddediliyor, kaynakla karşılaştırıldı
- **Kaynak:** FDA label: average full replacement ~1.6 mcg/kg/day; elderly or cardiac disease start 12.5-25 mcg/day; >200 mcg/day seldom needed
- **Not:** 1.6 mcg/kg is the target replacement, not a starting dose. The model has no notion of start-and-titrate, which is why the engine already refuses this record.
- Bağlantı: https://www.drugs.com/dosage/levothyroxine.html

### Ciprofloxacin (id 23) — TAVAN EKSİK DOZ ÜRETİYOR

- **Bulunduğunda kayıtta:** 10 mg/kg q12h, max single 400, max daily 1200
- **Şu an kayıtta:** 10 mg (kg başına, q12h), tek doz tavanı 750, günlük tavan 1500 — kaynakla karşılaştırıldı
- **Kaynak:** FDA label: peds 10 mg/kg q12h; adults 500-750 mg BID PO (400 mg IV)
- **Not:** Paediatric per-kg rule with an IV-sized 400 mg cap under-doses a 70 kg adult (400 vs 500-750 mg).
- Bağlantı: https://www.accessdata.fda.gov/drugsatfda_docs/label/2021/019537s093,020780s049lbl.pdf

### Paracetamol (id 1) — UYUMLU

- **Bulunduğunda kayıtta:** 15 mg/kg q6h, max single 1000 mg, max daily 4000 mg
- **Şu an kayıtta:** 15 mg (kg başına, q6h), tek doz tavanı 1000, günlük tavan 4000 — kaynakla karşılaştırıldı
- **Kaynak:** FDA acetaminophen labelling (oral 10-15 mg/kg/dose q4-6h; max 75 mg/kg/day or 4 g, whichever is less)
- **Not:** 60 mg/kg/day at q6h stays under the 75 mg/kg/day ceiling; adult cap 4 g matches.
- Bağlantı: https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/206968s000lbl.pdf

### Ibuprofen (id 2) — UYUMLU

- **Bulunduğunda kayıtta:** 10 mg/kg q8h (30 mg/kg/day), max single 800, max daily 2400
- **Şu an kayıtta:** 10 mg (kg başına, q8h), tek doz tavanı 800, günlük tavan 2400 — kaynakla karşılaştırıldı
- **Kaynak:** FDA/product labelling: 10 mg/kg/dose q6-8h, max 40 mg/kg/day (peds); adults up to 3200 mg/day Rx
- **Not:** Under both ceilings; <6 months factor 0 correctly blocks.
- Bağlantı: https://www.drugs.com/dosage/ibuprofen.html

## 3. Devam eden iş

- 90 kayıt henüz kaynakla karşılaştırılmadı.
- Sıra riske göre: dar terapötik aralıklı ilaçlar, pediatrik kilo başına dozlama ve yukarıdaki çelişki listesi.
- Modelin temsil edemediği ilaçlar (INR'ye göre varfarin, titre edilen insülin, düzeye göre digoksin, endikasyona göre metotreksat, yükleme + infüzyon şeklindeki magnezyum sülfat) hesaplanmak yerine `requiresClinicalReview` ile reddedilmelidir.
