# Teknik Borç ve Yayın Öncesi Durum

Son güncelleme: 2026-09-09

Bu dosya, kod tabanının **gerçek** durumunu yansıtır. Önceki sürümü, o tarihte
mevcut olmayan bir mimariyi tarif ediyordu.

---

## 🔴 Yayına Çıkmadan Önce ZORUNLU (kod dışı)

### 1. Klinik Doğrulama — hiçbiri yapılmadı

Veritabanındaki **105 doz kuralının tamamı** `UNVERIFIED` durumundadır.
Hesaplama motoru her sonuçta bunu uyarı olarak gösterir.

Her kural için bir farmakolog veya hekim tarafından doldurulması gerekenler:

```ts
sourceReference: 'TİTCK KÜB / FDA label / BNF-C …',
sourceDate: '2026-01-15',
sourceVerification: 'REVIEWED',
reviewedBy: 'Dr. …',
```

`npm run check:release` bu sayıyı raporlar. Halka açık sürümde 0 olmalıdır.

### 2. Klinik incelemeye alınmış kayıtlar

Motorun doz üretmeyi **reddettiği** iki kayıt, çünkü depolanan model klinik
olarak yanlış:

| İlaç                      | Sorun                                                                      |
| ------------------------- | -------------------------------------------------------------------------- |
| Karboplatin (`chemo-002`) | AUC/Calvert ile dozlanır; kayıt mg/m² değeri tutuyor                       |
| Levothyroxine (`15`)      | 50 yaş üstü sabit 25-50 mcg başlangıç rejimi; mg/kg modeli bunu karşılamaz |

Doğru modeller girilene kadar `requiresClinicalReview: true` kalmalıdır.

### 3. Düzeltilen ama imza bekleyen veri hatası

`Ibuprofen` (id `2`) yaş bandı `{ minAge: 0, maxAge: 6 }` şeklindeydi. Kaydın
kendi yorumu "6 ay altı kullanılmaz" diyordu; diğer tüm bantlar YIL cinsinden.
Bu haliyle 0-6 **yaş** arası tüm çocuklarda ibuprofen kontrendike görünüyordu.
`maxAge: 0.5` olarak düzeltildi — **farmakolog onayı gerekir**.

### 4. Regülasyon (listede hiç yoktu)

Doz hesaplayıcı yazılım AB'de **MDR Rule 11** kapsamında Class IIa tıbbi cihaz
sayılabilir (CE + onaylanmış kuruluş). Türkiye'de TİTCK, ABD'de FDA CDS kılavuzu
devreye girer. Sorumluluk reddi metni bunu tek başına çözmez. Hedef pazarlara
göre düzenleyici danışmanlık alınmalıdır.

### 5. Production sırları

`npm run check:release` şu an 9 eksik anahtar bildiriyor. EAS secrets / GitHub
secrets üzerinden doldurulmalıdır (bkz. `.env.example`).

---

## 🟡 Kalan Teknik Borç

| #   | Konu                   | Not                                                                                                                                |
| --- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Ekran testleri         | Hesaplama motoru %95 kapsamlı; ekranlarda birim testi yok. `CalculatorScreen` sonuç panelinin render testi eklenmeli.              |
| 2   | Kemoterapi ekranı i18n | `ChemotherapyDoseScreen` etiketleri hâlâ sabit Türkçe. Güvenlik uyarıları ve red mesajları çevrildi; arayüz etiketleri çevrilmedi. |
| 3   | Erişilebilirlik        | Hasta formu alanlarına `accessibilityLabel` eklendi; diğer ekranlar taranmadı. Dynamic Type test edilmedi.                         |
| 4   | Inline style uyarıları | 40 ESLint uyarısı (`react-native/no-inline-styles`, `no-explicit-any`). Hata değil, temizlenmeli.                                  |
| 5   | `npm audit`            | 51 açık bildiriliyor; çoğu build-time araçlarda. CI'da raporlanır, build'i durdurmaz. Gözden geçirilmeli.                          |
| 6   | OTA hotfix kanalı      | `expo-updates` kurulu değil. Bir doz hatası çıkarsa mağaza incelemesi beklenir. Tıbbi uygulamada eklenmesi önerilir.               |
| 7   | Abonelik yedeği        | RevenueCat başarısız olursa `subscription.ts` AsyncStorage'a düşüyor; cihazda kurcalanabilir.                                      |
| 8   | Detox                  | Spec mevcut akışa göre yeniden yazıldı ve testID'ler eklendi, ancak bir simülatörde henüz çalıştırılmadı.                          |

