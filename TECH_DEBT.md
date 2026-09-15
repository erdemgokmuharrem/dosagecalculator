# Teknik Borç ve Yayın Öncesi Durum

Son güncelleme: 2026-09-11

Bu dosya, kod tabanının **gerçek** durumunu yansıtır. Önceki sürümü, o tarihte
mevcut olmayan bir mimariyi tarif ediyordu.

---

## 🔴 Yayına Çıkmadan Önce ZORUNLU (kod dışı)

### 1. Klinik doğrulama — 105 kaydın tamamı kaynakla karşılaştırıldı

Elde farmakolog olmadığı için kuralların tamamı halka açık otoriter kaynaklarla
(FDA etiketleri, ürün bilgileri, klinik kılavuzlar) tek tek karşılaştırıldı.
Uyuşmazlık bildiren her bulgu, iddiayı çürütmeye çalışan ikinci bir bağımsız
incelemeden geçirildi. Tüm bulgular ve kaynak bağlantıları
[DOSE_VERIFICATION.md](DOSE_VERIFICATION.md) dosyasında.

Sonuç:

|                         |     |
| ----------------------- | --- |
| Kaynakla uyumlu         | 38  |
| Düzeltme bekleyen       | 67  |
| Şu an hesabı reddedilen | 61  |
| Hesaplamaya açık        | 44  |

