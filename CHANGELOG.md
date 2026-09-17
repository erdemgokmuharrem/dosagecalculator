# Değişiklik Günlüğü

Bu dosya, projede yakın zamanda yapılan anlamlı değişiklikleri özetler; başka
bir oturum işe devam ederken git geçmişini baştan okumak zorunda kalmasın diye
tutulur. En yeni en üstte.

## 2026-09-17

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
