# Mimari Dokümantasyonu

Bu dokümantasyon, İlaç Doz Hesaplama uygulamasının teknik mimarisini ve tasarım kararlarını açıklar.

## 🏗️ Genel Mimari

### Mimari Desenler
- **Clean Architecture**: Domain logic'i UI'dan ayırır
- **Feature-Based Structure**: Her özellik kendi modülünde
- **Component-Based UI**: Yeniden kullanılabilir bileşenler
- **Repository Pattern**: Veri erişim katmanı

### Teknoloji Stack
```
Frontend: React Native + TypeScript
State Management: Zustand + React Query
Navigation: React Navigation v6
Styling: StyleSheet + Theme System
Forms: React Hook Form + Zod
Testing: Jest + RTL + Detox
CI/CD: GitHub Actions + Fastlane
Monitoring: Sentry + Analytics
```

## 📁 Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir UI bileşenleri
│   ├── ErrorBoundary.tsx
│   ├── OfflineScreen.tsx
│   └── index.ts
├── screens/            # Ekran bileşenleri
│   ├── HomeScreen.tsx
│   ├── PatientInfoScreen.tsx
│   ├── DrugSelectionScreen.tsx
│   ├── DosageCalculationScreen.tsx
│   ├── HistoryScreen.tsx
│   ├── SettingsScreen.tsx
│   └── __tests__/      # Screen testleri
├── navigation/         # Navigasyon konfigürasyonu
│   └── AppNavigator.tsx
├── store/              # Global state management
│   └── index.ts
├── services/           # External servisler
│   ├── api.ts
│   ├── sentry.ts
│   └── analytics.ts
├── features/           # Domain-specific logic
│   └── dosage/         # Doz hesaplama domain'i
│       ├── calculations.ts
│       └── __tests__/
├── types/              # TypeScript tip tanımları
│   └── index.ts
├── constants/          # Sabitler ve konfigürasyon
│   └── index.ts
├── locales/            # i18n çeviri dosyaları
│   ├── en.json
│   ├── tr.json
│   └── i18n.ts
├── hooks/              # Custom React hooks
├── utils/              # Yardımcı fonksiyonlar
├── contexts/           # React Context providers
│   └── ThemeContext.tsx
├── providers/          # App-level providers
│   └── QueryProvider.tsx
├── data/               # Static data
│   └── drugs.ts
└── test/               # Test utilities
    └── setup.ts
```

## 🔄 Veri Akışı

### State Management
```
Zustand Store (Global State)
├── Patient Data
├── Selected Drug
├── Calculations History
└── App Settings

React Query (Server State)
├── API Cache
├── Background Sync
└── Offline Support
```

### Component Hierarchy
```
App
├── ErrorBoundary
├── SafeAreaProvider
├── QueryProvider
├── ThemeProvider
└── AppNavigator
    ├── Stack Navigator
    │   ├── HomeScreen
    │   ├── PatientInfoScreen
    │   ├── DrugSelectionScreen
    │   ├── DosageCalculationScreen
    │   ├── HistoryScreen
    │   └── SettingsScreen
    └── Tab Navigator (if needed)
```

## 🧮 Domain Logic

### Doz Hesaplama Motoru
```typescript
// Pure functions - testable ve maintainable
calculateBSA(height, weight) -> BSA
calculateCrCl(age, weight, gender, creatinine) -> CrCl
getAgeAdjustmentFactor(patientType) -> factor
calculateDosage(patient, drug) -> DosageResult
validatePatientForCalculation(patient) -> errors[]
validateDrugForCalculation(drug) -> errors[]
```

### Hesaplama Algoritmaları
1. **BSA Hesaplama**: Mosteller formülü
2. **CrCl Hesaplama**: Cockcroft-Gault denklemi
3. **Yaş Ayarlamaları**: Hasta tipine göre faktörler
4. **Güvenlik Kontrolleri**: Maksimum doz sınırları

## 🎨 UI/UX Mimari

### Tema Sistemi
```typescript
Theme {
  colors: {
    primary, secondary, surface, background,
    text, textSecondary, error, warning, success
  },
  spacing: { xs, sm, md, lg, xl, xxl },
  fontSizes: { xs, sm, md, lg, xl, xxl, xxxl },
  borderRadius: { sm, md, lg, xl, full }
}
```

### Component Design Principles
- **Composition over Inheritance**: Küçük, birleştirilebilir bileşenler
- **Props Interface**: Strict TypeScript interfaces
- **Accessibility First**: Screen reader desteği
- **Responsive Design**: Farklı ekran boyutları

## 🔐 Güvenlik

### Veri Güvenliği
- **Local Storage**: AsyncStorage ile güvenli saklama
- **Input Validation**: Zod ile client-side validation
- **Error Handling**: Kullanıcı verilerini expose etmeyen error messages

### Hesaplama Güvenliği
- **Validation**: Tüm input'lar validate edilir
- **Bounds Checking**: Maksimum/minimum değer kontrolleri
- **Audit Trail**: Tüm hesaplamalar loglanır

## 🧪 Test Stratejisi

### Test Piramidi
```
E2E Tests (Detox)
├── Critical user flows
└── Integration scenarios

