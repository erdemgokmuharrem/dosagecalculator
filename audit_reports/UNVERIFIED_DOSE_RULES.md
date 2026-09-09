# UNVERIFIED DOSE RULES

Şu anki veritabanındaki 100'den fazla ilacın tamamı (drugs.ts, drugs_extended.ts, drugs_chemo_supplements.ts) **KAYNAĞI DOĞRULANMAMIŞ (UNVERIFIED)** statüsündedir.

## Eksik Olan Kaynak Bilgileri

Mevcut kod altyapısında `Drug` ve `DosageFormula` interfaceleri içinde FDA, EMA veya TİTCK kaynağını, referans URL'sini veya referans kılavuz tarihini tutan bir property (alan) **bulunmamaktadır.**
Örnek olarak Parasetamol için girilen `15 mg/kg` hesabının hangi yıla ait hangi KUB belgesinden alındığı yazılımsız olarak izlenemez durumdadır.

## Sistemdeki Kritik Doğrulanmamış Mantıklar

1. **Yaş Çarpanı (Age Adjustment Factor):**
   `getAgeAdjustmentFactor` metodunda yer alan "Çocuksa dozu 0.8 ile çarp" mantığının hiçbir klinik rehberde genel-geçer bir karşılığı yoktur. Tüm dozların hesaplanmasını riske atmaktadır.
2. **BMI ve BSA Hesapları:**
   Kullanılan Cockcroft-Gault formülü ve Mosteller BSA formülü doğru olmakla birlikte, ilacın kendi KUB verisinde özellikle "Ideal Body Weight" mi yoksa "Actual Body Weight" mi istendiği belirtilmeden doğrudan `patient.weight` kullanılarak mg/kg hesaplanmaktadır. (Örn: Obez hastalarda Parasetamol dozu).
3. **Maksimum Doz Kısıtlaması:**
   Uygulama, hesabı yaptıktan sonra dozun maks. sınırı aşıp aşmadığını uyarıya (warning) koymaktadır ancak dozu **hard-cap (kesin sınır)** ile otomatik sınırlandırmayı opsiyonel bırakmıştır.

Bu kuralların tamamının manuel klinik incelemeden geçirilmesi ve kaynak gösterilmesi zorunludur.
