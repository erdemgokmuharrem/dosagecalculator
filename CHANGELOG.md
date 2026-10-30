# Değişiklik Günlüğü

Bu dosya, projede yakın zamanda yapılan anlamlı değişiklikleri özetler; başka
bir oturum işe devam ederken git geçmişini baştan okumak zorunda kalmasın diye
tutulur. En yeni en üstte.

## 2026-10-30

- **Yasal belgeler ve bağlantılar GitHub Pages'e taşındı; `check:release` alan adı engeli kaldırıldı:**
  - `docs/terms.html` (Kullanım Şartları & Tıbbi Sorumluluk Reddi) oluşturuldu ve `docs/index.html`'e bağlandı.
  - `src/config/links.ts` içindeki sahte/çözülmeyen `dozuhesapla.com` adresleri `https://erdemgokmuharrem.github.io/dosagecalculator/` ve geçerli iletişim e-postasına güncellendi. `check:release` DNS çözme testi başarıyla geçti.
- **Kullanılmayan `ProductInfoScreen` kaldırıldı:**
  - Eski ve hiçbir yerden açılmayan `ProductInfoScreen.tsx` silindi. `AppNavigator` ve `RootStackParamList` temizlendi.
  - `TECH_DEBT.md` ekran testi maddesi güncellendi; tüm aktif ekranlar %100 render test kapsamındadır.
- **Tüm testler ve kontroller:**
  - 29 test suite, 400/400 test geçiyor; TypeScript (`tsc --noEmit`) ve ESLint 0 hata/uyarı ile temiz.

## 2026-10-05

- **Sefepim ve TMP-SMX hesaplamaya açıldı; böbrek bantları tamamlandı.**
  - **Sefepim (id 20):** FDA etiketine (Maxipime) göre çocukta 50 mg/kg q12h (<2 ay kontrendike), erişkinde 2 g q12h (maks 4000 mg/gün), CrCl 30-60'ta 2 g q24h, 11-29'da 1 g q24h, <11'de 500 mg q24h olarak tanımlandı ve hesaplamaya açıldı.
  - **Trimethoprim/Sulfamethoxazole (id 55):** FDA etiketine (Bactrim) göre çocukta 4 mg TMP/kg q12h (<2 ay kontrendike), erişkinde 160 mg TMP q12h (maks 320 mg TMP/gün), CrCl 15-30'da yarım doz (0.5), <15'te kontrendike (0) olarak tanımlandı ve hesaplamaya açıldı. Hesaplanan kural sayısı 60'tan 62'ye yükseldi.
  - **Meropenem (id 16 ve id 62):** FDA etiketine uygun olarak CrCl 10-25 aralığında yarım doz q12h, CrCl <10 aralığında yarım doz q24h bantları eklendi.
  - **Tikarsilin/Klavulanat (id 41):** FDA etiketine (Timentin) uygun olarak CrCl 30-60 (2 g q4h, factor 0.67), CrCl 10-30 (2 g q8h, factor 0.67) ve CrCl <10 (2 g q12h, factor 0.67) böbrek bantları uygulandı.
  - **Ampisilin/Sulbaktam (id 40):** Bekleyen FDA onaylı böbrek bantları (CrCl 15-29 q12h, CrCl 5-14 q24h) uygulandı.
  - `verification.json` ve `DOSE_VERIFICATION.md` raporu güncellendi; bekleyen yama dosyaları temizlendi.

## 2026-09-17