Integration Tests (Jest + RTL)
├── Component interactions
└── API integrations

Unit Tests (Jest)
├── Pure functions
├── Business logic
└── Utilities
```

### Test Coverage
- **Unit Tests**: %90+ coverage
- **Integration Tests**: Critical paths
- **E2E Tests**: Main user journeys

## 🚀 Performance

### Optimizasyon Stratejileri
- **Lazy Loading**: Route-based code splitting
- **Memoization**: React.memo ve useMemo
- **Image Optimization**: WebP format ve caching
- **Bundle Analysis**: Regular bundle size monitoring

### Performance Metrikleri
- **App Start Time**: <2.5s
- **Screen Transition**: <300ms
- **Memory Usage**: <100MB
- **Bundle Size**: <12MB

## 📱 Platform Desteği

### iOS
- **Minimum Version**: iOS 13.0
- **Architecture**: ARM64
- **Features**: Face ID, Touch ID, Push Notifications

### Android
- **Minimum Version**: API 21 (Android 5.0)
- **Architecture**: ARM64, x86_64
- **Features**: Fingerprint, Biometric, Push Notifications

### Web (Expo Web)
- **Browsers**: Chrome, Firefox, Safari, Edge
- **Features**: PWA support, Offline capability

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```
1. Code Quality
   ├── ESLint
   ├── Prettier
   ├── TypeScript
   └── Tests

2. Security
   ├── npm audit
   └── Snyk scan

3. Build
   ├── Android APK
   └── iOS IPA

4. Deploy
   ├── Google Play Store
   └── Apple App Store
```

### Fastlane Integration
- **Automated Builds**: Platform-specific builds
- **Code Signing**: Automatic certificate management
- **Store Deployment**: Automated store uploads

## 📊 Monitoring & Analytics

### Error Tracking (Sentry)
- **Crash Reporting**: Automatic crash detection
- **Performance Monitoring**: App performance metrics
- **Release Tracking**: Version-based error tracking

### Analytics
- **User Behavior**: Screen views, user actions
- **Performance Metrics**: Load times, errors
- **Business Metrics**: Calculation usage, drug popularity

## 🌐 Internationalization

### Dil Desteği
- **Türkçe**: Primary language
- **İngilizce**: Secondary language
- **Fallback**: Default to Turkish

### Çeviri Yönetimi
- **Namespace**: Feature-based organization
- **Pluralization**: Proper plural forms
- **Context**: Context-aware translations

## 🔮 Gelecek Planları

### Kısa Vadeli (3-6 ay)
- [ ] Offline support improvements
- [ ] Advanced drug database
- [ ] User authentication
- [ ] Cloud sync

### Orta Vadeli (6-12 ay)
- [ ] Multi-language support expansion
- [ ] Advanced analytics
- [ ] Integration with hospital systems
- [ ] AI-powered dosage suggestions

### Uzun Vadeli (1+ yıl)
- [ ] Web platform expansion
- [ ] API for third-party integrations
- [ ] Machine learning models
- [ ] Global drug database integration

## 📚 Kaynaklar

### Dokümantasyon
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Zustand](https://github.com/pmndrs/zustand)

### Best Practices
- [React Native Performance](https://reactnative.dev/docs/performance)
- [TypeScript Best Practices](https://typescript-eslint.io/docs/linting/typed-linting/)
- [Testing Best Practices](https://testing-library.com/docs/react-native-testing-library/intro/)

---

**Son Güncelleme**: 2024-01-XX  
**Versiyon**: 1.0.0  
**Güncelleyen**: Development Team
