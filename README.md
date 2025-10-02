# İlaç Doz Hesaplayıcı

Sağlık profesyonelleri için geliştirilmiş güvenli ve doğru ilaç doz hesaplama uygulaması.

## 🏥 Özellikler

- **Hasta Bilgileri Yönetimi**: Yaş, kilo, boy, cinsiyet ve hasta tipi girişi
- **İlaç Seçimi**: Kapsamlı ilaç veritabanı ile arama ve filtreleme
- **Güvenli Doz Hesaplama**: 
  - Kilo bazlı hesaplama (mg/kg)
  - Vücut yüzey alanı bazlı hesaplama (mg/m²)
  - Sabit doz hesaplama
  - Yaş bazlı doz ayarlamaları
- **Güvenlik Kontrolleri**: Maksimum doz sınırları ve uyarı sistemi
- **Hesaplama Geçmişi**: Önceki hesaplamaları görüntüleme ve yönetme
- **Çoklu Dil Desteği**: Türkçe ve İngilizce
- **Modern UI/UX**: Kullanıcı dostu ve erişilebilir tasarım

## 🛠️ Teknoloji Stack

- **React Native** + **TypeScript**
- **Expo** - Geliştirme ve build platformu
- **React Navigation** - Navigasyon
- **Zustand** - State management
- **React Query** - Server state management
- **React Hook Form** + **Zod** - Form yönetimi ve validasyon
- **i18next** - Uluslararasılaştırma
- **Jest** + **React Native Testing Library** - Test framework
- **ESLint** + **Prettier** - Code quality
- **GitHub Actions** + **Fastlane** - CI/CD
- **Sentry** - Error tracking
- **Analytics** - Kullanıcı analitikleri

## 📱 Desteklenen Platformlar

- iOS
- Android
- Web (Expo Web)

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Expo CLI
- iOS Simulator (iOS için)
- Android Studio (Android için)

### Adımlar

1. **Repository'yi klonlayın**
   ```bash
   git clone <repository-url>
   cd DosageCalculator
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Uygulamayı başlatın**
   ```bash
   npm start
   ```

4. **Platform seçin**
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## 🧪 Test

```bash
# Tüm testleri çalıştır
npm test

# Test coverage raporu
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🔧 Geliştirme

### Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run type-check
```

### Git Hooks

Proje Husky ile pre-commit hooks kullanır:
- ESLint kontrolü
- Prettier formatting
- TypeScript type checking

## 📦 Build

### Development Build

```bash
# Android
npm run build:android

# iOS
npm run build:ios
```

### Production Build

Fastlane ile otomatik build:

```bash
# Android
fastlane android deploy

# iOS
fastlane ios deploy
```

## 🏗️ Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
├── screens/            # Ekran bileşenleri
├── navigation/         # Navigasyon konfigürasyonu
├── store/              # Zustand state management
├── services/           # API ve external servisler
├── features/           # Domain-specific logic
│   └── dosage/         # Doz hesaplama motoru
├── types/              # TypeScript tip tanımları
├── constants/          # Sabitler ve konfigürasyon
├── locales/            # i18n çeviri dosyaları
├── hooks/              # Custom React hooks
└── utils/              # Yardımcı fonksiyonlar
```

## 🧮 Doz Hesaplama Motoru

Uygulama, `src/features/dosage/` altında bulunan saf fonksiyonlarla doz hesaplamaları yapar:

- **BSA Hesaplama**: Mosteller formülü
- **CrCl Hesaplama**: Cockcroft-Gault denklemi
- **Yaş Ayarlamaları**: Hasta tipine göre doz faktörleri
- **Güvenlik Kontrolleri**: Maksimum doz sınırları

## 🌐 Uluslararasılaştırma

Uygulama Türkçe ve İngilizce dillerini destekler. Yeni dil eklemek için:

1. `src/locales/` altına yeni dil dosyası ekleyin
2. `src/locales/i18n.ts` dosyasını güncelleyin

## 📊 Analytics ve Monitoring

- **Sentry**: Error tracking ve performance monitoring
- **Analytics**: Kullanıcı davranış analizi
- **Crash Reporting**: Otomatik crash raporlama

## 🔒 Güvenlik

- Tüm form inputları Zod ile validate edilir
- Doz hesaplamaları klinik standartlara uygun
- Maksimum doz sınırları kontrol edilir
- Hasta verileri yerel olarak saklanır

## 📋 Kullanım

1. **Hasta Bilgileri**: Yaş, kilo, boy, cinsiyet ve hasta tipini girin
2. **İlaç Seçimi**: İlaç kategorisi veya isim ile arama yapın
3. **Doz Hesaplama**: Sistem otomatik olarak güvenli dozu hesaplar
4. **Sonuçları İncele**: Hesaplanan doz, sıklık ve uyarıları kontrol edin
5. **Kaydet**: Hesaplamayı geçmişe kaydedin

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## ⚠️ Yasal Uyarı

Bu uygulama eğitim ve referans amaçlıdır. Gerçek hasta bakımında kullanmadan önce:

- Yerel protokolleri kontrol edin
- Klinik onay alın
- İlaç etiketlerini doğrulayın
- Hasta güvenliği protokollerini takip edin

## 📞 Destek

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.

---

**Not**: Bu uygulama sağlık profesyonelleri için tasarlanmıştır. Tüm hesaplamalar klinik standartlara uygun olarak yapılır.
