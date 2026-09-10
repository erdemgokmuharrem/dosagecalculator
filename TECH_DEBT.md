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

| #   | Konu                                 | Not                                                                                                                                                                                                                                                                                                                                                                                          |
| --- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Klinik içerik çevirisi               | Arayüz metinlerinin tamamı 5 dilde. İlaç verisindeki **klinik içerik** (monograflar, kontrendikasyonlar, yan etkiler, seyreltme solüsyonları) yalnızca Türkçe. Bu kod değil tıbbi çeviri işi; farmakolog incelemesiyle birlikte yapılmalı.                                                                                                                                                   |
| 2   | Ekran testleri                       | `CalculatorScreen`, `ChemotherapyDoseScreen`, `HistoryScreen` ve `ThemeContext` render testli. Vademecum, ilaç detayı, ayarlar, abonelik ve ürün bilgisi ekranlarında render testi yok.                                                                                                                                                                                                      |
| 3   | Erişilebilirlik (kalan)              | Rol/durum 38/38 ve renk kontrastı (13 çift × 2 tema, WCAG AA) testle korunuyor. Yapılmadı: Dynamic Type/yazı ölçekleme ve cihazda VoiceOver/TalkBack turu.                                                                                                                                                                                                                                   |
| 4   | Lint uyarıları                       | Yalnızca 29 `react-native/no-inline-styles` uyarısı kaldı; hata ve diğer kural uyarıları yok.                                                                                                                                                                                                                                                                                                |
| 5   | `npm audit`                          | 52 bildirim, `--omit=dev` ile 42. Neredeyse tamamı `expo`'nun çektiği CLI/Metro/Babel araç zincirinde, bundle'a girmiyor. Bundle'a giren tek zincir: react-navigation → query-string → decode-uri-component (orta, upstream düzeltme yok; bozuk URI ile DoS, derin bağlantılarda önemli). Expo paketleri `expo install` ile hizalandı.                                                       |
| 6   | OTA hotfix kanalı                    | `expo-updates` kurulu değil. Bir doz hatası çıkarsa mağaza incelemesi beklenir.                                                                                                                                                                                                                                                                                                              |
| 7   | Abonelik yedeği                      | RevenueCat başarısız olursa `subscription.ts` AsyncStorage'a düşüyor; cihazda kurcalanabilir.                                                                                                                                                                                                                                                                                                |
| 8   | Detox                                | Spec, testID'ler ve `.detoxrc` (iPhone 16 Pro) hazır. Çalıştırılamadı: `applesimutils` kurulumu Homebrew'un "güvenilmeyen tap" kontrolüne takıldı. `brew trust wix/brew` sizin kararınız.                                                                                                                                                                                                    |
| 9   | ATT ve kişiselleştirme (karar sizde) | Uygulama ATT izni istiyor ama tüm reklam istekleri `requestNonPersonalizedAdsOnly: true`; izin verilse de kullanılmıyor, manifest ise `NSPrivacyTracking: true` diyor. İki tutarlı yol: kişiselleştirmeyi ATT sonucuna bağlamak ya da ATT'yi kaldırıp izlemeyi `false` yapmak. Ayrıca ATT penceresi yasal sorumluluk reddinin üstüne açılıyor ve `mobileAds().initialize()` hiç çağrılmıyor. |
| 10  | Sekme etiketi                        | Alt sekmede "Hesaplayıcı" etiketi "Hesaplay..." diye kesiliyor.                                                                                                                                                                                                                                                                                                                              |

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
- `ThemeProvider`, AsyncStorage'dan tema okunana kadar `null` döndürüyordu →
  splash sonrası boş ekran. Artık ilk frame'de sistem temasıyla render edip
  kayıtlı tercihi geldiğinde uyguluyor. Context değeri memoize edildi; her
  ekran `useTheme()` sonucundan StyleSheet kurduğu için her render'da yeni
  nesne tüm ağacı yeniden stillendiriyordu.

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

**Sonraki tur: erişilebilirlik, i18n, doğruluk**