- **Yaş katsayısı da tek doz tavanına göre sıralandı** (henüz commit'lenmedi).
  1'in altındaki yaş katsayısı, böbrek katsayısı gibi tavandan sonra
  uygulanıyor; 1'in üstündeki (izoniazid çocukta ×2) tavandan önce, yani tavanı
  aşamıyor. Önceden yaşlı bandı, dozu tavandan gelen hastada kayboluyordu: 65
  yaş üstünde prednizolon 41 kg'dan itibaren 36 mg (eskiden 40 mg'a kadar),
  parasetamol 67 kg'dan itibaren 800 mg (1000 mg'a kadar), ibuprofen 81 kg'dan
  itibaren 560 mg (800 mg'a kadar). Bilerek kabul edilen sonuç: tavana ulaşan
  çocuk bandın oranını alıyor (parasetamol 1-12 yaş 67 kg üstü 900 mg,
  ibuprofen şurubu 41 kg üstü 320 mg; eskiden 1000/400 mg'a kadar). Değişen
  dozların hepsi düşüyor; böbrek bantlı yedi kayıt etkilenmiyor.
- **Örtüşen böbrek bantları kontrendikasyonu gizleyebiliyordu.** İlk eşleşen
  bant uygulanıyordu; önce yazılmış 0,5 bandı, 0 (kontrendike) bandının yerine
  doz veriyordu. Artık yaş bantlarındaki gibi en kısıtlayıcı geçerli bant
  kazanıyor. Katalog testleri örtüşen böbrek bandını ve azaltma bandı olan
  kayıtta tek doz tavanı × sıklığın günlük tavanı aşmasını engelliyor (aksi
  halde yarıya inen rejim günlük kontrolden kaçar). `ENGINE_KEYS` listesinde
  eksik dört motor kodu (`blocked.contraindicatedRenal` dahil) eklendi; motorun
  ürettiği her kodu kaynaktan tarayıp listede arayan test var.
- Bu iki düzeltme için 20 motor testi (TMP-SMX etiket senaryosu: CrCl 20'de 80
  mg, CrCl 15-30'da 80 kg ve üstünde 80 mg, 15 altında ret, çocukta tavan altı
  doz aynı; yaş sırası; örtüşen bantlar) ve 4 katalog/çeviri testi eklendi.
  Özgün motorda 14, bir önceki sürümde 5 motor testi düşüyor.
- **Hesaplayıcı formu serum kreatinini 1,0 ile dolu açıyordu** (henüz
  commit'lenmedi). Klinisyen değer girmese de 1,0 motora ölçülmüş kreatinin
  olarak gidiyordu: "böbrek fonksiyonu değerlendirilmedi" uyarısı hiç
  çıkmıyor, formda ölçülmemiş bir CrCl (varsayılan hastada 102,1) görünüyor,
  böbrek kuralı olan 7 ilaç (meropenem 16/62, ampisilin/sulbaktam 40,
  tikarsilin/klavulanat 41, norfloksasin 48, nitrofurantoin 56,
  klaritromisin 65) bu uydurma değerle dozlanıyordu. Alan artık boş
  açılıyor; "1.0" yalnızca yer tutucu. Bu ilaçlar kreatinin girilene kadar
  "Serum kreatinin değerini girin" diyerek reddediliyor, diğerleri dozu
  "değerlendirilmedi" uyarısıyla gösteriyor. Ekran testine varsayılan değer
  ve fixture ilaçla ret testi eklendi; eski ekranla ikisi de düşüyor.
  Parasetamol/aspirin kullanan ekran ve e2e testleri kreatinin girmiyor; bu
  kayıtlara böbrek bandı eklenirse kreatinin girmeleri gerekir.
- **Reddedilen önerilerden norfloksasin açıldı** (henüz commit'lenmedi):
  etiket böbrek yetmezliğinde dozu değil sıklığı değiştiriyor (CrCl ≤30'da
  400 mg günde bir kez); bu `frequencyOverride` ile ifade edildi. İki
  meropenem kaydına CrCl 26-50 bandı eklendi. Omeprazol, metformin,
  sefotaksim, doksisiklin, sefepim ve TMP-SMX kapalı kaldı; her birinde nedeni
  yazıyor. Doksisiklin, doz enfeksiyonun ağırlığına bağlı olduğu için kapalı
  tutuldu. Şu an 105 kaydın 60'ı hesaplanıyor.
- Ampisilin/sulbaktamın etikete uygun böbrek bantları hazırlandı ama geçici
  olarak geri alındı: paralel çalışan "güvenli sınırlar rozeti" görevinin testi
  bu kaydın eski böbrek boşluğunu senaryo olarak kullanıyor. Yama
  `scripts/dose-verification/pending/` altında bekliyor.
- **"Güvenli Sınırlar İçinde" rozeti azalmış böbrek fonksiyonunu yok
  sayıyordu** (henüz commit'lenmedi). Böbrek fonksiyonu 60'ın altında olup
  hiçbir böbrek kuralı uygulanmadığında sonuç yeşil rozetle, hemen altında
  kritik böbrek uyarısıyla gösteriliyordu. 85 yaş, 38 kg, CrCl 15,4 bir hastada
  hesaplanan 59 ilacın 57'si böyleydi: 53'ünde böbrek kuralı hiç yok, meropenem
  (16, 62), ampisilin/sulbaktam (40) ve tikarsilin/klavulanat (41) kuralları bu
  değeri kapsamıyor. Sonuca `renalAdjustmentStatus` eklendi; bu durumda
  `isWithinLimits` false oluyor ve rozet "renal doz ayarı uygulanmadı" yazıyor.
  Böbrek kuralı olan ilaçta böbrek fonksiyonu hesaplanamıyorsa hesap zaten
  reddediliyordu; artık testle korunuyor.
- **Böbrek katsayısı tek doz tavanından sonra uygulanıyor.** Tavandan önce
  çarpıldığında, kilo başına dozu erişkin tavanına ulaşan hastada azaltma
  kısmen ya da tamamen kayboluyor, sonuç yine "böbrek ayarı uygulandı"
  diyordu. Katalogda klaritromisin (65) CrCl <30'da 80 kg'da 300 mg, 100 kg'da
  375 mg veriyordu; doğrusu 250 mg. Tavana takılan dozlarda formül metni sırayı
  gösteriyor (`… → 500 mg (max) × 0.5 (renal)`). 0-1 dışındaki böbrek
  katsayıları uygulanmıyor; katalog testi böyle bir bandı engelliyor.
- Bu iki düzeltme için 25 test eklendi, 3 mevcut test genişletildi; eski
  motorla 20'si düşüyor. Katalog testleri kayda değil değişmeze bakıyor, ekran
  testi de test içinde tanımlı bir ilaç kullanıyor. Bekleyen
  ampisilin/sulbaktam böbrek yaması artık bu testleri bozmaz.
- Sefepim (20) böbrek doz metni FDA etiketi Tablo 2'ye göre düzeltildi (dört
  normal şema, periton diyalizi, hemodiyaliz, çocuk). Kayıt hesaplamaya kapalı
  kalmaya devam ediyor.
- **Hesaplamaya kapatılan 61 kuraldan 15'i kaynaktan düzeltilip yeniden
  açıldı** (henüz commit'lenmedi). Her öneri bir ajan tarafından etiketten
  türetildi, ikinci bir ajan etikete karşı yeniden hesapladı; yalnızca
  onaylananlar uygulandı. 38 ilaç model gereği kalıcı olarak hesaplanmıyor ve
  her birinde nedeni Türkçe yazıyor. Şu an 105 kaydın 59'u hesaplanıyor.
- **Motor hatası:** Böbrek bandı katsayısı 0 ("bu böbrek işlevinde
  kontrendike") çarpılıyor ve 0 mg doz gösteriliyordu; artık hesap
  reddediliyor (`blocked.contraindicatedRenal`). Eski motorda düşen
  regresyon testi eklendi.
- Yama aracında iki hata giderildi: böbrek bantlarının alan adları
  (`minGFR`/`maxGFR`) ve alan silerken bir sonraki satırın öncekine yapışıp
  anahtarın ikinci kez eklenmesi.
- **Mükerrer ilaç kayıtları tek doza getirildi** (henüz commit'lenmedi — git,
  kabul edilmemiş Xcode lisansı nedeniyle çalışmıyor). Metronidazol, furosemid
  ve ibuprofen şurubunun iki kaydı farklı doz veriyordu. İbuprofen şurubunun
  yaş bantları 6 aydan başladığı için 3 aylık bebeğe tam doz öneriliyordu; şurup
  kaydı kilo bazlı modele alındı ve 6 ay altı engellendi. Daha önce 10 mg/kg'a
  çıkardığım metronidazol dozu geri alındı: SmPC çocukta 20-30 mg/kg/gün diyor,
  7,5 mg/kg × 3 bu aralıkta.
- `scripts/apply-dose-patch.mjs` yaş/böbrek bantlarını yazabiliyor ve alan
  silebiliyor.
- Doğrulama kaydı ve rapor üreticisi geçici dizinden repoya taşındı
  (`scripts/dose-verification/`).

## 2026-09-15

- **Doz verisinin tamamı halka açık kaynaklarla karşılaştırıldı** (`ef62f11`,
  `e87c5fd`). 105 kaydın 38'i etiketle uyumlu, 67'si değil. En sık hata:
  etiketteki mg/kg/gün değeri doz başına alanına girilip üstüne sıklık
  uygulanmış (2-4 kat doz). İnsülin 1,5 ünite/kg/gün öneriyordu. Düzeltilmemiş
  61 kayıt artık hesap yapmıyor, gerekçesini gösteriyor. Bulgular:
  `DOSE_VERIFICATION.md`.
- Üçüncü doğrulama seviyesi `SOURCE_CHECKED` eklendi (`e4e6aa5`): kaynakla
  karşılaştırılan kural her sonuçta uyarı vermeye ve kaynağın adını göstermeye
  devam eder; yalnızca adı yazılı bir klinisyenin `REVIEWED` imzası uyarıyı
  kaldırır.
- Elle doğrulanan 15 kural düzeltildi; modelin ifade edemediği digoksin,
  aminoglikozidler, kolistin, metotreksat ve magnezyum sülfat hesaplamaya
  kapatıldı (`b18ef8a`). Magnezyum sülfat 50 mg/kg yerine 50 g/kg kayıtlıydı.
- Kaynak seviyelerini koruyan katalog testleri (`7aa4af5`).

## 2026-09-13

- Gizlilik politikası GitHub Pages ile yayımlanabilecek sayfalar olarak
  `docs/` altına eklendi, Türkçe ve İngilizce (`216be96`).
- Kalan 27 satır içi stil uyarısı giderildi; lint 0 uyarı (`bdf73b7`).
- En büyük erişilebilirlik yazı boyutunda boy değeri "1…" diye kesiliyor ve
  sekme etiketleri taşıyordu; düzeltildi ve cihazda doğrulandı (`aa7fc1b`).

## 2026-09-12

- Abonelik ekranı: "Ömür Boyu" seçen kullanıcıdan aylık abonelik ücreti
  alınabiliyordu; fiyatlar mağazadan geliyor; otomatik yenileme açıklaması ve
  şart/gizlilik bağlantıları eklendi (`99b5672`).
- Pro hakkı artık yalnızca RevenueCat'ten; cihazdaki kayıt düzenlenerek Pro
  olunamıyor. İlaç listesi ve detay ekranına testler (`d1e42d1`).

## 2026-09-11

- Reklam kişiselleştirmesi UMP ve ATT onayına bağlandı; ATT sorumluluk
  reddinden sonra ve yalnızca gerektiğinde soruluyor; Ayarlar'a reklam
  tercihleri eklendi; ayarlardaki bağlantılar, sürüm ve sekme etiketi
  düzeltildi (`9772e31`).

## 2026-09-09 – 2026-09-10

- İlk denetim ve onarım: doz motoru, derleme ve test altyapısı (`aa1f311`),
  ilk açılışta boş ekran (`d557a65`, `5260865`), çeviriler (`363e18e`,
  `0caf987`), erişilebilirlik rolleri (`14e850f`), geçmiş göçü testi
  (`85d566c`), koyu temada okunabilir doz bantları (`785a06c`).
