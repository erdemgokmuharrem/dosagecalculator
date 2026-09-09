# DOSE AUDIT REPORT

## 1. Kritik Bulgular

- Hesaplama mimarisinde (örneğin `src/features/dosage/calculations.ts` içerisinde) sonuçlar raw `number` olarak dönüyor ve birim güvenliği zayıf (mg, mL gibi statik tipler kullanılmıyor).
- Dozaj kurallarının kaynağını (FDA, EMA, KUB) ve erişim/versiyon tarihini belirten net bir alan `Drug` arayüzünde eksik. Mevcut `ProductInfo` çok genel amaçlı.
- Hacim (mL) hesaplaması standart ve merkezi bir yapıda değil (mg -> mL dönüşümleri örtük veya UI seviyesinde yapılmış olabilir).
- "Blocked" (Hesaplanamaz) durumu net bir şekilde işlenmiyor. Fonksiyonlar ya hesaplıyor ya da ham Exception fırlatıyor (Ör: `throw new Error`).

## 2. Yüksek Riskli Hatalar

- Cockcroft-Gault, BMI ve BSA gibi ölçümlerin ilacın spesifik TİTCK/FDA kuralına bağlı olup olmadığını denetleyen bir meta kural mimarisi yok. Uygulama, hasta bsa/crcl girdilerine göre otomatik ve genel geçer bir `getAgeAdjustmentFactor` uyguluyor (ör. çocuk için `0.8`, yenidoğan için `0.5`).
- Pediatrik yaş ayarlamalarında kullanılan sabit çarpanlar (0.5, 0.8) klinik olarak son derece tehlikelidir çünkü her ilacın farmakokinetik yapısı pediatride farklıdır ve böyle global bir "yaş çarpanı" kabul edilemez.

## 3. Birim Hataları

- Konsantrasyon `concentration?: number` olarak tanımlanmış, ancak "125mg/5mL" gibi spesifik yapısal tiplere sahip değil. Bu durum mg/mL hesabında yanlışlıklara yol açabilir.

## 4. Maksimum Doz Hataları

- `calculateDosage` metodu güncel halinde maksimum tek doz (maxSingleDose) ve maksimum günlük dozu (maxDailyDose) kısıtlayıcı bir şapka (cap) olarak zorunlu tutmuyor, sadece uyarı listesine (`warnings: string[]`) ekliyor veya hiç denetlemiyor.

## 5. Pediatrik Doz Hataları

- Pediatrik ve erişkin geçişlerinde kesin yaş (ay/gün) hesabı ve ağırlık sınırları (ör. "40 kg üzeri erişkin kabul edilir") gibi kurallar global metotlarda kodlanmış durumda değil.

## 6. Böbrek/Karaciğer Ayarlaması Sorunları

- `RenalAdjustment` modeli var ancak ilacın hesaplamasında (calculations.ts) CrCl sınırlarına göre otomatik doz kesintisi veya sıklık (frequency) uzatması tam otomatize edilmemiş veya standart test edilmemiş.

## 7. Preparat ve Konsantrasyon Sorunları

- Aynı etken maddenin "Şurup" ve "Tablet" formları, aynı id/obje içinde yönetiliyorsa (ki mevcut yapı bunu andırıyor) oral vs IV kuralları birbirine girebilir. Her uygulama yolu (Route) ve farmasötik form (Form) ayrı bir preparat (Product/SKU) olarak ele alınmalıdır.

## 8. Kaynağı Olmayan Kurallar

- İlaçların (`drugs.ts`, `drugs_extended.ts`, `drugs_chemo_supplements.ts`) `dosageFormula` alanında FDA, TİTCK, EMA gibi spesifik kaynak linki veya yayın tarihi tutulmuyor.

## 9. Test Kapsamı

- Dozaj motoruna ait statik boundary testleri, negatif değer testleri veya property-based statik analiz testleri (`__tests__` klasöründe) zayıf kalmış durumda.

## 10. Düzeltilmesi Gereken Dosyalar

- `src/types/index.ts` (Yeni güvenli tipler ve birimler eklenecek)
- `src/features/dosage/calculations.ts` (Hata fırlatma yerine güvenli result dönülecek, global `getAgeAdjustmentFactor` silinip ilaca özel adjustment kullanılacak)
- `src/data/drugs*.ts` (Tüm ilaçlara kaynak, versiyon eklenecek)
- `src/features/dosage/__tests__/` (Property tabanlı testler eklenecek)

## 11. Yayın Öncesi Engelleyici Maddeler (Blockers)

- Global `getAgeAdjustmentFactor` (yaşa göre 0.8, 0.5 ile çarpma işlemi) derhal kaldırılmalıdır. Bu klinik olarak kabul edilemez.
- Hacim (mL) hesabının mg/mL konsantrasyon mantığıyla ayrıştırılması.
- Maksimum günlük doz aşımı hesaplamayı engellemelidir (Blocked durumu).