- 38 dokunmatik öğenin hiçbirinde `accessibilityRole` yoktu; ekran okuyucu
  "düğme"/"seçili" demiyordu. Hepsine rol ve durum, yalnızca simge içerenlere
  etiket eklendi. Regresyon testi var.
- Kalan ~110 arayüz metni çevrildi (Alert'ler, placeholder'lar, akordeon
  başlıkları, kemoterapi hazırlama cümlesi, abonelik hataları). Kemoterapi
  motoru artık Türkçe metin değil çeviri anahtarı döndürüyor.
- **Bu çalışmada yarattığım bir hata:** önceki toplu i18n değişimi PDF dışa
  aktarım şablonundaki 5 başlığı `{t(...)}` yapmıştı; template literal içinde bu
  düz metin olarak basılırdı. `${t(...)}` olarak onarıldı, testle korunuyor.
- Ayarlar "180+ ilaç", abonelik "Tüm 180+ ilaç bilgisi" diyordu; katalogda 105
  ilaç var. Gerçek sayı gösteriliyor (App Review doğruluk ilkesi 2.3).
- Kullanıcı satın almayı iptal edince "hata" uyarısı çıkıyordu; artık çıkmıyor.
- Kemoterapi ekranının geri düğmesi kayıtlı olmayan `'Home'` rotasına gidiyordu.
- Kemoterapi ekranında kreatinin/GFR girişi yoktu; motor Calvert için ölçülmüş
  GFR istediğinden karboplatin çıkmaz sokaktaydı.
- `react-native-worklets` 0.6.1 kurulmuştu; Expo SDK 54 0.5.1 bekliyor. Hizalandı.
- v1 → v2 geçmiş göçü test edildi.

**Kontrast ve render testleri turu**

- **Bu çalışmada yarattığım hata:** sonuç panelindeki "Doz Sınırı Aşıldı" /
  "Güvenli Sınırlar İçinde" bantlarının metnini tema rengine geçirmiş ama
  arka planı sabit açık renkte bırakmıştım. Koyu temada bant neredeyse
  görünmüyordu. Arka planlar tema token'ına alındı; 13 metin/zemin çifti iki
  temada WCAG AA (4.5:1) testiyle korunuyor.
- Sonuç başlığında beyaz metin mavi zeminde 3.7:1'di (AA altı); 5.2:1'e çıkarıldı.
- Kemoterapi ekranında hasta değerleri değişince sitotoksik doz ekranda kalıyordu.
- `LoadingSpinner` her render'da yeni bir sonsuz animasyon döngüsü başlatıyordu.
- Abonelik servisi `plan` alanına mağaza ürün kimliğini yazıyordu.
- Vademecum listesi tema ve dil değişiminde eski stil/çeviriyle kalıyordu.
- Kemoterapi ve geçmiş ekranlarına render testleri eklendi.

**Native proje ve gerçek cihaz akışı turu**

- Commit'li `ios/` 1 Ağustos'ta üretilmişti ve `app.json`'daki mağaza
  değişikliklerinin hiçbirini içermiyordu: uygulama açık temaya kilitliydi,
  şifreleme beyanı ve yerelleştirilmiş ATT metinleri yoktu, kaldırılan iki
  native modül hâlâ bağlıydı. `expo prebuild --clean` ile yeniden üretildi.
  Yayın hazırlık betiği artık bu sapmayı yakalıyor.
- **Bu çalışmada yarattığım hata:** reklam ID'lerini placeholder yerine `null`
  yapmıştım; `AdContext` bunları modül seviyesinde SDK'ya veriyordu ve SDK
  string olmayan ID'de hata fırlatıyor. Reklam env'i olmayan her Release
  build'de uygulama açılışta boş beyaz ekranda kalıyordu. Simülatör logunda
  kanıtlandı (`Unhandled JS Exception … 'adUnitId' expected an string value`),
  düzeltildi ve Release build'de doğrulandı: sorumluluk reddi ve yerelleştirilmiş
  ATT penceresi çiziliyor, açılışta hata yok.
- Build uyarılarından hiçbiri bizim native kaynağımızdan gelmiyor; hepsi pod'lar
  ve araç zinciri kaynaklı.