**En sık hata, verinin üretilme biçiminde:** etiketler dozu çoğunlukla
mg/kg/gün olarak verir; veri setinde aynı sayı doz başına alanına girilmiş ve
üstüne sıklık uygulanmış. Bu, günlük dozu 2-4 katına çıkarıyor. İki bulgu
kritik: insülin 1,5 ünite/kg/gün öneriyordu (etiket 0,5-1 ünite/kg/**gün**
toplam) ve 5-florourasil sıklığı hatalıydı.

Düzeltilene kadar bu kayıtlar sayı göstermek yerine hesabı reddediyor; gerekçe
kullanıcıya yazılı olarak gösteriliyor. Veri artık üç seviye taşıyor:

| Seviye           | Anlamı                                   | Uyarı                                        |
| ---------------- | ---------------------------------------- | -------------------------------------------- |
| `UNVERIFIED`     | Kimse bakmadı                            | Her sonuçta uyarı                            |
| `SOURCE_CHECKED` | Halka açık kaynakla karşılaştırıldı      | Her sonuçta uyarı, kaynağın adı ve tarihiyle |
| `REVIEWED`       | Adı yazılı bir hekim/farmakolog imzaladı | Uyarı kalkar                                 |

**Kaynakla karşılaştırma imza değildir.** Hiçbir kayıt `REVIEWED` değil; halka
açık yayından önce lisanslı bir klinisyenin imzası gerekir ve yayın kapısı bunu
engellemeye devam ediyor.

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

### 6. Gizlilik politikası ve destek adresleri — alan adı yok

Uygulamadaki gizlilik politikası, kullanım şartları ve destek/geri bildirim
e-postaları `dozuhesapla.com` alan adını kullanıyor. Bu alan adı 2026-09-11'de
**NXDOMAIN** döndürüyordu: kayıtlı değil, A/MX/NS kaydı yok. App Review gizlilik
politikası bağlantısını hem App Store Connect'te hem uygulama içinde açar
(Guideline 5.1.1) ve destek iletişiminin çalışmasını bekler (1.5).

Alan adını alıp politika ve şart sayfalarını yayımlayın (e-posta için MX kaydı
gerekir) ya da `src/config/links.ts` içindeki adresleri gerçek adreslerle
değiştirin. Yayına hazır gizlilik politikası sayfaları `docs/` klasöründe
duruyor (Türkçe ve İngilizce); GitHub Pages'i bu klasörden açarsanız adres
`https://erdemgokmuharrem.github.io/dosagecalculator/privacy.html` olur ve
`src/config/links.ts` buna göre güncellenmelidir. Sayfalardaki köşeli
parantezli alanlar (veri sorumlusu, iletişim e-postası, adres) doldurulmalı ve
metin bir hukukçuya incelettirilmelidir. Kullanım şartları metni henüz yok.
`npm run check:release`, bu adreslerin sunucusu çözülene kadar
yayını engelliyor. Abonelik ekranındaki "Kullanım Şartları" bağlantısı da
aynı adrese gidiyor. Kendi şartlarınız yoksa iOS için Apple'ın standart son
kullanıcı lisans sözleşmesi (Standard EULA) kullanılabilir; bu seçim sizin.

### 7. AdMob gizlilik mesajları (AdMob konsolu)

Uygulama onayı Google UMP ile topluyor, ancak UMP yalnızca AdMob konsolunda
**Privacy & messaging** altında yayımlanmış bir mesajı gösterebilir. Mesaj
yoksa UMP hata döndürür ve uygulama tasarım gereği kişiselleştirilmemiş
reklama düşer; ATT penceresi de hiç açılmaz (bkz. aşağıdaki doğrulama notu).

- **Avrupa düzenlemeleri (GDPR) mesajı:** Google, AEA/Birleşik Krallık'ta
  reklam sunmak için sertifikalı bir CMP şartı koyuyor. Mesaj yayımlanmadan bu
  bölgelerde yalnızca sınırlı reklam sunulur.
- **ABD eyalet düzenlemeleri mesajı:** kodda ayrıca ele alınmıyor; UMP mesajı
  yayımlanırsa aynı akışla gösterilir.

Mesajlar yayımlandıktan sonra Ayarlar → "Reklam tercihleri" satırı, UMP
gerektirdiğinde gizlilik seçenekleri formunu açar.

---

## 🟡 Kalan Teknik Borç

| #   | Konu                         | Not                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Klinik içerik çevirisi       | Arayüz metinlerinin tamamı 5 dilde. İlaç verisindeki **klinik içerik** (monograflar, kontrendikasyonlar, yan etkiler, seyreltme solüsyonları) yalnızca Türkçe. Bu kod değil tıbbi çeviri işi; farmakolog incelemesiyle birlikte yapılmalı.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 2   | Ekran testleri               | `CalculatorScreen`, `ChemotherapyDoseScreen`, `HistoryScreen`, `SettingsScreen`, `SubscriptionScreen`, `VademecumScreen`, `DrugDetailScreen` ve `ThemeContext` render testli. Testi olmayan tek ekran `ProductInfoScreen`; o ekran kayıtlı ama hiçbir yerden açılmıyor ve beslendiği `selectedDrug` alanı hiç yazılmıyor. Bağlanması mı kaldırılması mı gerektiği ürün kararı.                                                                                                                                                                                                                                                                                                                                                   |
| 3   | Erişilebilirlik (kalan)      | Rol/durum 38/38 ve renk kontrastı (13 çift × 2 tema, WCAG AA) testle korunuyor. Yazı ölçekleme en büyük erişilebilirlik boyutunda simülatörde denendi; bulunan iki bozulma giderildi ve yeniden doğrulandı. Yapılmadı: cihazda VoiceOver/TalkBack turu.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 4   | `npm audit`                  | 50 bildirim, `--omit=dev` ile 40. Neredeyse tamamı `expo`'nun çektiği CLI/Metro/Babel araç zincirinde; bunlar bundle'a girmiyor ve düzeltmeleri Expo 57'ye (majör) geçmeyi gerektiriyor. Bundle'a giren tek zincir: react-navigation → query-string → decode-uri-component (orta; bozuk yüzde kodlamasıyla DoS). **Zorlanamaz:** düzeltilmiş 0.5.0 yalnızca ESM olarak yayımlanmış, `query-string` ise onu `require` ediyor; `overrides` ile zorlamak çalışma anında kırılmaya yol açar. react-navigation'ın en yeni sürümü de hâlâ `query-string ^7.1.3`'e bağlı. **Şu an erişilemez:** uygulamada `linking` yapılandırması yok, gelen URL'ler ayrıştırılmıyor. Derin bağlantı eklenirse bu madde yeniden değerlendirilmelidir. |
| 5   | OTA hotfix kanalı            | `expo-updates` kurulu değil. Bir doz hatası çıkarsa mağaza incelemesi beklenir.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 6   | Detox                        | Spec, testID'ler ve `.detoxrc` (iPhone 16 Pro) hazır. Çalıştırılamadı: `applesimutils` kurulumu Homebrew'un "güvenilmeyen tap" kontrolüne takıldı. `brew trust wix/brew` sizin kararınız.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 7   | Onay akışı cihaz testi       | Karar matrisi birim testli (UMP → ATT → SDK sırası, her ret ve hata dalı). AEA'da gerçek UMP formu ve ATT penceresinin birlikte göründüğü uçtan uca akış, AdMob mesajı yayımlanana kadar test edilemez.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 8   | `prebuild --clean` gürültüsü | Her yeniden üretim `project.pbxproj` içindeki nesne kimliklerini değiştirir; diff büyük görünür ama anlamsal değişiklik yoktur. Native değişiklikleri `app.json` / config plugin üzerinden yapın, `ios/` içinde elle düzenlemeyin.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 9   | Android koyu tema            | `userInterfaceStyle: automatic` Android'de `expo-system-ui` olmadan uygulanmıyor (prebuild uyarısı). Tema `DayNight` olduğu için arayüz sistem temasını izliyor; eksik kalan, JS çizilmeden önceki kök arka plan rengi (koyu temada açılışta kısa beyaz parlama). Android'de doğrulanamadığı için native bağımlılık eklenmedi.                                                                                                                                                                                                                                                                                                                                                                                                   |

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

**Yazı ölçekleme (Dynamic Type)**

- En büyük erişilebilirlik yazı boyutunda simülatörde iki gerçek bozulma vardı:
  hasta girdilerinde boy değeri "1…" diye kesiliyordu (doz hesaplayıcıda
  girilen değerin okunamaması kabul edilemez) ve sekme etiketleri çubuğun
  dışına taşıp ikonları kırpıyordu.
- Yaş/kilo/boy satırı büyük yazıda alt alta geçiyor; sekme etiketi ve ikonu
  ölçeklenmeye devam ediyor ama üst sınırı var, çubuk da bir miktar büyüyor.
  Ölçeklemeyi kapatan veya sabitleyen kod girmesini engelleyen test eklendi.
- Düzeltmeler Release build'de, Dozi'ye ayrılmış ayrı bir simülatörde
  doğrulandı; normal yazı boyutunda görünüm değişmedi.

**Satır içi stiller**

- Kalan 27 `react-native/no-inline-styles` uyarısının tamamı giderildi; lint
  artık 0 uyarı 0 hata veriyor. Koşullu olanlar (sekme etiketinin kalınlığı,
  kritik uyarının kalınlığı, ilaç detayındaki madde işareti rengi) ayrı stil
  girdilerine ayrıldı. Ürün bilgisi ekranındaki boş durum, aşağıda tanımlanan
  `styles`'a erişemediği için modül seviyesinde kendi stil tablosunu aldı.

**Abonelik hakkının kaynağı**

- Pro hakkı, RevenueCat başlatılamadığında uygulamanın kendi AsyncStorage
  kaydından okunuyordu: o dosyayı düzenleyen herkes Pro oluyordu. Artık hak
  yalnızca RevenueCat'ten geliyor, ulaşılamazsa ücretsiz tarafta kalınıyor.
  Ödeme yapan kullanıcı etkilenmez; RevenueCat hakkı kendi önbelleğinde
  tutuyor ve çevrimdışıyken de döndürüyor. Kaydı okuyan tek yer burasıydı,
  bu yüzden yazma tarafı da kaldırıldı. Eski kodda başarısız olan bir testle
  korunuyor.
- İlaç listesi ve ilaç detayı ekranlarına render testi eklendi. Detay
  ekranında PDF dışa aktarmanın ücretsiz kullanıcıda dosya üretmediği ve
  Pro'da ürettiği test ediliyor.

**Abonelik ekranı turu (App Store 3.1.2)**

- **Yanlış ürün satın alma:** Satın alma, istenen paket kimliği eşleşmezse
  teklifteki ilk paketi alıyordu. RevenueCat'in standart kimlikleri
  (`$rc_monthly`, `$rc_lifetime`) hiç eşleşmediği için "Ömür Boyu" seçen
  kullanıcıdan aylık abonelik ücreti alınabiliyordu. Paket artık türüne veya
  kimliğine göre bulunuyor. Bulunamazsa satın alma yapılmıyor. Eski kodda
  başarısız olan bir testle korunuyor.
- **Sabit fiyatlar:** Fiyatlar her dilde çeviri dosyasında sabit yazılıydı
  (₺149,99, $5.99, €5,99, ₽499, ¥38); ödeme ekranındaki mağaza fiyatıyla
  uyuşmuyordu. Artık RevenueCat'ten, mağazanın biçimlendirdiği `priceString`
  olarak geliyor. Fiyat alınamazsa o plan satın alınamıyor. Hiçbir dilde
  fiyat kalmadığı testle korunuyor.
- **Eksik açıklamalar:** Otomatik yenileme açıklaması yoktu; Kullanım Şartları
  ve Gizlilik Politikası'na bağlantı yoktu (yalnızca bağlantısız bir cümle
  vardı). İkisi de eklendi, 5 dilde. Bağlantıların çalışması alan adına bağlı
  (madde 6).

**Reklam onayı turu**

- ATT izni istenip sonucu hiç kullanılmıyordu: tüm reklam istekleri
  kişiselleştirilmemişti, manifest ise izleme yapıldığını beyan ediyordu. Artık
  kişiselleştirme yalnızca UMP (AEA/BK) ve ATT birlikte izin verirse açılıyor;
  aksi halde kişiselleştirilmemiş reklam isteniyor.
- Sıra Google'ın önerdiği gibi: UMP → ATT → `mobileAds().initialize()` →
  reklam isteği. Önceden SDK hiç başlatılmıyordu.
- ATT penceresi sabit bir zamanlayıcıyla, tıbbi sorumluluk reddinin üstünde
  açılıyordu. Artık yalnızca sorumluluk reddi kabul edildikten sonra ve yalnızca
  cevabı kullanılacaksa (UMP kişiselleştirmeye izin verdiyse) soruluyor. Pro
  kullanıcılara hiç sorulmuyor.
- Sorumluluk reddi, kayıtlı durumu okunamadığında gösterilmiyordu; artık
  gösteriliyor (fail-closed). Kayıt yazılamazsa da artık kilitlenmiyor.
- Ayarlar'a "Reklam tercihleri" satırı eklendi: onay sonucunu gösterir, UMP
  gerektirdiğinde gizlilik seçenekleri formunu açar ve reklamları yeni seçimle
  yeniden kurar.
- Onay sonucunun kimlik bilgisi içermeyen özeti `@ad_consent_state` anahtarına
  yazılıyor. Release build konsola log basmıyor ve Sentry DSN'i yok; bu kayıt
  olmadan başarısız bir onay akışı görünmezdi.
- Reklam SDK'sının ölçümü onaydan önce başlayabiliyordu
  (`GADDelayAppMeasurementInit=false`). `delayAppMeasurementInit: true`
  ayarlandı; iOS'ta Info.plist'e, Android'de manifest'e işlendi. Yayın
  hazırlık betiği bu ayarın hem `app.json`'da hem native projede olmasını
  zorunlu tutuyor.
- Alt sekmede "Hesaplayıcı" "Hesaplay…" diye kesiliyordu: etiket 60pt'ye
  sabitti. Artık sekme genişliğini alıyor, uzun çeviriler kesilmek yerine
  küçülüyor. Sekmelerin `title`'ı yoktu, bu yüzden VoiceOver rota adını
  ("CalculatorTab") okuyordu. Başlıklar eklendi ve testle korunuyor.
- Ayarlar'daki gizlilik politikası, şartlar ve destek satırları adresi yalnızca
  Alert içinde düz metin olarak gösteriyordu. Artık bağlantıyı açıyorlar
  (e-postalar `mailto:` ile). Açılamazsa adres gösteriliyor. Adresler
  `src/config/links.ts` içinde toplandı.
- Ayarlar sürümü `2.1.0` olarak sabit yazılmıştı, uygulama ise `1.0.0` olarak
  çıkıyor. Artık `app.json`'dan okunuyor (Release paketinde gömülü
  `app.config` sürümü doğrulandı).
- "Uygulamayı değerlendir" satırı hiçbir şey açmadan teşekkür mesajı
  gösteriyordu. Artık mağazanın değerlendirme sayfasını açıyor. iOS'ta
  `EXPO_PUBLIC_APP_STORE_ID` tanımlanana kadar bu satır gizli.
- Info.plist'e Google'ın 50 SKAdNetwork kimliği eklendi (Google'ın yayımladığı
  listeden birebir alındı).
- Release build'de simülatörde doğrulandı: ilk açılışta yalnızca sorumluluk
  reddi görünüyor ve reklam/onay sunucusuna bağlantı yok. Kabulden sonra akış
  çalışıyor ve kaydedilen sonuç, UMP'nin
  `no form(s) configured for the input app ID` hatası verdiğini gösteriyor. Bu
  yüzden ATT sorulmadı ve reklamlar kişiselleştirilmemiş kaldı; tasarlanan
  davranış bu. Çözümü AdMob konsolunda (bkz. madde 7).
