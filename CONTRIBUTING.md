# Katkıda Bulunma Rehberi

Bu projeye katkıda bulunmak istediğiniz için teşekkürler! Bu rehber, projeye nasıl katkıda bulunabileceğinizi açıklar.

## 📋 İçindekiler

- [Kodlama Standartları](#kodlama-standartları)
- [Geliştirme Ortamı](#geliştirme-ortamı)
- [Git Workflow](#git-workflow)
- [Pull Request Süreci](#pull-request-süreci)
- [Test Yazma](#test-yazma)
- [Dokümantasyon](#dokümantasyon)
- [Sorun Bildirimi](#sorun-bildirimi)

## 🛠️ Geliştirme Ortamı

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Expo CLI
- Git
- iOS Simulator (iOS geliştirme için)
- Android Studio (Android geliştirme için)

### Kurulum
```bash
# Repository'yi klonlayın
git clone <repository-url>
cd DosageCalculator

# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npm start
```

## 📝 Kodlama Standartları

### TypeScript
- Strict mode kullanın
- Explicit return types tanımlayın
- `any` tipini kullanmaktan kaçının
- Interface'leri tercih edin

### React Native
- Functional components kullanın
- Hooks'ları doğru şekilde kullanın
- Performance optimizasyonları yapın
- Accessibility özelliklerini ekleyin

### Styling
- StyleSheet kullanın
- Theme system'i takip edin
- Responsive design uygulayın
- Consistent spacing kullanın

### Naming Conventions
```typescript
// Components: PascalCase
const PatientInfoScreen = () => {};

// Functions: camelCase
const calculateDosage = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_DAILY_DOSE = 1000;

// Types/Interfaces: PascalCase
interface PatientData {}
type DosageResult = {};
```

## 🔄 Git Workflow

### Branch Strategy
```
main (production)
├── develop (development)
├── feature/feature-name
├── bugfix/bug-description
└── hotfix/critical-fix
```

### Commit Messages
Conventional Commits formatını kullanın:
```
type(scope): description

feat(patient): add age validation
fix(calculation): resolve BSA calculation error
docs(readme): update installation instructions
test(dosage): add unit tests for calculation functions
```

### Commit Types
- `feat`: Yeni özellik
- `fix`: Bug düzeltmesi
- `docs`: Dokümantasyon değişikliği
- `style`: Kod formatı (linting, prettier)
- `refactor`: Kod refactoring
- `test`: Test ekleme/düzeltme
- `chore`: Build process, dependencies

## 🚀 Pull Request Süreci

### PR Oluşturma
1. Feature branch oluşturun
2. Değişikliklerinizi yapın
3. Testleri çalıştırın
4. PR oluşturun

### PR Template
```markdown
## Açıklama
Bu PR ne yapıyor?

## Değişiklik Türü
- [ ] Bug fix
- [ ] Yeni özellik
- [ ] Breaking change
- [ ] Dokümantasyon güncellemesi

## Test Edildi
- [ ] Unit testler geçiyor
- [ ] Integration testler geçiyor
- [ ] Manuel test yapıldı

## Screenshots (varsa)
[Ekran görüntüleri]

## Checklist
- [ ] Kod review yapıldı
- [ ] Dokümantasyon güncellendi
- [ ] Test coverage yeterli
- [ ] Breaking change yoksa
```

### Review Kriterleri
- [ ] Kod kalitesi yüksek
- [ ] Test coverage yeterli
- [ ] Performance etkisi değerlendirildi
- [ ] Security implications kontrol edildi
- [ ] Accessibility standartlarına uygun

## 🧪 Test Yazma

### Test Stratejisi
```typescript
// Unit Tests
describe('calculateBSA', () => {
  it('should calculate BSA correctly', () => {
    const result = calculateBSA(170, 70);
    expect(result).toBeCloseTo(1.82, 2);
  });
});

// Component Tests
describe('PatientInfoScreen', () => {
  it('should render patient form', () => {
    render(<PatientInfoScreen />);
    expect(screen.getByText('Hasta Bilgileri')).toBeInTheDocument();
  });
});

// Integration Tests
describe('Dosage Calculation Flow', () => {
  it('should complete full flow', async () => {
    // Test complete user journey
  });
});
```

### Test Coverage
- **Minimum**: %80 coverage
- **Hedef**: %90+ coverage
- **Critical paths**: %100 coverage

### Test Dosyaları
```
src/
├── components/
│   └── __tests__/
├── screens/
│   └── __tests__/
├── features/
│   └── dosage/
│       └── __tests__/
└── utils/
    └── __tests__/
```

## 📚 Dokümantasyon

### Kod Dokümantasyonu
```typescript
/**
 * Calculate Body Surface Area using Mosteller formula
 * @param height - Height in centimeters
 * @param weight - Weight in kilograms
 * @returns BSA in square meters
 * @throws {Error} When height or weight is invalid
 */
export const calculateBSA = (height: number, weight: number): number => {
  // Implementation
};
```

### README Güncellemeleri
- Yeni özellikler için dokümantasyon ekleyin
- API değişikliklerini belirtin
- Breaking change'leri açıklayın

### Architecture Dokümantasyonu
- Yeni mimari kararları ARCHITECTURE.md'ye ekleyin
- Diagram'ları güncelleyin
- Design pattern'leri açıklayın

## 🐛 Sorun Bildirimi

### Bug Report Template
```markdown
## Bug Açıklaması
Açık ve kısa bir açıklama

## Adımlar
1. '...' sayfasına git
2. '...' butonuna tıkla
3. '...' hatası görünür

## Beklenen Davranış
Ne olması gerekiyordu?

## Gerçek Davranış
Ne oldu?

## Screenshots
Varsa ekran görüntüleri

## Environment
- OS: [e.g. iOS 15.0, Android 11]
- App Version: [e.g. 1.0.0]
- Device: [e.g. iPhone 13, Samsung Galaxy S21]

## Additional Context
Ek bilgiler
```

### Feature Request Template
```markdown
## Feature Açıklaması
Ne istiyorsunuz?

## Problem
Hangi problemi çözüyor?

## Çözüm
Önerdiğiniz çözüm

## Alternatives
Alternatif çözümler

## Additional Context
Ek bilgiler
```

## 🔧 Geliştirme Araçları

### VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- React Native Tools

### Debugging
```bash
# React Native Debugger
npm install -g react-native-debugger

# Flipper
# Download from https://fbflipper.com/

# Chrome DevTools
# Enable in React Native Debugger
```

### Performance Profiling
```bash
# Bundle analyzer
npm run analyze

# Performance monitoring
# Use React DevTools Profiler
```

## 📋 Code Review Checklist

### Kod Kalitesi
- [ ] Kod okunabilir ve anlaşılır
- [ ] Naming conventions doğru
- [ ] DRY principle uygulanmış
- [ ] SOLID principles takip edilmiş

### Performance
- [ ] Unnecessary re-renders yok
- [ ] Memory leaks kontrol edilmiş
- [ ] Bundle size etkisi değerlendirilmiş

### Security
- [ ] Input validation yapılmış
- [ ] Sensitive data expose edilmemiş
- [ ] Authentication/authorization kontrol edilmiş

### Accessibility
- [ ] Screen reader desteği var
- [ ] Keyboard navigation çalışıyor
- [ ] Color contrast yeterli
- [ ] Touch targets yeterli boyutta

## 🎯 Katkı Türleri

### Code Contributions
- Bug fixes
- New features
- Performance improvements
- Refactoring

### Documentation
- README updates
- Code comments
- Architecture docs
- Tutorials

### Testing
- Unit tests
- Integration tests
- E2E tests
- Test utilities

### Design
- UI/UX improvements
- Accessibility enhancements
- Performance optimizations

## 📞 İletişim

### Sorular
- GitHub Issues kullanın
- Discussions bölümünü kullanın
- Email: [project-email]

### Geliştirici Topluluğu
- Discord: [discord-link]
- Slack: [slack-link]
- Forum: [forum-link]

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Katkıda bulunarak, kodunuzun bu lisans altında yayınlanmasını kabul etmiş olursunuz.

## 🙏 Teşekkürler

Katkıda bulunan herkese teşekkürler! Projeyi daha iyi hale getirmek için zaman ayırdığınız için minnettarız.

---

**Son Güncelleme**: 2024-01-XX  
**Versiyon**: 1.0.0