---

## ✅ Bu turda kapatılanlar

**Hasta güvenliği**

- Bilinmeyen uygulama sıklığı artık sessizce "günde 1" sayılmıyor; günlük doz
  kontrolü yapılamadığında açıkça bildiriliyor (`q7d`/`q21d` haritaya eklendi).
- `adjustmentFactor: 0` artık "kontrendike" olarak yorumlanıyor ve hesaplama
  reddediliyor — önceden geçerli görünen bir **0 mg doz** üretiyordu
  (aspirin <12, siprofloksasin/levofloksasin <18, metformin <10).
- Çakışan yaş bantlarında en kısıtlayıcı kural uygulanıyor.
- Böbrek yetmezliği tespit edilip ilaç için doğrulanmış kural yoksa, uydurma
  katsayı yerine kritik uyarı veriliyor.
- 18 yaş altında Cockcroft-Gault yerine Schwartz eGFR kullanılıyor.
- Girdi sınırları (yaş 0-120, kilo 0,3-500 kg, boy 20-250 cm, kreatinin
  0,1-25 mg/dL) hem formda hem motorda uygulanıyor.
- Güvenlik uyarıları 5 dilin tamamında; dil paritesi testle korunuyor.

**Kırık işlevsellik**

- Hesaplama sonucu paneli motorun döndürmediği alanları okuyordu → **ana doz
  değeri boş görünüyordu** ve `isWithinLimits` her zaman `undefined` olduğu için
  **her hesaplamada "Doz Sınırı Aşıldı"** yazıyordu.
- `react-native-worklets` eksikti (Reanimated 4 zorunlu peer bağımlılığı) →
  Metro bundle edemiyordu.
- Zustand persist RN'de olmayan `localStorage`'a düşüyordu → geçmiş hiç
  kaydedilmiyordu. AsyncStorage adaptörü ve v2 göçü eklendi.
- 6 kemoterapi ilacı `dosePerBSA` yazıyordu (tip `dosePerM2`) → hiç doz üretmiyordu.
- `ProductInfoScreen` tanımlanmadan önce `styles` kullanıyordu → ekran açılışta çöküyordu.
- `DrugDetailScreen` koşullu `useMemo` çağırıyordu → hook sırası ihlali.
- `ErrorBoundary` "Yeniden Başlat" düğmesi React Native'de var olmayan
  `window.location.reload()` çağırıyordu.

**Kemoterapi motoru**

- Tanımsız ilaçlar için `kilo × 1.5` ve `BSA × (maksDoz × 0.8)` uydurma
  varsayılanları kaldırıldı; protokol oranı yoksa reddediyor.
- `maxDailyDose` (mg/m²) mutlak mg dozla karşılaştırılıyordu → her sonuç
  "sınır aşıldı" görünüyordu. Artık BSA ile ölçekleniyor.
- Calvert formülü ölçülmüş GFR istiyor (önceden kreatinin 1,0 varsayılıyordu);
  GFR 125 mL/dk ile sınırlanıyor.
- Güvenlik uyarıları hesaplanıp **hiç gösterilmiyordu**; artık gösteriliyor.

**Altyapı**

- `tsconfig.json` var olmayan bir tip kütüphanesine referans veriyordu → tsc
  hiçbir dosyayı kontrol etmeden duruyordu. Düzeltildikten sonra 65 gerçek tip
  hatası ortaya çıktı; hepsi giderildi.
- Jest kurulu değildi; test dosyaları çalıştırılamıyordu. Artık 207 test geçiyor.
- CI dosyası geçersiz YAML'dı ve var olmayan `npm test` script'ini çağırıyordu.
- Sentry hiç başlatılmıyordu ve v7'de kaldırılmış API kullanıyordu. Hasta verisi
  maskeleme eklendi.
- Placeholder API anahtarları (`appl_YOUR_APPLE_KEY`, `ca-app-pub-xxxx…`)
  env değişkenlerine taşındı; `npm run check:release` bunları engelliyor.
- Privacy manifest `NSPrivacyTracking=false` diyordu ama AdMob paketliydi.
- ATT izni hiç istenmiyordu (Guideline 5.1.2 reddi).
- ~9.500 satır ölü kod (`App.tsx` içindeki ikinci, tehlikeli doz motoru dahil)
  silindi. `App.tsx`: 9.587 → 83 satır.
- Kullanılmayan native bağımlılıklar kaldırıldı (vector-icons, blur, axios,
  react-query).
