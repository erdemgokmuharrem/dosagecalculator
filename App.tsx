import React, { useState, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

import ChemotherapyDoseScreen from './src/screens/ChemotherapyDoseScreen';
import { ThemeProvider as UIThemeProvider } from './src/contexts/ThemeContext';

const Stack = createNativeStackNavigator();

// Tema Context
const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
  colors: {
    background: '#fef2f2',
    surface: '#fff',
    text: '#1a1a1a',
    primary: '#dc2626',
    secondary: '#f59e0b',
    border: '#e5e7eb',
  }
});

// Dil Context
const LanguageContext = createContext({
  language: 'tr',
  setLanguage: (lang: string) => {},
  t: (key: string) => key
});

// Tema Provider
function ThemeProvider({ children }: any) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const colors = {
    light: {
      background: '#fef7f7',
      surface: '#ffffff',
      text: '#1f2937',
      primary: '#dc2626',
      primaryLight: '#fef2f2',
      secondary: '#f59e0b',
      secondaryLight: '#fef3c7',
      border: '#e5e7eb',
      cardBackground: '#ffffff',
      inputBackground: '#f9fafb',
      shadow: '#dc2626',
      gradient: ['#dc2626', '#ef4444'],
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    dark: {
      background: '#0f0f0f',
      surface: '#1a1a1a',
      text: '#f9fafb',
      primary: '#ef4444',
      primaryLight: '#1f2937',
      secondary: '#f59e0b',
      secondaryLight: '#374151',
      border: '#374151',
      cardBackground: '#1a1a1a',
      inputBackground: '#374151',
      shadow: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    }
  };

  const currentColors = isDark ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors: currentColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Dil Provider
function LanguageProvider({ children }: any) {
  const [language, setLanguage] = useState('tr');

  const translations = {
    tr: {
      'app.title': 'Doza Hesaplayıcı',
      'home.patient.info': 'Hasta Bilgileri',
      'home.patient.subtitle': 'Yaş, kilo, boy girişi ve doz hesaplama',
      'home.drug.selection': 'İlaç Seçimi',
      'home.drug.subtitle': 'İlaç arama ve seçim',
      'home.history': 'Geçmiş',
      'home.history.subtitle': 'Hesaplama kayıtları',
      'home.settings': 'Ayarlar',
      'home.settings.subtitle': 'Dil ve tema ayarları',
      'home.chemo': 'Kemoterapi Dozu',
      'home.chemo.subtitle': 'BSA ile kemoterapi doz hesaplama',
      'home.warning.title': 'ÖNEMLİ UYARI',
      'home.warning.text1': 'Bu uygulama sadece eğitim amaçlıdır. Tıbbi tavsiye niteliği taşımaz.',
      'home.warning.text2': 'Tüm doz hesaplamaları doktor onayı olmadan kullanılmamalıdır.',
    },
    en: {
      'app.title': 'Dosage Calculator',
      'home.patient.info': 'Patient Information',
      'home.patient.subtitle': 'Age, weight, height entry and dosage calculation',
      'home.drug.selection': 'Drug Selection',
      'home.drug.subtitle': 'Drug search and selection',
      'home.history': 'History',
      'home.history.subtitle': 'Calculation records',
      'home.settings': 'Settings',
      'home.settings.subtitle': 'Language and theme settings',
      'home.chemo': 'Chemotherapy Dose',
      'home.chemo.subtitle': 'Calculate chemotherapy dose via BSA',
      'home.warning.title': 'IMPORTANT WARNING',
      'home.warning.text1': 'This application is for educational purposes only. It does not constitute medical advice.',
      'home.warning.text2': 'All dosage calculations should not be used without doctor approval.',
    }
  };

  const t = (key: string) => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.tr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Ana Sayfa Bileşeni
function HomeScreen({ navigation }: any) {
  const { colors } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 50, // Status bar için boşluk
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
      paddingTop: 24,
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 12,
      borderWidth: 1,
      borderColor: colors.primaryLight,
    },
    title: {
      fontSize: 32,
      fontWeight: '800',
      color: colors.primary,
      marginBottom: 8,
      textAlign: 'center',
      letterSpacing: -0.5,
      textShadowColor: colors.primaryLight,
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    menuButton: {
      backgroundColor: colors.surface,
      padding: 24,
      borderRadius: 20,
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: colors.border,
      transform: [{ scale: 1 }],
    },
    menuButtonText: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
      letterSpacing: -0.3,
    },
    menuButtonSubtext: {
      fontSize: 15,
      color: colors.text,
      opacity: 0.75,
      lineHeight: 20,
    },
    eulaContainer: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      marginTop: 24,
      borderWidth: 2,
      borderColor: colors.primary,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    eulaTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 16,
      letterSpacing: -0.3,
    },
    eulaText: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
      marginBottom: 12,
      opacity: 0.9,
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        {/* Tıbbi Simgeler */}
        <View style={styles.medicalIcons}>
          <Text style={styles.medicalIcon}>⚕️</Text>
          <Text style={styles.medicalIcon}>💊</Text>
          <Text style={styles.medicalIcon}>🩺</Text>
        </View>
        <Text style={dynamicStyles.title}>🧮 DozuHesapla!</Text>
        <Text style={styles.subtitle}>İlaç Doz Hesaplama Uygulaması</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={dynamicStyles.menuButton}
          onPress={() => navigation.navigate('PatientInfo')}
        >
          <Text style={dynamicStyles.menuButtonText}>👤 {t('home.patient.info')}</Text>
          <Text style={dynamicStyles.menuButtonSubtext}>
            {t('home.patient.subtitle')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.menuButton}
          onPress={() => navigation.navigate('DrugSelection')}
        >
          <Text style={dynamicStyles.menuButtonText}>💊 {t('home.drug.selection')}</Text>
          <Text style={dynamicStyles.menuButtonSubtext}>{t('home.drug.subtitle')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.menuButton}
          onPress={() => navigation.navigate('ChemotherapyDose')}
        >
          <Text style={dynamicStyles.menuButtonText}>💉 {t('home.chemo')}</Text>
          <Text style={dynamicStyles.menuButtonSubtext}>{t('home.chemo.subtitle')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.menuButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={dynamicStyles.menuButtonText}>📊 {t('home.history')}</Text>
          <Text style={dynamicStyles.menuButtonSubtext}>{t('home.history.subtitle')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.menuButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={dynamicStyles.menuButtonText}>⚙️ {t('home.settings')}</Text>
          <Text style={dynamicStyles.menuButtonSubtext}>{t('home.settings.subtitle')}</Text>
        </TouchableOpacity>
      </View>

      {/* Kızılay/Kızılhaç Simgeleri */}
      <View style={styles.redCrossContainer}>
        <Text style={styles.redCrossText}>🏥</Text>
        <Text style={styles.redCrossText}>⚕️</Text>
        <Text style={styles.redCrossText}>🩺</Text>
        <Text style={styles.redCrossText}>💊</Text>
        <Text style={styles.redCrossText}>🏥</Text>
      </View>

      {/* EULA Uyarısı */}
      <View style={dynamicStyles.eulaContainer}>
        <Text style={dynamicStyles.eulaTitle}>⚠️ {t('home.warning.title')}</Text>
        <Text style={dynamicStyles.eulaText}>
          {t('home.warning.text1')}
        </Text>
        <Text style={dynamicStyles.eulaText}>
          {t('home.warning.text2')}
        </Text>
      </View>
    </ScrollView>
  );
}

// Hasta Bilgileri Ekranı
function PatientInfoScreen({ navigation }: any) {
  const { colors } = useContext(ThemeContext);
  const [age, setAge] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [height, setHeight] = React.useState('');
  const [gender, setGender] = React.useState('male');
  const [patientType, setPatientType] = React.useState('adult');
  const [creatinine, setCreatinine] = React.useState('');
  const [crcl, setCrcl] = React.useState('');
  const [bmi, setBmi] = React.useState('');
  const [selectedDrug, setSelectedDrug] = React.useState<any>(null);
  const [searchText, setSearchText] = React.useState('');
  const [showDrugList, setShowDrugList] = React.useState(false);

  // İlaç listesi (kısaltılmış)
  const drugs = [
    {
      id: 1,
      name: 'Paracetamol',
      category: 'analgesic',
      dosage: '15 mg/kg',
      maxDaily: '4000 mg',
      frequency: '4-6 saatte bir',
      description: 'Ağrı kesici ve ateş düşürücü',
      contraindications: 'Karaciğer yetmezliği, alkol bağımlılığı',
      sideEffects: 'Karaciğer toksisitesi, alerjik reaksiyonlar',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 2,
      name: 'Aspirin',
      category: 'analgesic',
      dosage: '10-15 mg/kg',
      maxDaily: '4000 mg',
      frequency: '4-6 saatte bir',
      description: 'NSAID, ağrı kesici ve anti-inflamatuar',
      contraindications: 'Peptik ülser, kanama bozuklukları, Reye sendromu riski (çocuklarda)',
      sideEffects: 'Mide irritasyonu, kanama riski, tinnitus',
      interactions: 'Warfarin, metotreksat ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 3,
      name: 'Ibuprofen',
      category: 'analgesic',
      dosage: '5-10 mg/kg',
      maxDaily: '2400 mg',
      frequency: '6-8 saatte bir',
      description: 'NSAID, ağrı kesici ve ateş düşürücü',
      contraindications: 'Peptik ülser, kalp yetmezliği, böbrek yetmezliği',
      sideEffects: 'Mide irritasyonu, baş ağrısı, baş dönmesi',
      interactions: 'Warfarin, lityum ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 4,
      name: 'Amoxicillin',
      category: 'antibiotic',
      dosage: '25-50 mg/kg',
      maxDaily: '3000 mg',
      frequency: '8 saatte bir',
      description: 'Penisilin grubu antibiyotik',
      contraindications: 'Penisilin alerjisi, enfeksiyöz mononükleoz',
      sideEffects: 'Döküntü, ishal, bulantı, kusma',
      interactions: 'Warfarin, metotreksat ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 5,
      name: 'Ceftriaxone',
      category: 'antibiotic',
      dosage: '50-100 mg/kg',
      maxDaily: '4000 mg',
      frequency: '12-24 saatte bir',
      description: '3. nesil sefalosporin',
      contraindications: 'Sefalosporin alerjisi, safra taşı',
      sideEffects: 'Döküntü, ishal, enjeksiyon yeri reaksiyonu',
      interactions: 'Warfarin, probenesid ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 6,
      name: 'Morphine',
      category: 'opioid',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '200 mg',
      frequency: '4-6 saatte bir',
      description: 'Güçlü opioid analjezik',
      contraindications: 'Solunum yetmezliği, bağımlılık öyküsü, böbrek yetmezliği',
      sideEffects: 'Sedasyon, solunum depresyonu, kabızlık, bulantı',
      interactions: 'Alkol, benzodiazepinler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 7,
      name: 'Furosemide',
      category: 'diuretic',
      dosage: '0.5-2 mg/kg',
      maxDaily: '600 mg',
      frequency: 'Günde 1-2 kez',
      description: 'Loop diüretik',
      contraindications: 'Anüri, şiddetli hipokalemi, dehidratasyon',
      sideEffects: 'Hipokalemi, dehidratasyon, hipotansiyon, ototoksisite',
      interactions: 'Digoksin, lityum, aminoglikozidler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 8,
      name: 'Digoxin',
      category: 'cardiac',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '0.5 mg',
      frequency: 'Günde bir kez',
      description: 'Kardiyak glikozid',
      contraindications: 'Ventriküler taşikardi, AV blok, hipokalemi',
      sideEffects: 'Bulantı, kusma, görme bozuklukları, aritmi',
      interactions: 'Furosemid, amiodaron, verapamil ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
  ];

  const filteredDrugs = drugs.filter(drug =>
    drug.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const calculateDosage = () => {
    if (!selectedDrug || !age || !weight) return null;

    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);

    if (isNaN(ageNum) || isNaN(weightNum)) return null;

    // Basit doz hesaplama
    let calculatedDose = 0;
    let unit = 'mg';

    if (selectedDrug.name === 'Paracetamol') {
      calculatedDose = weightNum * 15;
    } else if (selectedDrug.name === 'Aspirin') {
      calculatedDose = weightNum * 12.5;
    } else if (selectedDrug.name === 'Ibuprofen') {
      calculatedDose = weightNum * 7.5;
    } else if (selectedDrug.name === 'Amoxicillin') {
      calculatedDose = weightNum * 37.5;
    } else if (selectedDrug.name === 'Ceftriaxone') {
      calculatedDose = weightNum * 75;
    } else if (selectedDrug.name === 'Morphine') {
      calculatedDose = weightNum * 0.15;
      unit = 'mg';
    } else if (selectedDrug.name === 'Furosemide') {
      calculatedDose = weightNum * 1.25;
    } else if (selectedDrug.name === 'Digoxin') {
      calculatedDose = weightNum * 0.015;
      unit = 'mg';
    }

    return {
      singleDose: calculatedDose.toFixed(2),
      maxDaily: selectedDrug.maxDaily,
      unit: unit,
      frequency: ageNum < 2 ? '4-6 saatte bir' : '6-8 saatte bir',
    };
  };

  // BMI hesaplama fonksiyonu
  const calculateBMI = (weight: number, height: number) => {
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return '';
  };

  // CRCL hesaplama fonksiyonu (Cockcroft-Gault formülü)
  const calculateCRCL = (age: number, weight: number, creatinine: number, gender: string) => {
    if (age > 0 && weight > 0 && creatinine > 0) {
      const genderFactor = gender === 'male' ? 1 : 0.85;
      return Math.round(((140 - age) * weight * genderFactor) / (72 * creatinine));
    }
    return '';
  };

  const dosageResult = calculateDosage();

  const handleCalculate = () => {
    if (!selectedDrug || !age || !weight) {
      Alert.alert('Hata', 'Lütfen tüm hasta bilgilerini ve ilacı girin!');
      return;
    }
    // Hesaplama sonucu zaten gösteriliyor
  };

  const handleSave = () => {
    if (!age || !weight || !height || !gender || !patientType) {
      Alert.alert('Hata', 'Lütfen tüm hasta bilgilerini doldurun');
      return;
    }
    if (!selectedDrug) {
      Alert.alert('Lütfen bir ilaç seçin');
      return;
    }

    // Hasta verilerini hazırla
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseFloat(age);
    const creatinineNum = parseFloat(creatinine) || 0;
    
    const patientData = {
      age: age,
      weight: weight,
      height: height,
      gender: gender,
      patientType: patientType,
      creatinine: creatinine,
      crcl: calculateCRCL(ageNum, weightNum, creatinineNum, gender),
      bmi: calculateBMI(weightNum, heightNum),
    };

    // Doz hesaplama yap (tıbbi parametrelerle)
    let singleDose = 0;
    let maxDailyDose = 0;
    let frequency = '';
    let adjustmentFactor = 1;

    // CRCL'ye göre doz ayarlama
    const crclValue = parseFloat(patientData.crcl) || 0;
    if (crclValue > 0) {
      if (crclValue < 30) {
        adjustmentFactor = 0.5; // Böbrek yetmezliği
      } else if (crclValue < 60) {
        adjustmentFactor = 0.75; // Hafif böbrek yetmezliği
      }
    }

    // BMI'ye göre doz ayarlama
    const bmiValue = parseFloat(patientData.bmi) || 0;
    if (bmiValue > 30) {
      adjustmentFactor *= 1.1; // Obezite için hafif artış
    } else if (bmiValue < 18.5) {
      adjustmentFactor *= 0.9; // Zayıflık için hafif azalış
    }

    // Yaş grubuna göre doz ayarlama
    if (ageNum < 2) {
      adjustmentFactor *= 0.8; // Yenidoğan/bebek
    } else if (ageNum > 65) {
      adjustmentFactor *= 0.9; // Yaşlı
    }

    // İlaç bazlı hesaplama
    switch (selectedDrug.name) {
      case 'Paracetamol':
        singleDose = weightNum * 15 * adjustmentFactor; // 15 mg/kg
        maxDailyDose = Math.min(weightNum * 15 * 4 * adjustmentFactor, 4000);
        frequency = '4 kez/gün';
        break;
      case 'Aspirin':
        singleDose = weightNum * 12.5 * adjustmentFactor; // 10-15 mg/kg ortalaması
        maxDailyDose = Math.min(weightNum * 12.5 * 3 * adjustmentFactor, 4000);
        frequency = '3 kez/gün';
        break;
      case 'Ibuprofen':
        singleDose = weightNum * 7.5 * adjustmentFactor; // 5-10 mg/kg ortalaması
        maxDailyDose = Math.min(weightNum * 7.5 * 3 * adjustmentFactor, 2400);
        frequency = '3 kez/gün';
        break;
      case 'Amoxicillin':
        singleDose = weightNum * 37.5 * adjustmentFactor; // 25-50 mg/kg ortalaması
        maxDailyDose = Math.min(weightNum * 37.5 * 3 * adjustmentFactor, 3000);
        frequency = '3 kez/gün';
        break;
      default:
        singleDose = weightNum * 10 * adjustmentFactor; // Varsayılan
        maxDailyDose = weightNum * 10 * 3 * adjustmentFactor;
        frequency = '3 kez/gün';
    }

    const calculationResult = {
      drugName: selectedDrug.name,
      singleDose: Math.round(singleDose),
      maxDailyDose: Math.round(maxDailyDose),
      frequency,
      weight: weightNum,
      bmi: patientData.bmi,
      crcl: patientData.crcl,
      creatinine: patientData.creatinine,
      adjustmentFactor: adjustmentFactor.toFixed(2),
      isSafe: singleDose <= maxDailyDose / 3, // Güvenlik kontrolü
      warnings: [] as string[],
    };

    // Güvenlik uyarıları
    if (singleDose > maxDailyDose / 2) {
      calculationResult.warnings.push('Yüksek doz! Dikkatli kullanın.');
    }
    if (weightNum < 10) {
      calculationResult.warnings.push('Düşük kilo! Pediatrik doz kontrolü gerekli.');
    }
    if (weightNum > 100) {
      calculationResult.warnings.push('Yüksek kilo! Maksimum doz sınırını kontrol edin.');
    }
    if (crclValue > 0 && crclValue < 30) {
      calculationResult.warnings.push('Böbrek yetmezliği! Doz azaltıldı.');
    }
    if (bmiValue > 30) {
      calculationResult.warnings.push('Obezite! Doz ayarlandı.');
    }
    if (bmiValue < 18.5) {
      calculationResult.warnings.push('Zayıflık! Doz ayarlandı.');
    }
    if (ageNum > 65) {
      calculationResult.warnings.push('Yaşlı hasta! Doz azaltıldı.');
    }

    // Hesaplama sonuçlarını güncelle
    setCalculationResult(calculationResult);

    // Başarı mesajı göster ve geçmiş ekranına git
    Alert.alert(
      'Hesaplama Tamamlandı',
      'Doza hesaplama başarıyla tamamlandı ve geçmişe kaydedildi.',
      [
        {
          text: 'Geçmişi Görüntüle',
          onPress: () => navigation.navigate('History')
        },
        {
          text: 'Tamam',
          style: 'cancel'
        }
      ]
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 50,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Geri Butonu */}
      <TouchableOpacity 
        style={styles.backButtonTop}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonIcon}>‹</Text>
      </TouchableOpacity>
      
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>👤 Hasta Bilgileri</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>🎂 Yaş</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Yaşınızı girin (örn: 30)"
              placeholderTextColor="#A0AEC0"
              keyboardType="numeric"
            />
            <Text style={styles.inputUnit}>yaş</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>⚖️ Kilo</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="Kilonuzu girin (örn: 70)"
              placeholderTextColor="#A0AEC0"
              keyboardType="numeric"
            />
            <Text style={styles.inputUnit}>kg</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>📏 Boy</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="Boyunuzu girin (örn: 175)"
              placeholderTextColor="#A0AEC0"
              keyboardType="numeric"
            />
            <Text style={styles.inputUnit}>cm</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>👤 Cinsiyet</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                gender === 'male' && styles.radioButtonSelected,
              ]}
              onPress={() => setGender('male')}
            >
              <Text style={styles.radioIcon}>👨</Text>
              <Text
                style={[
                  styles.radioText,
                  gender === 'male' && styles.radioTextSelected,
                ]}
              >
                Erkek
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                gender === 'female' && styles.radioButtonSelected,
              ]}
              onPress={() => setGender('female')}
            >
              <Text style={styles.radioIcon}>👩</Text>
              <Text
                style={[
                  styles.radioText,
                  gender === 'female' && styles.radioTextSelected,
                ]}
              >
                Kadın
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>🧪 Creatinine (mg/dL) - Opsiyonel</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={creatinine}
              onChangeText={setCreatinine}
              placeholder="Creatinine değeri (örn: 1.0)"
              placeholderTextColor="#A0AEC0"
              keyboardType="numeric"
            />
            <Text style={styles.inputUnit}>mg/dL</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>⚖️ BMI (Otomatik Hesaplanır)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: '#f7fafc' }]}
              value={weight && height ? calculateBMI(parseFloat(weight), parseFloat(height)) : ''}
              placeholder="BMI otomatik hesaplanır"
              placeholderTextColor="#A0AEC0"
              editable={false}
            />
            <Text style={styles.inputUnit}>kg/m²</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>🫀 CRCL (Otomatik Hesaplanır)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: '#f7fafc' }]}
              value={age && weight && creatinine ? calculateCRCL(parseFloat(age), parseFloat(weight), parseFloat(creatinine), gender) : ''}
              placeholder="CRCL otomatik hesaplanır"
              placeholderTextColor="#A0AEC0"
              editable={false}
            />
            <Text style={styles.inputUnit}>mL/min</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>🏥 Hasta Tipi</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[
                styles.pickerButton,
                patientType === 'adult' && styles.pickerButtonSelected,
              ]}
              onPress={() => setPatientType('adult')}
            >
              <Text style={styles.pickerIcon}>👨‍💼</Text>
              <Text
                style={[
                  styles.pickerText,
                  patientType === 'adult' && styles.pickerTextSelected,
                ]}
              >
                Yetişkin
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pickerButton,
                patientType === 'child' && styles.pickerButtonSelected,
              ]}
              onPress={() => setPatientType('child')}
            >
              <Text style={styles.pickerIcon}>👶</Text>
              <Text
                style={[
                  styles.pickerText,
                  patientType === 'child' && styles.pickerTextSelected,
                ]}
              >
                Çocuk
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pickerButton,
                patientType === 'neonatal' && styles.pickerButtonSelected,
              ]}
              onPress={() => setPatientType('neonatal')}
            >
              <Text style={styles.pickerIcon}>🍼</Text>
              <Text
                style={[
                  styles.pickerText,
                  patientType === 'neonatal' && styles.pickerTextSelected,
                ]}
              >
                Yenidoğan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pickerButton,
                patientType === 'elderly' && styles.pickerButtonSelected,
              ]}
              onPress={() => setPatientType('elderly')}
            >
              <Text style={styles.pickerIcon}>👴</Text>
              <Text
                style={[
                  styles.pickerText,
                  patientType === 'elderly' && styles.pickerTextSelected,
                ]}
              >
                Yaşlı
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* İlaç Seçimi Bölümü */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>💊 İlaç Seçimi</Text>
          <TouchableOpacity
            style={styles.drugSelector}
            onPress={() => setShowDrugList(!showDrugList)}
          >
            <Text style={styles.drugSelectorText}>
              {selectedDrug ? selectedDrug.name : 'İlaç seçin...'}
            </Text>
            <Text style={styles.drugSelectorIcon}>▼</Text>
          </TouchableOpacity>

          {showDrugList && (
            <View style={styles.drugListContainer}>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="İlaç ara..."
                  placeholderTextColor="#A0AEC0"
                />
              </View>
              <ScrollView
                style={styles.drugList}
                showsVerticalScrollIndicator={false}
              >
                {filteredDrugs.map(drug => (
                  <TouchableOpacity
                    key={drug.id}
                    style={[
                      styles.drugOption,
                      selectedDrug?.id === drug.id && styles.drugOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedDrug(drug);
                      setShowDrugList(false);
                    }}
                  >
                    <Text style={styles.drugOptionName}>{drug.name}</Text>
                    <Text style={styles.drugOptionDesc}>
                      {drug.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Hesaplama Sonuçları */}
        {dosageResult && (
          <View style={styles.dosageResultContainer}>
            <Text style={styles.dosageResultTitle}>📊 Hesaplama Sonuçları</Text>
            <View style={styles.dosageResultCard}>
              <View style={styles.dosageResultRow}>
                <Text style={styles.dosageResultLabel}>💊 Tek Doz:</Text>
                <Text style={styles.dosageResultValue}>
                  {dosageResult.singleDose} {dosageResult.unit}
                </Text>
              </View>
              <View style={styles.dosageResultRow}>
                <Text style={styles.dosageResultLabel}>⏰ Sıklık:</Text>
                <Text style={styles.dosageResultValue}>
                  {dosageResult.frequency}
                </Text>
              </View>
              <View style={styles.dosageResultRow}>
                <Text style={styles.dosageResultLabel}>⚠️ Max Günlük:</Text>
                <Text style={styles.dosageResultValue}>
                  {dosageResult.maxDaily}
                </Text>
              </View>
              <View style={styles.dosageResultRow}>
                <Text style={styles.dosageResultLabel}>⚖️ BMI:</Text>
                <Text style={styles.dosageResultValue}>
                  {weight && height ? calculateBMI(parseFloat(weight), parseFloat(height)) : 'N/A'} kg/m²
                </Text>
              </View>
              <View style={styles.dosageResultRow}>
                <Text style={styles.dosageResultLabel}>🫀 CRCL:</Text>
                <Text style={styles.dosageResultValue}>
                  {age && weight && creatinine ? calculateCRCL(parseFloat(age), parseFloat(weight), parseFloat(creatinine), gender) : 'N/A'} mL/min
                </Text>
              </View>
            </View>
          </View>
        )}


        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>💾 Bilgileri Kaydet</Text>
        </TouchableOpacity>

        {/* EULA ve Yasal Uyarılar */}
        <View style={styles.eulaContainer}>
          <Text style={styles.eulaTitle}>⚠️ ÖNEMLİ YASAL UYARI</Text>
          <Text style={styles.eulaText}>
            Bu uygulama sadece eğitim ve referans amaçlıdır. Tıbbi tavsiye niteliği taşımaz.
          </Text>
          <Text style={styles.eulaText}>
            • Tüm doz hesaplamaları doktor onayı olmadan kullanılmamalıdır
          </Text>
          <Text style={styles.eulaText}>
            • Hasta güvenliği için mutlaka sağlık profesyoneli kontrolü gereklidir
          </Text>
          <Text style={styles.eulaText}>
            • Uygulama kullanımından doğacak tüm sorumluluk kullanıcıya aittir
          </Text>
          <Text style={styles.eulaText}>
            • Acil durumlarda derhal tıbbi yardım alınmalıdır
          </Text>
          
          <TouchableOpacity 
            style={styles.eulaButton}
            onPress={() => {
              Alert.alert(
                'EULA Koşulları',
                'Bu uygulama sadece eğitim amaçlıdır. Tıbbi tavsiye niteliği taşımaz. Tüm doz hesaplamaları doktor onayı olmadan kullanılmamalıdır. Hasta güvenliği için mutlaka sağlık profesyoneli kontrolü gereklidir. Uygulama kullanımından doğacak tüm sorumluluk kullanıcıya aittir.',
                [{ text: 'Anladım' }]
              );
            }}
          >
            <Text style={styles.eulaButtonText}>📋 Detaylı EULA Koşulları</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

// İlaç Seçimi Ekranı
function DrugSelectionScreen({ navigation }: any) {
  const { colors } = useContext(ThemeContext);
  const [searchText, setSearchText] = React.useState('');
  const [selectedDrug, setSelectedDrug] = React.useState<any>(null);
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const drugs = [
    // Analgesic & Antipyretic (Ağrı Kesici ve Ateş Düşürücü)
    {
      id: 1,
      name: 'Paracetamol',
      category: 'analgesic',
      dosage: '15 mg/kg',
      maxDaily: '4000 mg',
      frequency: '4-6 saatte bir',
      description: 'Ağrı kesici ve ateş düşürücü',
      contraindications: 'Karaciğer yetmezliği, alkol bağımlılığı',
      sideEffects: 'Mide bulantısı, karaciğer hasarı (yüksek dozda)',
      interactions: 'Warfarin ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 2,
      name: 'Aspirin',
      category: 'analgesic',
      dosage: '10-15 mg/kg',
      maxDaily: '4000 mg',
      frequency: '4-6 saatte bir',
      description: 'NSAID, ağrı kesici ve anti-inflamatuar',
      contraindications: 'Peptik ülser, kanama bozuklukları, Reye sendromu riski (çocuklarda)',
      sideEffects: 'Mide irritasyonu, kanama riski, tinnitus',
      interactions: 'Warfarin, metotreksat ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 3,
      name: 'Ibuprofen',
      category: 'analgesic',
      dosage: '5-10 mg/kg',
      maxDaily: '2400 mg',
      frequency: '6-8 saatte bir',
      description: 'NSAID, ağrı kesici ve ateş düşürücü',
      contraindications: 'Peptik ülser, kalp yetmezliği, böbrek yetmezliği',
      sideEffects: 'Mide irritasyonu, baş ağrısı, baş dönmesi',
      interactions: 'Warfarin, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 4,
      name: 'Naproxen',
      category: 'analgesic',
      dosage: '5-7 mg/kg',
      maxDaily: '1500 mg',
      frequency: '12 saatte bir',
      description: 'NSAID, uzun etkili ağrı kesici',
      contraindications: 'Peptik ülser, kalp yetmezliği, böbrek yetmezliği',
      sideEffects: 'Mide irritasyonu, baş ağrısı, uyku hali',
      interactions: 'Warfarin, lityum ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 5,
      name: 'Diclofenac',
      category: 'analgesic',
      dosage: '1-3 mg/kg',
      maxDaily: '150 mg',
      frequency: '8-12 saatte bir',
      description: 'NSAID, güçlü anti-inflamatuar',
      contraindications: 'Peptik ülser, kalp yetmezliği, böbrek yetmezliği',
      sideEffects: 'Mide irritasyonu, baş ağrısı, cilt döküntüsü',
      interactions: 'Warfarin, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 6,
      name: 'Ketorolac',
      category: 'analgesic',
      dosage: '0.5 mg/kg',
      maxDaily: '120 mg',
      frequency: '6 saatte bir',
      description: 'Güçlü NSAID, kısa süreli kullanım',
      contraindications: 'Peptik ülser, böbrek yetmezliği, kanama riski',
      sideEffects: 'Mide irritasyonu, böbrek hasarı, kanama riski',
      interactions: 'Warfarin, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 7,
      name: 'Meloxicam',
      category: 'analgesic',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '15 mg',
      frequency: 'Günde bir kez',
      description: 'Selektif COX-2 inhibitörü',
      contraindications: 'Peptik ülser, kalp yetmezliği, böbrek yetmezliği',
      sideEffects: 'Mide irritasyonu, baş ağrısı, cilt döküntüsü',
      interactions: 'Warfarin, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 8,
      name: 'Piroxicam',
      category: 'analgesic',
      dosage: '0.2-0.3 mg/kg',
      maxDaily: '20 mg',
      frequency: 'Günde bir kez',
      description: 'Uzun etkili NSAID',
      contraindications: 'Peptik ülser, kalp yetmezliği, böbrek yetmezliği',
      sideEffects: 'Mide irritasyonu, baş ağrısı, uyku hali',
      interactions: 'Warfarin, lityum ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 9,
      name: 'Indomethacin',
      category: 'analgesic',
      dosage: '1-3 mg/kg',
      maxDaily: '200 mg',
      frequency: '8 saatte bir',
      description: 'Güçlü NSAID, gut tedavisi',
      contraindications: 'Peptik ülser, kalp yetmezliği, böbrek yetmezliği',
      sideEffects: 'Mide irritasyonu, baş ağrısı, baş dönmesi',
      interactions: 'Warfarin, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 10,
      name: 'Celecoxib',
      category: 'analgesic',
      dosage: '2-4 mg/kg',
      maxDaily: '400 mg',
      frequency: '12 saatte bir',
      description: 'Selektif COX-2 inhibitörü',
      contraindications: 'Kalp yetmezliği, böbrek yetmezliği, sülfonamid alerjisi',
      sideEffects: 'Mide irritasyonu, baş ağrısı, cilt döküntüsü',
      interactions: 'Warfarin, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 11,
      name: 'Etoricoxib',
      category: 'analgesic',
      dosage: '1-2 mg/kg',
      maxDaily: '120 mg',
      frequency: 'Günde bir kez',
      description: 'Selektif COX-2 inhibitörü',
      contraindications: 'Kalp yetmezliği, böbrek yetmezliği, sülfonamid alerjisi',
      sideEffects: 'Mide irritasyonu, baş ağrısı, cilt döküntüsü',
      interactions: 'Warfarin, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 12,
      name: 'Nimesulide',
      category: 'analgesic',
      dosage: '2-4 mg/kg',
      maxDaily: '200 mg',
      frequency: '12 saatte bir',
      description: 'Selektif COX-2 inhibitörü',
      contraindications: 'Karaciğer yetmezliği, böbrek yetmezliği',
      sideEffects: 'Karaciğer hasarı, mide irritasyonu, cilt döküntüsü',
      interactions: 'Warfarin, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 13,
      name: 'Tenoxicam',
      category: 'analgesic',
      dosage: '0.2 mg/kg',
      maxDaily: '20 mg',
      frequency: 'Günde bir kez',
      description: 'Uzun etkili NSAID',
      contraindications: 'Peptik ülser, kalp yetmezliği, böbrek yetmezliği',
      sideEffects: 'Mide irritasyonu, baş ağrısı, uyku hali',
      interactions: 'Warfarin, lityum ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 14,
      name: 'Lornoxicam',
      category: 'analgesic',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '16 mg',
      frequency: '12 saatte bir',
      description: 'Güçlü NSAID',
      contraindications: 'Peptik ülser, kalp yetmezliği, böbrek yetmezliği',
      sideEffects: 'Mide irritasyonu, baş ağrısı, cilt döküntüsü',
      interactions: 'Warfarin, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 15,
      name: 'Aceclofenac',
      category: 'analgesic',
      dosage: '1-2 mg/kg',
      maxDaily: '200 mg',
      frequency: '12 saatte bir',
      description: 'NSAID, gut tedavisi',
      contraindications: 'Peptik ülser, kalp yetmezliği, böbrek yetmezliği',
      sideEffects: 'Mide irritasyonu, baş ağrısı, cilt döküntüsü',
      interactions: 'Warfarin, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 16,
      name: 'Flurbiprofen',
      category: 'analgesic',
      dosage: '1-2 mg/kg',
      maxDaily: '300 mg',
      frequency: '8 saatte bir',
      description: 'NSAID, topikal kullanım',
      contraindications: 'Peptik ülser, kalp yetmezliği, böbrek yetmezliği',
      sideEffects: 'Mide irritasyonu, baş ağrısı, cilt döküntüsü',
      interactions: 'Warfarin, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 17,
      name: 'Ketoprofen',
      category: 'analgesic',
      dosage: '1-3 mg/kg',
      maxDaily: '300 mg',
      frequency: '8 saatte bir',
      description: 'NSAID, topikal kullanım',
      contraindications: 'Peptik ülser, kalp yetmezliği, böbrek yetmezliği',
      sideEffects: 'Mide irritasyonu, baş ağrısı, cilt döküntüsü',
      interactions: 'Warfarin, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 18,
      name: 'Mefenamic Acid',
      category: 'analgesic',
      dosage: '5-10 mg/kg',
      maxDaily: '1500 mg',
      frequency: '8 saatte bir',
      description: 'NSAID, menstrüel ağrı',
      contraindications: 'Peptik ülser, kalp yetmezliği, böbrek yetmezliği',
      sideEffects: 'Mide irritasyonu, baş ağrısı, cilt döküntüsü',
      interactions: 'Warfarin, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 19,
      name: 'Tolfenamic Acid',
      category: 'analgesic',
      dosage: '2-4 mg/kg',
      maxDaily: '400 mg',
      frequency: '8 saatte bir',
      description: 'NSAID, migren tedavisi',
      contraindications: 'Peptik ülser, kalp yetmezliği, böbrek yetmezliği',
      sideEffects: 'Mide irritasyonu, baş ağrısı, cilt döküntüsü',
      interactions: 'Warfarin, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 20,
      name: 'Metamizole',
      category: 'analgesic',
      dosage: '10-15 mg/kg',
      maxDaily: '4000 mg',
      frequency: '6-8 saatte bir',
      description: 'Güçlü analjezik ve antipiretik',
      contraindications: 'Agranülositoz öyküsü, karaciğer yetmezliği',
      sideEffects: 'Agranülositoz riski, mide bulantısı, cilt döküntüsü',
      interactions: 'Warfarin ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },

    // Antibiotics (Antibiyotikler)
    {
      id: 21,
      name: 'Amoxicillin',
      category: 'antibiotic',
      dosage: '25-50 mg/kg',
      maxDaily: '3000 mg',
      frequency: '8 saatte bir',
      description: 'Penisilin grubu antibiyotik',
      contraindications: 'Penisilin alerjisi, enfeksiyöz mononükleoz',
      sideEffects: 'İshal, mide bulantısı, cilt döküntüsü',
      interactions: 'Warfarin, metotreksat ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 22,
      name: 'Amoxicillin-Clavulanate',
      category: 'antibiotic',
      dosage: '25-50 mg/kg',
      maxDaily: '3000 mg',
      frequency: '8 saatte bir',
      description: 'Beta-laktamaz inhibitörlü penisilin',
      contraindications: 'Penisilin alerjisi, karaciğer yetmezliği',
      sideEffects: 'İshal, mide bulantısı, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, metotreksat ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 23,
      name: 'Ampicillin',
      category: 'antibiotic',
      dosage: '25-50 mg/kg',
      maxDaily: '4000 mg',
      frequency: '6 saatte bir',
      description: 'Penisilin grubu antibiyotik',
      contraindications: 'Penisilin alerjisi, enfeksiyöz mononükleoz',
      sideEffects: 'İshal, mide bulantısı, cilt döküntüsü',
      interactions: 'Warfarin, metotreksat ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 24,
      name: 'Penicillin G',
      category: 'antibiotic',
      dosage: '25-50 mg/kg',
      maxDaily: '4000 mg',
      frequency: '4-6 saatte bir',
      description: 'Doğal penisilin',
      contraindications: 'Penisilin alerjisi',
      sideEffects: 'İshal, mide bulantısı, cilt döküntüsü',
      interactions: 'Warfarin, metotreksat ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 25,
      name: 'Penicillin V',
      category: 'antibiotic',
      dosage: '25-50 mg/kg',
      maxDaily: '2000 mg',
      frequency: '6 saatte bir',
      description: 'Oral penisilin',
      contraindications: 'Penisilin alerjisi',
      sideEffects: 'İshal, mide bulantısı, cilt döküntüsü',
      interactions: 'Warfarin, metotreksat ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 26,
      name: 'Flucloxacillin',
      category: 'antibiotic',
      dosage: '25-50 mg/kg',
      maxDaily: '2000 mg',
      frequency: '6 saatte bir',
      description: 'Penicillinaz dirençli penisilin',
      contraindications: 'Penisilin alerjisi, karaciğer yetmezliği',
      sideEffects: 'İshal, mide bulantısı, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, metotreksat ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 27,
      name: 'Ceftriaxone',
      category: 'antibiotic',
      dosage: '50-100 mg/kg',
      maxDaily: '4000 mg',
      frequency: '12-24 saatte bir',
      description: '3. nesil sefalosporin',
      contraindications: 'Sefalosporin alerjisi, safra taşı',
      sideEffects: 'İshal, mide bulantısı, cilt döküntüsü',
      interactions: 'Warfarin, probenesid ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 28,
      name: 'Cefazolin',
      category: 'antibiotic',
      dosage: '25-50 mg/kg',
      maxDaily: '6000 mg',
      frequency: '8 saatte bir',
      description: '1. nesil sefalosporin',
      contraindications: 'Sefalosporin alerjisi',
      sideEffects: 'Döküntü, ishal, enjeksiyon yeri reaksiyonu',
      interactions: 'Warfarin, probenesid ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 29,
      name: 'Cefuroxime',
      category: 'antibiotic',
      dosage: '25-50 mg/kg',
      maxDaily: '3000 mg',
      frequency: '8 saatte bir',
      description: '2. nesil sefalosporin',
      contraindications: 'Sefalosporin alerjisi',
      sideEffects: 'Döküntü, ishal, enjeksiyon yeri reaksiyonu',
      interactions: 'Warfarin, probenesid ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 30,
      name: 'Cefotaxime',
      category: 'antibiotic',
      dosage: '50-100 mg/kg',
      maxDaily: '12000 mg',
      frequency: '6-8 saatte bir',
      description: '3. nesil sefalosporin',
      contraindications: 'Sefalosporin alerjisi',
      sideEffects: 'Döküntü, ishal, enjeksiyon yeri reaksiyonu',
      interactions: 'Warfarin, probenesid ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 31,
      name: 'Ceftazidime',
      category: 'antibiotic',
      dosage: '50-100 mg/kg',
      maxDaily: '6000 mg',
      frequency: '8 saatte bir',
      description: '3. nesil sefalosporin, pseudomonas',
      contraindications: 'Sefalosporin alerjisi',
      sideEffects: 'Döküntü, ishal, enjeksiyon yeri reaksiyonu',
      interactions: 'Warfarin, probenesid ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 32,
      name: 'Cefepime',
      category: 'antibiotic',
      dosage: '50-100 mg/kg',
      maxDaily: '4000 mg',
      frequency: '12 saatte bir',
      description: '4. nesil sefalosporin',
      contraindications: 'Sefalosporin alerjisi',
      sideEffects: 'Döküntü, ishal, enjeksiyon yeri reaksiyonu',
      interactions: 'Warfarin, probenesid ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 33,
      name: 'Cefixime',
      category: 'antibiotic',
      dosage: '8-12 mg/kg',
      maxDaily: '400 mg',
      frequency: '12-24 saatte bir',
      description: '3. nesil oral sefalosporin',
      contraindications: 'Sefalosporin alerjisi',
      sideEffects: 'Döküntü, ishal, mide bulantısı',
      interactions: 'Warfarin, probenesid ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 34,
      name: 'Cefpodoxime',
      category: 'antibiotic',
      dosage: '10 mg/kg',
      maxDaily: '400 mg',
      frequency: '12 saatte bir',
      description: '3. nesil oral sefalosporin',
      contraindications: 'Sefalosporin alerjisi',
      sideEffects: 'Döküntü, ishal, mide bulantısı',
      interactions: 'Warfarin, probenesid ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 35,
      name: 'Vancomycin',
      category: 'antibiotic',
      dosage: '15-20 mg/kg',
      maxDaily: '4000 mg',
      frequency: '8-12 saatte bir',
      description: 'Glikopeptid antibiyotik',
      contraindications: 'Vancomycin alerjisi, böbrek yetmezliği',
      sideEffects: 'Nefrotoksisite, ototoksisite, kırmızı adam sendromu',
      interactions: 'Aminoglikozidler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 36,
      name: 'Teicoplanin',
      category: 'antibiotic',
      dosage: '6-12 mg/kg',
      maxDaily: '800 mg',
      frequency: '24 saatte bir',
      description: 'Glikopeptid antibiyotik',
      contraindications: 'Teicoplanin alerjisi, böbrek yetmezliği',
      sideEffects: 'Nefrotoksisite, ototoksisite, enjeksiyon yeri reaksiyonu',
      interactions: 'Aminoglikozidler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 37,
      name: 'Gentamicin',
      category: 'antibiotic',
      dosage: '3-5 mg/kg',
      maxDaily: '480 mg',
      frequency: '8 saatte bir',
      description: 'Aminoglikozid antibiyotik',
      contraindications: 'Aminoglikozid alerjisi, miyastenia gravis',
      sideEffects: 'Nefrotoksisite, ototoksisite, nöromusküler blokaj',
      interactions: 'Vancomycin, diüretikler ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 38,
      name: 'Amikacin',
      category: 'antibiotic',
      dosage: '15-20 mg/kg',
      maxDaily: '1500 mg',
      frequency: '8-12 saatte bir',
      description: 'Aminoglikozid antibiyotik',
      contraindications: 'Aminoglikozid alerjisi, miyastenia gravis',
      sideEffects: 'Nefrotoksisite, ototoksisite, nöromusküler blokaj',
      interactions: 'Vancomycin, diüretikler ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 39,
      name: 'Tobramycin',
      category: 'antibiotic',
      dosage: '3-5 mg/kg',
      maxDaily: '300 mg',
      frequency: '8 saatte bir',
      description: 'Aminoglikozid antibiyotik',
      contraindications: 'Aminoglikozid alerjisi, miyastenia gravis',
      sideEffects: 'Nefrotoksisite, ototoksisite, nöromusküler blokaj',
      interactions: 'Vancomycin, diüretikler ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 40,
      name: 'Streptomycin',
      category: 'antibiotic',
      dosage: '15-20 mg/kg',
      maxDaily: '1000 mg',
      frequency: '12-24 saatte bir',
      description: 'Aminoglikozid antibiyotik',
      contraindications: 'Aminoglikozid alerjisi, miyastenia gravis',
      sideEffects: 'Nefrotoksisite, ototoksisite, nöromusküler blokaj',
      interactions: 'Vancomycin, diüretikler ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 41,
      name: 'Ciprofloxacin',
      category: 'antibiotic',
      dosage: '10-15 mg/kg',
      maxDaily: '1500 mg',
      frequency: '12 saatte bir',
      description: 'Florokinolon antibiyotik',
      contraindications: 'Florokinolon alerjisi, tendon rüptürü riski',
      sideEffects: 'Tendinopati, QT uzaması, fotosensitivite, bulantı',
      interactions: 'Warfarin, teofilin, antasitler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 42,
      name: 'Levofloxacin',
      category: 'antibiotic',
      dosage: '10 mg/kg',
      maxDaily: '750 mg',
      frequency: 'Günde bir kez',
      description: 'Florokinolon antibiyotik',
      contraindications: 'Florokinolon alerjisi, tendon rüptürü riski',
      sideEffects: 'Tendinopati, QT uzaması, fotosensitivite, bulantı',
      interactions: 'Warfarin, teofilin, antasitler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 43,
      name: 'Moxifloxacin',
      category: 'antibiotic',
      dosage: '7.5 mg/kg',
      maxDaily: '400 mg',
      frequency: 'Günde bir kez',
      description: 'Florokinolon antibiyotik',
      contraindications: 'Florokinolon alerjisi, tendon rüptürü riski',
      sideEffects: 'Tendinopati, QT uzaması, fotosensitivite, bulantı',
      interactions: 'Warfarin, teofilin, antasitler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 44,
      name: 'Ofloxacin',
      category: 'antibiotic',
      dosage: '10-15 mg/kg',
      maxDaily: '800 mg',
      frequency: '12 saatte bir',
      description: 'Florokinolon antibiyotik',
      contraindications: 'Florokinolon alerjisi, tendon rüptürü riski',
      sideEffects: 'Tendinopati, QT uzaması, fotosensitivite, bulantı',
      interactions: 'Warfarin, teofilin, antasitler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 45,
      name: 'Azithromycin',
      category: 'antibiotic',
      dosage: '10 mg/kg',
      maxDaily: '500 mg',
      frequency: 'Günde bir kez',
      description: 'Makrolid antibiyotik',
      contraindications: 'Makrolid alerjisi, karaciğer yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, QT uzaması, hepatotoksisite',
      interactions: 'Warfarin, digoksin, teofilin ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 46,
      name: 'Clarithromycin',
      category: 'antibiotic',
      dosage: '7.5-15 mg/kg',
      maxDaily: '1000 mg',
      frequency: '12 saatte bir',
      description: 'Makrolid antibiyotik',
      contraindications: 'Makrolid alerjisi, karaciğer yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, QT uzaması, hepatotoksisite',
      interactions: 'Warfarin, digoksin, teofilin ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 47,
      name: 'Erythromycin',
      category: 'antibiotic',
      dosage: '20-40 mg/kg',
      maxDaily: '2000 mg',
      frequency: '6 saatte bir',
      description: 'Makrolid antibiyotik',
      contraindications: 'Makrolid alerjisi, karaciğer yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, QT uzaması, hepatotoksisite',
      interactions: 'Warfarin, digoksin, teofilin ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 48,
      name: 'Clindamycin',
      category: 'antibiotic',
      dosage: '10-25 mg/kg',
      maxDaily: '2700 mg',
      frequency: '6-8 saatte bir',
      description: 'Lincosamid antibiyotik',
      contraindications: 'Lincosamid alerjisi, miyastenia gravis',
      sideEffects: 'Pseudomembranöz kolit, gastrointestinal yan etkiler',
      interactions: 'Nöromusküler blokerler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 49,
      name: 'Lincomycin',
      category: 'antibiotic',
      dosage: '15-30 mg/kg',
      maxDaily: '2000 mg',
      frequency: '6-8 saatte bir',
      description: 'Lincosamid antibiyotik',
      contraindications: 'Lincosamid alerjisi, miyastenia gravis',
      sideEffects: 'Pseudomembranöz kolit, gastrointestinal yan etkiler',
      interactions: 'Nöromusküler blokerler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 50,
      name: 'Doxycycline',
      category: 'antibiotic',
      dosage: '2-4 mg/kg',
      maxDaily: '200 mg',
      frequency: '12 saatte bir',
      description: 'Tetrasiklin antibiyotik',
      contraindications: 'Tetrasiklin alerjisi, hamilelik, 8 yaş altı çocuklar',
      sideEffects: 'Fotosensitivite, gastrointestinal yan etkiler, diş renklenmesi',
      interactions: 'Antasitler, demir, kalsiyum ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 51,
      name: 'Tetracycline',
      category: 'antibiotic',
      dosage: '25-50 mg/kg',
      maxDaily: '2000 mg',
      frequency: '6 saatte bir',
      description: 'Tetrasiklin antibiyotik',
      contraindications: 'Tetrasiklin alerjisi, hamilelik, 8 yaş altı çocuklar',
      sideEffects: 'Fotosensitivite, gastrointestinal yan etkiler, diş renklenmesi',
      interactions: 'Antasitler, demir, kalsiyum ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 52,
      name: 'Minocycline',
      category: 'antibiotic',
      dosage: '2-4 mg/kg',
      maxDaily: '200 mg',
      frequency: '12 saatte bir',
      description: 'Tetrasiklin antibiyotik',
      contraindications: 'Tetrasiklin alerjisi, hamilelik, 8 yaş altı çocuklar',
      sideEffects: 'Fotosensitivite, gastrointestinal yan etkiler, diş renklenmesi',
      interactions: 'Antasitler, demir, kalsiyum ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 53,
      name: 'Chloramphenicol',
      category: 'antibiotic',
      dosage: '25-50 mg/kg',
      maxDaily: '4000 mg',
      frequency: '6 saatte bir',
      description: 'Amphenicol antibiyotik',
      contraindications: 'Chloramphenicol alerjisi, kemik iliği depresyonu',
      sideEffects: 'Aplastik anemi, gri bebek sendromu, kemik iliği depresyonu',
      interactions: 'Warfarin, fenitoin ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 54,
      name: 'Sulfamethoxazole-Trimethoprim',
      category: 'antibiotic',
      dosage: '20-30 mg/kg',
      maxDaily: '1600 mg',
      frequency: '12 saatte bir',
      description: 'Sulfonamid kombinasyonu',
      contraindications: 'Sulfonamid alerjisi, G6PD eksikliği, hamilelik',
      sideEffects: 'Stevens-Johnson sendromu, fotosensitivite, gastrointestinal yan etkiler',
      interactions: 'Warfarin, metotreksat ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 55,
      name: 'Metronidazole',
      category: 'antibiotic',
      dosage: '7.5-15 mg/kg',
      maxDaily: '2000 mg',
      frequency: '8 saatte bir',
      description: 'Nitroimidazol antibiyotik',
      contraindications: 'Metronidazole alerjisi, hamilelik (1. trimester)',
      sideEffects: 'Metalik tat, bulantı, kusma, nöropati',
      interactions: 'Alkol, warfarin ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 56,
      name: 'Tinidazole',
      category: 'antibiotic',
      dosage: '50 mg/kg',
      maxDaily: '2000 mg',
      frequency: 'Günde bir kez',
      description: 'Nitroimidazol antibiyotik',
      contraindications: 'Tinidazole alerjisi, hamilelik (1. trimester)',
      sideEffects: 'Metalik tat, bulantı, kusma, nöropati',
      interactions: 'Alkol, warfarin ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 57,
      name: 'Nitrofurantoin',
      category: 'antibiotic',
      dosage: '5-7 mg/kg',
      maxDaily: '400 mg',
      frequency: '6 saatte bir',
      description: 'Nitrofuran antibiyotik',
      contraindications: 'Nitrofurantoin alerjisi, G6PD eksikliği, böbrek yetmezliği',
      sideEffects: 'Pulmoner fibrozis, hepatotoksisite, periferik nöropati',
      interactions: 'Antasitler, probenesid ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 58,
      name: 'Fosfomycin',
      category: 'antibiotic',
      dosage: '50-100 mg/kg',
      maxDaily: '8000 mg',
      frequency: '8 saatte bir',
      description: 'Fosfonik asit antibiyotik',
      contraindications: 'Fosfomycin alerjisi',
      sideEffects: 'Gastrointestinal yan etkiler, baş ağrısı, döküntü',
      interactions: 'Metoklopramid ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 59,
      name: 'Colistin',
      category: 'antibiotic',
      dosage: '2.5-5 mg/kg',
      maxDaily: '300 mg',
      frequency: '8 saatte bir',
      description: 'Polimiksin antibiyotik',
      contraindications: 'Colistin alerjisi, miyastenia gravis',
      sideEffects: 'Nefrotoksisite, nörotoksisite, nöromusküler blokaj',
      interactions: 'Aminoglikozidler, nöromusküler blokerler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 60,
      name: 'Polymyxin B',
      category: 'antibiotic',
      dosage: '1.5-2.5 mg/kg',
      maxDaily: '200 mg',
      frequency: '8 saatte bir',
      description: 'Polimiksin antibiyotik',
      contraindications: 'Polymyxin B alerjisi, miyastenia gravis',
      sideEffects: 'Nefrotoksisite, nörotoksisite, nöromusküler blokaj',
      interactions: 'Aminoglikozidler, nöromusküler blokerler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },

    // Opioids (Opioid Analjezikler)
    {
      id: 61,
      name: 'Morphine',
      category: 'opioid',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '200 mg',
      frequency: '4-6 saatte bir',
      description: 'Güçlü opioid analjezik',
      contraindications: 'Solunum yetmezliği, bağımlılık öyküsü, böbrek yetmezliği',
      sideEffects: 'Solunum depresyonu, bulantı, kabızlık, bağımlılık',
      interactions: 'Benzodiazepinler, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 62,
      name: 'Fentanyl',
      category: 'opioid',
      dosage: '1-2 mcg/kg',
      maxDaily: '300 mcg',
      frequency: '2-4 saatte bir',
      description: 'Çok güçlü opioid analjezik',
      contraindications: 'Solunum yetmezliği, bağımlılık öyküsü, böbrek yetmezliği',
      sideEffects: 'Solunum depresyonu, bulantı, kabızlık, bağımlılık',
      interactions: 'Benzodiazepinler, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 63,
      name: 'Tramadol',
      category: 'opioid',
      dosage: '1-2 mg/kg',
      maxDaily: '400 mg',
      frequency: '6-8 saatte bir',
      description: 'Zayıf opioid analjezik',
      contraindications: 'Epilepsi, böbrek yetmezliği, karaciğer yetmezliği',
      sideEffects: 'Bulantı, baş dönmesi, nöbet riski, bağımlılık',
      interactions: 'SSRI, MAO inhibitörleri ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 64,
      name: 'Codeine',
      category: 'opioid',
      dosage: '0.5-1 mg/kg',
      maxDaily: '240 mg',
      frequency: '4-6 saatte bir',
      description: 'Zayıf opioid, öksürük kesici',
      contraindications: 'Solunum yetmezliği, bağımlılık öyküsü, böbrek yetmezliği',
      sideEffects: 'Sedasyon, bulantı, kabızlık, bağımlılık',
      interactions: 'Benzodiazepinler, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 65,
      name: 'Oxycodone',
      category: 'opioid',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '80 mg',
      frequency: '4-6 saatte bir',
      description: 'Güçlü opioid analjezik',
      contraindications: 'Solunum yetmezliği, bağımlılık öyküsü, böbrek yetmezliği',
      sideEffects: 'Solunum depresyonu, bulantı, kabızlık, bağımlılık',
      interactions: 'Benzodiazepinler, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 66,
      name: 'Hydromorphone',
      category: 'opioid',
      dosage: '0.02-0.05 mg/kg',
      maxDaily: '32 mg',
      frequency: '4-6 saatte bir',
      description: 'Güçlü opioid analjezik',
      contraindications: 'Solunum yetmezliği, bağımlılık öyküsü, böbrek yetmezliği',
      sideEffects: 'Solunum depresyonu, bulantı, kabızlık, bağımlılık',
      interactions: 'Benzodiazepinler, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 67,
      name: 'Methadone',
      category: 'opioid',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '120 mg',
      frequency: '8-12 saatte bir',
      description: 'Uzun etkili opioid analjezik',
      contraindications: 'Solunum yetmezliği, bağımlılık öyküsü, böbrek yetmezliği',
      sideEffects: 'Solunum depresyonu, QT uzaması, kabızlık, bağımlılık',
      interactions: 'Benzodiazepinler, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 68,
      name: 'Buprenorphine',
      category: 'opioid',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '2.4 mg',
      frequency: '6-8 saatte bir',
      description: 'Kısmi opioid agonist',
      contraindications: 'Solunum yetmezliği, bağımlılık öyküsü, böbrek yetmezliği',
      sideEffects: 'Solunum depresyonu, bulantı, kabızlık, bağımlılık',
      interactions: 'Benzodiazepinler, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 69,
      name: 'Nalbuphine',
      category: 'opioid',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '160 mg',
      frequency: '4-6 saatte bir',
      description: 'Kısmi opioid agonist-antagonist',
      contraindications: 'Solunum yetmezliği, bağımlılık öyküsü, böbrek yetmezliği',
      sideEffects: 'Sedasyon, bulantı, kabızlık, bağımlılık',
      interactions: 'Benzodiazepinler, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 70,
      name: 'Butorphanol',
      category: 'opioid',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '4 mg',
      frequency: '4-6 saatte bir',
      description: 'Kısmi opioid agonist-antagonist',
      contraindications: 'Solunum yetmezliği, bağımlılık öyküsü, böbrek yetmezliği',
      sideEffects: 'Sedasyon, bulantı, kabızlık, bağımlılık',
      interactions: 'Benzodiazepinler, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 71,
      name: 'Pentazocine',
      category: 'opioid',
      dosage: '0.5-1 mg/kg',
      maxDaily: '360 mg',
      frequency: '4-6 saatte bir',
      description: 'Kısmi opioid agonist-antagonist',
      contraindications: 'Solunum yetmezliği, bağımlılık öyküsü, böbrek yetmezliği',
      sideEffects: 'Sedasyon, bulantı, kabızlık, bağımlılık',
      interactions: 'Benzodiazepinler, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 72,
      name: 'Meperidine',
      category: 'opioid',
      dosage: '1-2 mg/kg',
      maxDaily: '600 mg',
      frequency: '4-6 saatte bir',
      description: 'Sentetik opioid analjezik',
      contraindications: 'Solunum yetmezliği, bağımlılık öyküsü, böbrek yetmezliği',
      sideEffects: 'Solunum depresyonu, bulantı, kabızlık, bağımlılık',
      interactions: 'Benzodiazepinler, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 73,
      name: 'Dextropropoxyphene',
      category: 'opioid',
      dosage: '2-4 mg/kg',
      maxDaily: '600 mg',
      frequency: '4-6 saatte bir',
      description: 'Zayıf opioid analjezik',
      contraindications: 'Solunum yetmezliği, bağımlılık öyküsü, böbrek yetmezliği',
      sideEffects: 'Sedasyon, bulantı, kabızlık, bağımlılık',
      interactions: 'Benzodiazepinler, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 74,
      name: 'Tapentadol',
      category: 'opioid',
      dosage: '1-2 mg/kg',
      maxDaily: '600 mg',
      frequency: '4-6 saatte bir',
      description: 'Dual mekanizmalı opioid',
      contraindications: 'Solunum yetmezliği, bağımlılık öyküsü, böbrek yetmezliği',
      sideEffects: 'Solunum depresyonu, bulantı, kabızlık, bağımlılık',
      interactions: 'Benzodiazepinler, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 75,
      name: 'Naloxone',
      category: 'opioid',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '10 mg',
      frequency: 'Gerektiğinde',
      description: 'Opioid antagonist',
      contraindications: 'Naloxone alerjisi',
      sideEffects: 'Opioid yoksunluk sendromu, hipertansiyon, taşikardi',
      interactions: 'Opioidler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 76,
      name: 'Naltrexone',
      category: 'opioid',
      dosage: '0.5-1 mg/kg',
      maxDaily: '50 mg',
      frequency: 'Günde bir kez',
      description: 'Uzun etkili opioid antagonist',
      contraindications: 'Naltrexone alerjisi, akut hepatit',
      sideEffects: 'Hepatotoksisite, bulantı, baş ağrısı, uykusuzluk',
      interactions: 'Opioidler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },

    // Cardiovascular (Kardiyovasküler İlaçlar)
    {
      id: 77,
      name: 'Digoxin',
      category: 'cardiac',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '0.5 mg',
      frequency: 'Günde bir kez',
      description: 'Kardiyak glikozid',
      contraindications: 'AV blok, bradikardi, hipokalemi, böbrek yetmezliği',
      sideEffects: 'Bulantı, kusma, görme bozukluğu, aritmi',
      interactions: 'Diüretikler, amiodaron ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 78,
      name: 'Amlodipine',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '10 mg',
      frequency: 'Günde bir kez',
      description: 'Kalsiyum kanal blokeri',
      contraindications: 'Kalp yetmezliği, şiddetli hipotansiyon, karaciğer yetmezliği',
      sideEffects: 'Periferik ödem, baş ağrısı, yorgunluk, flushing',
      interactions: 'Grapefruit suyu, CYP3A4 inhibitörleri ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 79,
      name: 'Lisinopril',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '40 mg',
      frequency: 'Günde bir kez',
      description: 'ACE inhibitörü',
      contraindications: 'Hamilelik, bilateral renal arter stenozu, anjiyoödem öyküsü',
      sideEffects: 'Kuru öksürük, hiperkalemi, baş dönmesi',
      interactions: 'Potasyum takviyeleri, NSAID\'ler ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 80,
      name: 'Metoprolol',
      category: 'cardiac',
      dosage: '0.5-1 mg/kg',
      maxDaily: '200 mg',
      frequency: '12 saatte bir',
      description: 'Beta bloker',
      contraindications: 'Astım, AV blok, kalp yetmezliği, bradikardi',
      sideEffects: 'Yorgunluk, baş dönmesi, bradikardi, impotans',
      interactions: 'Digoksin, kalsiyum kanal blokerleri ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 81,
      name: 'Atorvastatin',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '80 mg',
      frequency: 'Günde bir kez',
      description: 'Statin, kolesterol düşürücü',
      contraindications: 'Aktif karaciğer hastalığı, hamilelik, emzirme',
      sideEffects: 'Kas ağrısı, karaciğer enzim yüksekliği, mide bulantısı',
      interactions: 'Warfarin, fibratlar ile etkileşim',
      pregnancyCategory: 'X - Hamilelikte kontrendike',
    },
    {
      id: 82,
      name: 'Warfarin',
      category: 'cardiac',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '10 mg',
      frequency: 'Günde bir kez',
      description: 'Antikoagülan',
      contraindications: 'Aktif kanama, hamilelik, ciddi karaciğer hastalığı',
      sideEffects: 'Kanama riski, cilt nekrozu, osteoporoz',
      interactions: 'Çok sayıda ilaç ile etkileşim, K vitamini',
      pregnancyCategory: 'X - Hamilelikte kontrendike',
    },
    {
      id: 83,
      name: 'Nifedipine',
      category: 'cardiac',
      dosage: '0.2-0.5 mg/kg',
      maxDaily: '120 mg',
      frequency: '8-12 saatte bir',
      description: 'Kalsiyum kanal blokeri',
      contraindications: 'Kalp yetmezliği, şiddetli hipotansiyon, karaciğer yetmezliği',
      sideEffects: 'Periferik ödem, baş ağrısı, yorgunluk, flushing',
      interactions: 'Grapefruit suyu, CYP3A4 inhibitörleri ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 84,
      name: 'Diltiazem',
      category: 'cardiac',
      dosage: '1-2 mg/kg',
      maxDaily: '360 mg',
      frequency: '8-12 saatte bir',
      description: 'Kalsiyum kanal blokeri',
      contraindications: 'Kalp yetmezliği, şiddetli hipotansiyon, karaciğer yetmezliği',
      sideEffects: 'Periferik ödem, baş ağrısı, yorgunluk, flushing',
      interactions: 'Grapefruit suyu, CYP3A4 inhibitörleri ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 85,
      name: 'Verapamil',
      category: 'cardiac',
      dosage: '1-2 mg/kg',
      maxDaily: '480 mg',
      frequency: '8-12 saatte bir',
      description: 'Kalsiyum kanal blokeri',
      contraindications: 'Kalp yetmezliği, şiddetli hipotansiyon, karaciğer yetmezliği',
      sideEffects: 'Periferik ödem, baş ağrısı, yorgunluk, flushing',
      interactions: 'Grapefruit suyu, CYP3A4 inhibitörleri ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 86,
      name: 'Enalapril',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '40 mg',
      frequency: 'Günde bir kez',
      description: 'ACE inhibitörü',
      contraindications: 'Hamilelik, bilateral renal arter stenozu, anjiyoödem öyküsü',
      sideEffects: 'Kuru öksürük, hiperkalemi, baş dönmesi',
      interactions: 'Potasyum takviyeleri, NSAID\'ler ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 87,
      name: 'Captopril',
      category: 'cardiac',
      dosage: '0.5-1 mg/kg',
      maxDaily: '450 mg',
      frequency: '8 saatte bir',
      description: 'ACE inhibitörü',
      contraindications: 'Hamilelik, bilateral renal arter stenozu, anjiyoödem öyküsü',
      sideEffects: 'Kuru öksürük, hiperkalemi, baş dönmesi',
      interactions: 'Potasyum takviyeleri, NSAID\'ler ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 88,
      name: 'Ramipril',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '10 mg',
      frequency: 'Günde bir kez',
      description: 'ACE inhibitörü',
      contraindications: 'Hamilelik, bilateral renal arter stenozu, anjiyoödem öyküsü',
      sideEffects: 'Kuru öksürük, hiperkalemi, baş dönmesi',
      interactions: 'Potasyum takviyeleri, NSAID\'ler ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 89,
      name: 'Losartan',
      category: 'cardiac',
      dosage: '0.5-1 mg/kg',
      maxDaily: '100 mg',
      frequency: 'Günde bir kez',
      description: 'ARB, anjiyotensin reseptör blokeri',
      contraindications: 'Hamilelik, bilateral renal arter stenozu, anjiyoödem öyküsü',
      sideEffects: 'Hiperkalemi, baş dönmesi, yorgunluk',
      interactions: 'Potasyum takviyeleri, NSAID\'ler ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 90,
      name: 'Valsartan',
      category: 'cardiac',
      dosage: '1-2 mg/kg',
      maxDaily: '320 mg',
      frequency: 'Günde bir kez',
      description: 'ARB, anjiyotensin reseptör blokeri',
      contraindications: 'Hamilelik, bilateral renal arter stenozu, anjiyoödem öyküsü',
      sideEffects: 'Hiperkalemi, baş dönmesi, yorgunluk',
      interactions: 'Potasyum takviyeleri, NSAID\'ler ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 91,
      name: 'Candesartan',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '32 mg',
      frequency: 'Günde bir kez',
      description: 'ARB, anjiyotensin reseptör blokeri',
      contraindications: 'Hamilelik, bilateral renal arter stenozu, anjiyoödem öyküsü',
      sideEffects: 'Hiperkalemi, baş dönmesi, yorgunluk',
      interactions: 'Potasyum takviyeleri, NSAID\'ler ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 92,
      name: 'Propranolol',
      category: 'cardiac',
      dosage: '0.5-1 mg/kg',
      maxDaily: '320 mg',
      frequency: '8-12 saatte bir',
      description: 'Beta bloker',
      contraindications: 'Astım, AV blok, kalp yetmezliği, bradikardi',
      sideEffects: 'Yorgunluk, baş dönmesi, bradikardi, impotans',
      interactions: 'Digoksin, kalsiyum kanal blokerleri ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 93,
      name: 'Atenolol',
      category: 'cardiac',
      dosage: '0.5-1 mg/kg',
      maxDaily: '100 mg',
      frequency: 'Günde bir kez',
      description: 'Beta bloker',
      contraindications: 'Astım, AV blok, kalp yetmezliği, bradikardi',
      sideEffects: 'Yorgunluk, baş dönmesi, bradikardi, impotans',
      interactions: 'Digoksin, kalsiyum kanal blokerleri ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 94,
      name: 'Bisoprolol',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '10 mg',
      frequency: 'Günde bir kez',
      description: 'Beta bloker',
      contraindications: 'Astım, AV blok, kalp yetmezliği, bradikardi',
      sideEffects: 'Yorgunluk, baş dönmesi, bradikardi, impotans',
      interactions: 'Digoksin, kalsiyum kanal blokerleri ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 95,
      name: 'Carvedilol',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '50 mg',
      frequency: '12 saatte bir',
      description: 'Alfa-beta bloker',
      contraindications: 'Astım, AV blok, kalp yetmezliği, bradikardi',
      sideEffects: 'Yorgunluk, baş dönmesi, bradikardi, impotans',
      interactions: 'Digoksin, kalsiyum kanal blokerleri ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 96,
      name: 'Labetalol',
      category: 'cardiac',
      dosage: '1-2 mg/kg',
      maxDaily: '2400 mg',
      frequency: '8 saatte bir',
      description: 'Alfa-beta bloker',
      contraindications: 'Astım, AV blok, kalp yetmezliği, bradikardi',
      sideEffects: 'Yorgunluk, baş dönmesi, bradikardi, impotans',
      interactions: 'Digoksin, kalsiyum kanal blokerleri ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 97,
      name: 'Simvastatin',
      category: 'cardiac',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '80 mg',
      frequency: 'Günde bir kez',
      description: 'Statin, kolesterol düşürücü',
      contraindications: 'Aktif karaciğer hastalığı, hamilelik, emzirme',
      sideEffects: 'Kas ağrısı, karaciğer enzim yüksekliği, mide bulantısı',
      interactions: 'Warfarin, fibratlar ile etkileşim',
      pregnancyCategory: 'X - Hamilelikte kontrendike',
    },
    {
      id: 98,
      name: 'Pravastatin',
      category: 'cardiac',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '80 mg',
      frequency: 'Günde bir kez',
      description: 'Statin, kolesterol düşürücü',
      contraindications: 'Aktif karaciğer hastalığı, hamilelik, emzirme',
      sideEffects: 'Kas ağrısı, karaciğer enzim yüksekliği, mide bulantısı',
      interactions: 'Warfarin, fibratlar ile etkileşim',
      pregnancyCategory: 'X - Hamilelikte kontrendike',
    },
    {
      id: 99,
      name: 'Rosuvastatin',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '40 mg',
      frequency: 'Günde bir kez',
      description: 'Statin, kolesterol düşürücü',
      contraindications: 'Aktif karaciğer hastalığı, hamilelik, emzirme',
      sideEffects: 'Kas ağrısı, karaciğer enzim yüksekliği, mide bulantısı',
      interactions: 'Warfarin, fibratlar ile etkileşim',
      pregnancyCategory: 'X - Hamilelikte kontrendike',
    },
    {
      id: 100,
      name: 'Fluvastatin',
      category: 'cardiac',
      dosage: '0.4-0.8 mg/kg',
      maxDaily: '80 mg',
      frequency: 'Günde bir kez',
      description: 'Statin, kolesterol düşürücü',
      contraindications: 'Aktif karaciğer hastalığı, hamilelik, emzirme',
      sideEffects: 'Kas ağrısı, karaciğer enzim yüksekliği, mide bulantısı',
      interactions: 'Warfarin, fibratlar ile etkileşim',
      pregnancyCategory: 'X - Hamilelikte kontrendike',
    },
    {
      id: 101,
      name: 'Heparin',
      category: 'cardiac',
      dosage: '50-100 U/kg',
      maxDaily: '40000 U',
      frequency: 'Gerektiğinde',
      description: 'Antikoagülan',
      contraindications: 'Aktif kanama, hamilelik, ciddi karaciğer hastalığı',
      sideEffects: 'Kanama riski, heparin kaynaklı trombositopeni',
      interactions: 'Çok sayıda ilaç ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 102,
      name: 'Enoxaparin',
      category: 'cardiac',
      dosage: '1-1.5 mg/kg',
      maxDaily: '200 mg',
      frequency: '12 saatte bir',
      description: 'Düşük molekül ağırlıklı heparin',
      contraindications: 'Aktif kanama, hamilelik, ciddi karaciğer hastalığı',
      sideEffects: 'Kanama riski, heparin kaynaklı trombositopeni',
      interactions: 'Çok sayıda ilaç ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 103,
      name: 'Dabigatran',
      category: 'cardiac',
      dosage: '2-3 mg/kg',
      maxDaily: '300 mg',
      frequency: '12 saatte bir',
      description: 'Direkt trombin inhibitörü',
      contraindications: 'Aktif kanama, hamilelik, ciddi karaciğer hastalığı',
      sideEffects: 'Kanama riski, gastrointestinal yan etkiler',
      interactions: 'Çok sayıda ilaç ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 104,
      name: 'Rivaroxaban',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      frequency: 'Günde bir kez',
      description: 'Faktör Xa inhibitörü',
      contraindications: 'Aktif kanama, hamilelik, ciddi karaciğer hastalığı',
      sideEffects: 'Kanama riski, gastrointestinal yan etkiler',
      interactions: 'Çok sayıda ilaç ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 105,
      name: 'Apixaban',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '10 mg',
      frequency: '12 saatte bir',
      description: 'Faktör Xa inhibitörü',
      contraindications: 'Aktif kanama, hamilelik, ciddi karaciğer hastalığı',
      sideEffects: 'Kanama riski, gastrointestinal yan etkiler',
      interactions: 'Çok sayıda ilaç ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 106,
      name: 'Clopidogrel',
      category: 'cardiac',
      dosage: '1-2 mg/kg',
      maxDaily: '75 mg',
      frequency: 'Günde bir kez',
      description: 'Antitrombosit ajan',
      contraindications: 'Aktif kanama, hamilelik, ciddi karaciğer hastalığı',
      sideEffects: 'Kanama riski, gastrointestinal yan etkiler',
      interactions: 'Çok sayıda ilaç ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 107,
      name: 'Aspirin',
      category: 'cardiac',
      dosage: '1-5 mg/kg',
      maxDaily: '325 mg',
      frequency: 'Günde bir kez',
      description: 'Antitrombosit ajan',
      contraindications: 'Aktif kanama, hamilelik, ciddi karaciğer hastalığı',
      sideEffects: 'Kanama riski, gastrointestinal yan etkiler',
      interactions: 'Çok sayıda ilaç ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 108,
      name: 'Ticagrelor',
      category: 'cardiac',
      dosage: '1-2 mg/kg',
      maxDaily: '180 mg',
      frequency: '12 saatte bir',
      description: 'Antitrombosit ajan',
      contraindications: 'Aktif kanama, hamilelik, ciddi karaciğer hastalığı',
      sideEffects: 'Kanama riski, gastrointestinal yan etkiler',
      interactions: 'Çok sayıda ilaç ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 109,
      name: 'Prasugrel',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '10 mg',
      frequency: 'Günde bir kez',
      description: 'Antitrombosit ajan',
      contraindications: 'Aktif kanama, hamilelik, ciddi karaciğer hastalığı',
      sideEffects: 'Kanama riski, gastrointestinal yan etkiler',
      interactions: 'Çok sayıda ilaç ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 110,
      name: 'Nitroglycerin',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '6 mg',
      frequency: 'Gerektiğinde',
      description: 'Vazodilatör, anjina tedavisi',
      contraindications: 'Şiddetli hipotansiyon, kafa içi basınç artışı',
      sideEffects: 'Baş ağrısı, hipotansiyon, flushing, taşikardi',
      interactions: 'Sildenafil, vardenafil ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 111,
      name: 'Isosorbide Dinitrate',
      category: 'cardiac',
      dosage: '0.2-0.5 mg/kg',
      maxDaily: '120 mg',
      frequency: '8 saatte bir',
      description: 'Vazodilatör, anjina tedavisi',
      contraindications: 'Şiddetli hipotansiyon, kafa içi basınç artışı',
      sideEffects: 'Baş ağrısı, hipotansiyon, flushing, taşikardi',
      interactions: 'Sildenafil, vardenafil ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 112,
      name: 'Isosorbide Mononitrate',
      category: 'cardiac',
      dosage: '0.2-0.5 mg/kg',
      maxDaily: '120 mg',
      frequency: 'Günde bir kez',
      description: 'Vazodilatör, anjina tedavisi',
      contraindications: 'Şiddetli hipotansiyon, kafa içi basınç artışı',
      sideEffects: 'Baş ağrısı, hipotansiyon, flushing, taşikardi',
      interactions: 'Sildenafil, vardenafil ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 113,
      name: 'Hydralazine',
      category: 'cardiac',
      dosage: '0.5-1 mg/kg',
      maxDaily: '300 mg',
      frequency: '8 saatte bir',
      description: 'Vazodilatör, hipertansiyon',
      contraindications: 'Şiddetli hipotansiyon, kafa içi basınç artışı',
      sideEffects: 'Baş ağrısı, hipotansiyon, flushing, taşikardi',
      interactions: 'Sildenafil, vardenafil ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 114,
      name: 'Minoxidil',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '100 mg',
      frequency: '12 saatte bir',
      description: 'Vazodilatör, hipertansiyon',
      contraindications: 'Şiddetli hipotansiyon, kafa içi basınç artışı',
      sideEffects: 'Baş ağrısı, hipotansiyon, flushing, taşikardi',
      interactions: 'Sildenafil, vardenafil ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 115,
      name: 'Doxazosin',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '16 mg',
      frequency: 'Günde bir kez',
      description: 'Alfa bloker',
      contraindications: 'Şiddetli hipotansiyon, kafa içi basınç artışı',
      sideEffects: 'Baş ağrısı, hipotansiyon, flushing, taşikardi',
      interactions: 'Sildenafil, vardenafil ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 116,
      name: 'Prazosin',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      frequency: '8 saatte bir',
      description: 'Alfa bloker',
      contraindications: 'Şiddetli hipotansiyon, kafa içi basınç artışı',
      sideEffects: 'Baş ağrısı, hipotansiyon, flushing, taşikardi',
      interactions: 'Sildenafil, vardenafil ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 117,
      name: 'Terazosin',
      category: 'cardiac',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      frequency: 'Günde bir kez',
      description: 'Alfa bloker',
      contraindications: 'Şiddetli hipotansiyon, kafa içi basınç artışı',
      sideEffects: 'Baş ağrısı, hipotansiyon, flushing, taşikardi',
      interactions: 'Sildenafil, vardenafil ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 118,
      name: 'Furosemide',
      category: 'cardiac',
      dosage: '0.5-2 mg/kg',
      maxDaily: '600 mg',
      frequency: '8-12 saatte bir',
      description: 'Loop diüretik',
      contraindications: 'Şiddetli hipotansiyon, kafa içi basınç artışı',
      sideEffects: 'Baş ağrısı, hipotansiyon, flushing, taşikardi',
      interactions: 'Sildenafil, vardenafil ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 119,
      name: 'Hydrochlorothiazide',
      category: 'cardiac',
      dosage: '1-2 mg/kg',
      maxDaily: '100 mg',
      frequency: 'Günde bir kez',
      description: 'Tiyazid diüretik',
      contraindications: 'Şiddetli hipotansiyon, kafa içi basınç artışı',
      sideEffects: 'Baş ağrısı, hipotansiyon, flushing, taşikardi',
      interactions: 'Sildenafil, vardenafil ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 120,
      name: 'Spironolactone',
      category: 'cardiac',
      dosage: '1-3 mg/kg',
      maxDaily: '400 mg',
      frequency: 'Günde bir kez',
      description: 'Potasyum koruyucu diüretik',
      contraindications: 'Şiddetli hipotansiyon, kafa içi basınç artışı',
      sideEffects: 'Baş ağrısı, hipotansiyon, flushing, taşikardi',
      interactions: 'Sildenafil, vardenafil ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },

    // Diuretics (Diüretikler)
    {
      id: 121,
      name: 'Furosemide',
      category: 'diuretic',
      dosage: '0.5-2 mg/kg',
      maxDaily: '600 mg',
      frequency: 'Günde 1-2 kez',
      description: 'Loop diüretik',
      contraindications: 'Anüri, şiddetli hipokalemi, dehidratasyon',
      sideEffects: 'Hipokalemi, dehidratasyon, ototoksisite, hiperürisemi',
      interactions: 'Digoksin, aminoglikozidler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 122,
      name: 'Hydrochlorothiazide',
      category: 'diuretic',
      dosage: '1-2 mg/kg',
      maxDaily: '100 mg',
      frequency: 'Günde bir kez',
      description: 'Tiyazid diüretik',
      contraindications: 'Anüri, şiddetli hipokalemi, dehidratasyon',
      sideEffects: 'Hipokalemi, hiperglisemi, hiperürisemi, fotosensitivite',
      interactions: 'Digoksin, lityum ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 123,
      name: 'Spironolactone',
      category: 'diuretic',
      dosage: '1-3 mg/kg',
      maxDaily: '400 mg',
      frequency: 'Günde 1-2 kez',
      description: 'Potasyum koruyucu diüretik',
      contraindications: 'Hiperkalemi, böbrek yetmezliği, hamilelik',
      sideEffects: 'Hiperkalemi, jinekomasti, menstrüel düzensizlik',
      interactions: 'ACE inhibitörleri, potasyum takviyeleri ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 124,
      name: 'Bumetanide',
      category: 'diuretic',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '10 mg',
      frequency: 'Günde 1-2 kez',
      description: 'Loop diüretik',
      contraindications: 'Anüri, şiddetli hipokalemi, dehidratasyon',
      sideEffects: 'Hipokalemi, dehidratasyon, ototoksisite, hiperürisemi',
      interactions: 'Digoksin, aminoglikozidler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 125,
      name: 'Torsemide',
      category: 'diuretic',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '200 mg',
      frequency: 'Günde bir kez',
      description: 'Loop diüretik',
      contraindications: 'Anüri, şiddetli hipokalemi, dehidratasyon',
      sideEffects: 'Hipokalemi, dehidratasyon, ototoksisite, hiperürisemi',
      interactions: 'Digoksin, aminoglikozidler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 126,
      name: 'Chlorthalidone',
      category: 'diuretic',
      dosage: '0.5-1 mg/kg',
      maxDaily: '100 mg',
      frequency: 'Günde bir kez',
      description: 'Tiyazid benzeri diüretik',
      contraindications: 'Anüri, şiddetli hipokalemi, dehidratasyon',
      sideEffects: 'Hipokalemi, hiperglisemi, hiperürisemi, fotosensitivite',
      interactions: 'Digoksin, lityum ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 127,
      name: 'Indapamide',
      category: 'diuretic',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '5 mg',
      frequency: 'Günde bir kez',
      description: 'Tiyazid benzeri diüretik',
      contraindications: 'Anüri, şiddetli hipokalemi, dehidratasyon',
      sideEffects: 'Hipokalemi, hiperglisemi, hiperürisemi, fotosensitivite',
      interactions: 'Digoksin, lityum ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 128,
      name: 'Amiloride',
      category: 'diuretic',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      frequency: 'Günde bir kez',
      description: 'Potasyum koruyucu diüretik',
      contraindications: 'Hiperkalemi, böbrek yetmezliği, hamilelik',
      sideEffects: 'Hiperkalemi, jinekomasti, menstrüel düzensizlik',
      interactions: 'ACE inhibitörleri, potasyum takviyeleri ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 129,
      name: 'Triamterene',
      category: 'diuretic',
      dosage: '1-2 mg/kg',
      maxDaily: '300 mg',
      frequency: 'Günde bir kez',
      description: 'Potasyum koruyucu diüretik',
      contraindications: 'Hiperkalemi, böbrek yetmezliği, hamilelik',
      sideEffects: 'Hiperkalemi, jinekomasti, menstrüel düzensizlik',
      interactions: 'ACE inhibitörleri, potasyum takviyeleri ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 130,
      name: 'Acetazolamide',
      category: 'diuretic',
      dosage: '5-10 mg/kg',
      maxDaily: '1000 mg',
      frequency: '8 saatte bir',
      description: 'Karbonik anhidraz inhibitörü',
      contraindications: 'Anüri, şiddetli hipokalemi, dehidratasyon',
      sideEffects: 'Hipokalemi, hiperglisemi, hiperürisemi, fotosensitivite',
      interactions: 'Digoksin, lityum ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 131,
      name: 'Mannitol',
      category: 'diuretic',
      dosage: '0.5-2 g/kg',
      maxDaily: '200 g',
      frequency: 'Gerektiğinde',
      description: 'Osmotik diüretik',
      contraindications: 'Anüri, şiddetli hipokalemi, dehidratasyon',
      sideEffects: 'Hipokalemi, hiperglisemi, hiperürisemi, fotosensitivite',
      interactions: 'Digoksin, lityum ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },

    // Gastrointestinal (Gastrointestinal İlaçlar)
    {
      id: 132,
      name: 'Omeprazole',
      category: 'gastrointestinal',
      dosage: '0.5-1 mg/kg',
      maxDaily: '40 mg',
      frequency: 'Günde bir kez',
      description: 'Proton pompa inhibitörü',
      contraindications: 'Omeprazole alerjisi, şiddetli karaciğer yetmezliği',
      sideEffects: 'Baş ağrısı, ishal, karın ağrısı, bulantı',
      interactions: 'Warfarin, diazepam, fenitoin ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 133,
      name: 'Ranitidine',
      category: 'gastrointestinal',
      dosage: '2-4 mg/kg',
      maxDaily: '300 mg',
      frequency: '12 saatte bir',
      description: 'H2 reseptör antagonisti',
      contraindications: 'Ranitidine alerjisi, porfiri',
      sideEffects: 'Baş ağrısı, yorgunluk, kabızlık, ishal',
      interactions: 'Warfarin, teofilin ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 134,
      name: 'Metoclopramide',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '60 mg',
      frequency: '6-8 saatte bir',
      description: 'Prokinetik ve antiemetik',
      contraindications: 'Gastrointestinal kanama, perforasyon, epilepsi',
      sideEffects: 'Ekstrapiramidal semptomlar, tardif diskinezi, uyku hali',
      interactions: 'Antipsikotikler, antidepresanlar ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 135,
      name: 'Ondansetron',
      category: 'gastrointestinal',
      dosage: '0.1-0.15 mg/kg',
      maxDaily: '24 mg',
      frequency: '8 saatte bir',
      description: '5-HT3 antagonisti, antiemetik',
      contraindications: 'Ondansetron alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 136,
      name: 'Lansoprazole',
      category: 'gastrointestinal',
      dosage: '0.5-1 mg/kg',
      maxDaily: '60 mg',
      frequency: 'Günde bir kez',
      description: 'Proton pompa inhibitörü',
      contraindications: 'Lansoprazole alerjisi, şiddetli karaciğer yetmezliği',
      sideEffects: 'Baş ağrısı, ishal, karın ağrısı, bulantı',
      interactions: 'Warfarin, teofilin ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 137,
      name: 'Pantoprazole',
      category: 'gastrointestinal',
      dosage: '0.5-1 mg/kg',
      maxDaily: '80 mg',
      frequency: 'Günde bir kez',
      description: 'Proton pompa inhibitörü',
      contraindications: 'Pantoprazole alerjisi, şiddetli karaciğer yetmezliği',
      sideEffects: 'Baş ağrısı, ishal, karın ağrısı, bulantı',
      interactions: 'Warfarin, atazanavir ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 138,
      name: 'Rabeprazole',
      category: 'gastrointestinal',
      dosage: '0.5-1 mg/kg',
      maxDaily: '40 mg',
      frequency: 'Günde bir kez',
      description: 'Proton pompa inhibitörü',
      contraindications: 'Rabeprazole alerjisi, şiddetli karaciğer yetmezliği',
      sideEffects: 'Baş ağrısı, ishal, karın ağrısı, bulantı',
      interactions: 'Warfarin, diazepam, fenitoin ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 139,
      name: 'Esomeprazole',
      category: 'gastrointestinal',
      dosage: '0.5-1 mg/kg',
      maxDaily: '40 mg',
      frequency: 'Günde bir kez',
      description: 'Proton pompa inhibitörü',
      contraindications: 'Esomeprazole alerjisi, şiddetli karaciğer yetmezliği',
      sideEffects: 'Baş ağrısı, ishal, karın ağrısı, bulantı',
      interactions: 'Warfarin, diazepam, fenitoin ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 140,
      name: 'Famotidine',
      category: 'gastrointestinal',
      dosage: '0.5-1 mg/kg',
      maxDaily: '80 mg',
      frequency: '12 saatte bir',
      description: 'H2 reseptör antagonisti',
      contraindications: 'Famotidine alerjisi, porfiri',
      sideEffects: 'Baş ağrısı, yorgunluk, kabızlık, ishal',
      interactions: 'Warfarin, teofilin ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 141,
      name: 'Cimetidine',
      category: 'gastrointestinal',
      dosage: '5-10 mg/kg',
      maxDaily: '2400 mg',
      frequency: '8 saatte bir',
      description: 'H2 reseptör antagonisti',
      contraindications: 'Cimetidine alerjisi, porfiri',
      sideEffects: 'Baş ağrısı, yorgunluk, kabızlık, ishal',
      interactions: 'Warfarin, teofilin ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 142,
      name: 'Nizatidine',
      category: 'gastrointestinal',
      dosage: '2-4 mg/kg',
      maxDaily: '600 mg',
      frequency: '12 saatte bir',
      description: 'H2 reseptör antagonisti',
      contraindications: 'Nizatidine alerjisi, porfiri',
      sideEffects: 'Baş ağrısı, yorgunluk, kabızlık, ishal',
      interactions: 'Warfarin, teofilin ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 143,
      name: 'Domperidone',
      category: 'gastrointestinal',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '80 mg',
      frequency: '8 saatte bir',
      description: 'Prokinetik ajan',
      contraindications: 'Gastrointestinal kanama, perforasyon, epilepsi',
      sideEffects: 'Ekstrapiramidal semptomlar, tardif diskinezi, uyku hali',
      interactions: 'Antipsikotikler, antidepresanlar ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 144,
      name: 'Cisapride',
      category: 'gastrointestinal',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '40 mg',
      frequency: '8 saatte bir',
      description: 'Prokinetik ajan',
      contraindications: 'Gastrointestinal kanama, perforasyon, epilepsi',
      sideEffects: 'Ekstrapiramidal semptomlar, tardif diskinezi, uyku hali',
      interactions: 'Antipsikotikler, antidepresanlar ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 145,
      name: 'Granisetron',
      category: 'gastrointestinal',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '9 mg',
      frequency: '8 saatte bir',
      description: '5-HT3 antagonisti',
      contraindications: 'Granisetron alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 146,
      name: 'Palonosetron',
      category: 'gastrointestinal',
      dosage: '0.01 mg/kg',
      maxDaily: '0.75 mg',
      frequency: 'Günde bir kez',
      description: '5-HT3 antagonisti',
      contraindications: 'Palonosetron alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 147,
      name: 'Dolasetron',
      category: 'gastrointestinal',
      dosage: '0.5-1 mg/kg',
      maxDaily: '200 mg',
      frequency: 'Günde bir kez',
      description: '5-HT3 antagonisti',
      contraindications: 'Dolasetron alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 148,
      name: 'Aprepitant',
      category: 'gastrointestinal',
      dosage: '2-3 mg/kg',
      maxDaily: '375 mg',
      frequency: 'Günde bir kez',
      description: 'NK1 antagonisti',
      contraindications: 'Aprepitant alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 149,
      name: 'Fosaprepitant',
      category: 'gastrointestinal',
      dosage: '2-3 mg/kg',
      maxDaily: '150 mg',
      frequency: 'Günde bir kez',
      description: 'NK1 antagonisti',
      contraindications: 'Fosaprepitant alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 150,
      name: 'Loperamide',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '16 mg',
      frequency: '8 saatte bir',
      description: 'Antidiarrheal',
      contraindications: 'Loperamide alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 151,
      name: 'Diphenoxylate',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      frequency: '8 saatte bir',
      description: 'Antidiarrheal',
      contraindications: 'Diphenoxylate alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 152,
      name: 'Bismuth Subsalicylate',
      category: 'gastrointestinal',
      dosage: '10-20 mg/kg',
      maxDaily: '4200 mg',
      frequency: '8 saatte bir',
      description: 'Antidiarrheal ve antacid',
      contraindications: 'Bismuth Subsalicylate alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 153,
      name: 'Sucralfate',
      category: 'gastrointestinal',
      dosage: '20-40 mg/kg',
      maxDaily: '4000 mg',
      frequency: '8 saatte bir',
      description: 'Mukoprotektif ajan',
      contraindications: 'Sucralfate alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 154,
      name: 'Misoprostol',
      category: 'gastrointestinal',
      dosage: '2-4 mcg/kg',
      maxDaily: '800 mcg',
      frequency: '8 saatte bir',
      description: 'Prostaglandin E1 analogu',
      contraindications: 'Misoprostol alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'X - Hamilelikte kontrendike',
    },
    {
      id: 155,
      name: 'Aluminum Hydroxide',
      category: 'gastrointestinal',
      dosage: '10-20 mg/kg',
      maxDaily: '6000 mg',
      frequency: '8 saatte bir',
      description: 'Antacid',
      contraindications: 'Aluminum Hydroxide alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 156,
      name: 'Magnesium Hydroxide',
      category: 'gastrointestinal',
      dosage: '10-20 mg/kg',
      maxDaily: '4000 mg',
      frequency: '8 saatte bir',
      description: 'Antacid ve laksatif',
      contraindications: 'Magnesium Hydroxide alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 157,
      name: 'Calcium Carbonate',
      category: 'gastrointestinal',
      dosage: '10-20 mg/kg',
      maxDaily: '8000 mg',
      frequency: '8 saatte bir',
      description: 'Antacid',
      contraindications: 'Calcium Carbonate alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 158,
      name: 'Simethicone',
      category: 'gastrointestinal',
      dosage: '20-40 mg/kg',
      maxDaily: '2400 mg',
      frequency: '8 saatte bir',
      description: 'Antiflatulent',
      contraindications: 'Simethicone alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 159,
      name: 'Lactulose',
      category: 'gastrointestinal',
      dosage: '0.5-1 g/kg',
      maxDaily: '60 g',
      frequency: '8 saatte bir',
      description: 'Osmotik laksatif',
      contraindications: 'Lactulose alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 160,
      name: 'Polyethylene Glycol',
      category: 'gastrointestinal',
      dosage: '0.5-1 g/kg',
      maxDaily: '68 g',
      frequency: '8 saatte bir',
      description: 'Osmotik laksatif',
      contraindications: 'Polyethylene Glycol alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 161,
      name: 'Bisacodyl',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '30 mg',
      frequency: '8 saatte bir',
      description: 'Stimulant laksatif',
      contraindications: 'Bisacodyl alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 162,
      name: 'Senna',
      category: 'gastrointestinal',
      dosage: '0.5-1 mg/kg',
      maxDaily: '100 mg',
      frequency: '8 saatte bir',
      description: 'Stimulant laksatif',
      contraindications: 'Senna alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 163,
      name: 'Psyllium',
      category: 'gastrointestinal',
      dosage: '0.2-0.4 g/kg',
      maxDaily: '30 g',
      frequency: '8 saatte bir',
      description: 'Bulk-forming laksatif',
      contraindications: 'Psyllium alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 164,
      name: 'Methylcellulose',
      category: 'gastrointestinal',
      dosage: '0.2-0.4 g/kg',
      maxDaily: '30 g',
      frequency: '8 saatte bir',
      description: 'Bulk-forming laksatif',
      contraindications: 'Methylcellulose alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 165,
      name: 'Docusate Sodium',
      category: 'gastrointestinal',
      dosage: '2-4 mg/kg',
      maxDaily: '500 mg',
      frequency: '8 saatte bir',
      description: 'Stool softener',
      contraindications: 'Docusate Sodium alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 166,
      name: 'Mineral Oil',
      category: 'gastrointestinal',
      dosage: '0.5-1 ml/kg',
      maxDaily: '60 ml',
      frequency: '8 saatte bir',
      description: 'Lubricant laksatif',
      contraindications: 'Mineral Oil alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 167,
      name: 'Glycerin',
      category: 'gastrointestinal',
      dosage: '0.5-1 g/kg',
      maxDaily: '60 g',
      frequency: '8 saatte bir',
      description: 'Osmotik laksatif',
      contraindications: 'Glycerin alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 168,
      name: 'Ursodeoxycholic Acid',
      category: 'gastrointestinal',
      dosage: '10-15 mg/kg',
      maxDaily: '1500 mg',
      frequency: '8 saatte bir',
      description: 'Kolelitolitik ajan',
      contraindications: 'Ursodeoxycholic Acid alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 169,
      name: 'Chenodeoxycholic Acid',
      category: 'gastrointestinal',
      dosage: '10-15 mg/kg',
      maxDaily: '1500 mg',
      frequency: '8 saatte bir',
      description: 'Kolelitolitik ajan',
      contraindications: 'Chenodeoxycholic Acid alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'X - Hamilelikte kontrendike',
    },
    {
      id: 170,
      name: 'Activated Charcoal',
      category: 'gastrointestinal',
      dosage: '1-2 g/kg',
      maxDaily: '200 g',
      frequency: 'Gerektiğinde',
      description: 'Adsorbent, toksin bağlayıcı',
      contraindications: 'Activated Charcoal alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 171,
      name: 'Cholestyramine',
      category: 'gastrointestinal',
      dosage: '0.2-0.4 g/kg',
      maxDaily: '24 g',
      frequency: '8 saatte bir',
      description: 'Bile acid sequestrant',
      contraindications: 'Cholestyramine alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 172,
      name: 'Colestipol',
      category: 'gastrointestinal',
      dosage: '0.2-0.4 g/kg',
      maxDaily: '30 g',
      frequency: '8 saatte bir',
      description: 'Bile acid sequestrant',
      contraindications: 'Colestipol alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 173,
      name: 'Colesevelam',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 g/kg',
      maxDaily: '3.75 g',
      frequency: '8 saatte bir',
      description: 'Bile acid sequestrant',
      contraindications: 'Colesevelam alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 174,
      name: 'Mesalamine',
      category: 'gastrointestinal',
      dosage: '20-40 mg/kg',
      maxDaily: '4800 mg',
      frequency: '8 saatte bir',
      description: '5-ASA, IBD tedavisi',
      contraindications: 'Mesalamine alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 175,
      name: 'Sulfasalazine',
      category: 'gastrointestinal',
      dosage: '20-40 mg/kg',
      maxDaily: '4000 mg',
      frequency: '8 saatte bir',
      description: '5-ASA, IBD tedavisi',
      contraindications: 'Sulfasalazine alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 176,
      name: 'Balsalazide',
      category: 'gastrointestinal',
      dosage: '20-40 mg/kg',
      maxDaily: '6750 mg',
      frequency: '8 saatte bir',
      description: '5-ASA, IBD tedavisi',
      contraindications: 'Balsalazide alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 177,
      name: 'Olsalazine',
      category: 'gastrointestinal',
      dosage: '20-40 mg/kg',
      maxDaily: '3000 mg',
      frequency: '8 saatte bir',
      description: '5-ASA, IBD tedavisi',
      contraindications: 'Olsalazine alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 178,
      name: 'Budesonide',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '18 mg',
      frequency: '8 saatte bir',
      description: 'Kortikosteroid, IBD tedavisi',
      contraindications: 'Budesonide alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 179,
      name: 'Infliximab',
      category: 'gastrointestinal',
      dosage: '3-5 mg/kg',
      maxDaily: '10 mg/kg',
      frequency: '2-8 haftada bir',
      description: 'TNF-alfa antagonisti',
      contraindications: 'Infliximab alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 180,
      name: 'Adalimumab',
      category: 'gastrointestinal',
      dosage: '0.8 mg/kg',
      maxDaily: '40 mg',
      frequency: '2 haftada bir',
      description: 'TNF-alfa antagonisti',
      contraindications: 'Adalimumab alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 181,
      name: 'Certolizumab',
      category: 'gastrointestinal',
      dosage: '2-4 mg/kg',
      maxDaily: '400 mg',
      frequency: '2-4 haftada bir',
      description: 'TNF-alfa antagonisti',
      contraindications: 'Certolizumab alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 182,
      name: 'Golimumab',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '100 mg',
      frequency: '2-4 haftada bir',
      description: 'TNF-alfa antagonisti',
      contraindications: 'Golimumab alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 183,
      name: 'Vedolizumab',
      category: 'gastrointestinal',
      dosage: '3-6 mg/kg',
      maxDaily: '600 mg',
      frequency: '2-8 haftada bir',
      description: 'Integrin antagonisti',
      contraindications: 'Vedolizumab alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 184,
      name: 'Ustekinumab',
      category: 'gastrointestinal',
      dosage: '0.5-1 mg/kg',
      maxDaily: '90 mg',
      frequency: '8-12 haftada bir',
      description: 'IL-12/23 antagonisti',
      contraindications: 'Ustekinumab alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 185,
      name: 'Tofacitinib',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      frequency: '12 saatte bir',
      description: 'JAK inhibitörü',
      contraindications: 'Tofacitinib alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 186,
      name: 'Azathioprine',
      category: 'gastrointestinal',
      dosage: '1-3 mg/kg',
      maxDaily: '250 mg',
      frequency: 'Günde bir kez',
      description: 'İmmünosupressan',
      contraindications: 'Azathioprine alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 187,
      name: 'Mercaptopurine',
      category: 'gastrointestinal',
      dosage: '1-2 mg/kg',
      maxDaily: '150 mg',
      frequency: 'Günde bir kez',
      description: 'İmmünosupressan',
      contraindications: 'Mercaptopurine alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 188,
      name: 'Methotrexate',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '25 mg',
      frequency: 'Haftada bir kez',
      description: 'İmmünosupressan',
      contraindications: 'Methotrexate alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'X - Hamilelikte kontrendike',
    },
    {
      id: 189,
      name: 'Cyclosporine',
      category: 'gastrointestinal',
      dosage: '2-5 mg/kg',
      maxDaily: '400 mg',
      frequency: '12 saatte bir',
      description: 'İmmünosupressan',
      contraindications: 'Cyclosporine alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 190,
      name: 'Tacrolimus',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      frequency: '12 saatte bir',
      description: 'İmmünosupressan',
      contraindications: 'Tacrolimus alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 191,
      name: 'Mycophenolate Mofetil',
      category: 'gastrointestinal',
      dosage: '10-20 mg/kg',
      maxDaily: '3000 mg',
      frequency: '12 saatte bir',
      description: 'İmmünosupressan',
      contraindications: 'Mycophenolate Mofetil alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 192,
      name: 'Sirolimus',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      frequency: 'Günde bir kez',
      description: 'İmmünosupressan',
      contraindications: 'Sirolimus alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 193,
      name: 'Everolimus',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      frequency: 'Günde bir kez',
      description: 'İmmünosupressan',
      contraindications: 'Everolimus alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 194,
      name: 'Rituximab',
      category: 'gastrointestinal',
      dosage: '2-4 mg/kg',
      maxDaily: '1000 mg',
      frequency: '2-8 haftada bir',
      description: 'CD20 antagonisti',
      contraindications: 'Rituximab alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 195,
      name: 'Natalizumab',
      category: 'gastrointestinal',
      dosage: '2-4 mg/kg',
      maxDaily: '300 mg',
      frequency: '4 haftada bir',
      description: 'Integrin antagonisti',
      contraindications: 'Natalizumab alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 196,
      name: 'Alemtuzumab',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '30 mg',
      frequency: '2-8 haftada bir',
      description: 'CD52 antagonisti',
      contraindications: 'Alemtuzumab alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 197,
      name: 'Basiliximab',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '40 mg',
      frequency: '2-8 haftada bir',
      description: 'IL-2 antagonisti',
      contraindications: 'Basiliximab alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 198,
      name: 'Daclizumab',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '40 mg',
      frequency: '2-8 haftada bir',
      description: 'IL-2 antagonisti',
      contraindications: 'Daclizumab alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 199,
      name: 'Muromonab-CD3',
      category: 'gastrointestinal',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '15 mg',
      frequency: '2-8 haftada bir',
      description: 'CD3 antagonisti',
      contraindications: 'Muromonab-CD3 alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 200,
      name: 'Antithymocyte Globulin',
      category: 'gastrointestinal',
      dosage: '1-2 mg/kg',
      maxDaily: '200 mg',
      frequency: '2-8 haftada bir',
      description: 'İmmünosupressan',
      contraindications: 'Antithymocyte Globulin alerjisi, QT uzaması',
      sideEffects: 'Baş ağrısı, kabızlık, yorgunluk, QT uzaması',
      interactions: 'Apomorfin, tramadol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },

    // Respiratory (Solunum İlaçları)
    {
      id: 201,
      name: 'Salbutamol',
      category: 'respiratory',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '32 mg',
      frequency: '4-6 saatte bir',
      description: 'Beta-2 agonist, bronkodilatör',
      contraindications: 'Salbutamol alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 202,
      name: 'Prednisolone',
      category: 'respiratory',
      dosage: '0.5-2 mg/kg',
      maxDaily: '80 mg',
      frequency: 'Günde bir kez',
      description: 'Kortikosteroid, anti-inflamatuar',
      contraindications: 'Sistemik fungal enfeksiyon, aktif tüberküloz',
      sideEffects: 'İmmünosupresyon, hiperglisemi, osteoporoz, katarakt',
      interactions: 'Warfarin, antidiabetikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 203,
      name: 'Theophylline',
      category: 'respiratory',
      dosage: '5-10 mg/kg',
      maxDaily: '1200 mg',
      frequency: '8-12 saatte bir',
      description: 'Methylxanthine, bronkodilatör',
      contraindications: 'Theophylline alerjisi, aktif peptik ülser',
      sideEffects: 'Bulantı, kusma, taşikardi, uykusuzluk',
      interactions: 'Siprofloksasin, eritromisin ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 204,
      name: 'Terbutaline',
      category: 'respiratory',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '15 mg',
      frequency: '6-8 saatte bir',
      description: 'Beta-2 agonist, bronkodilatör',
      contraindications: 'Terbutaline alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 205,
      name: 'Formoterol',
      category: 'respiratory',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '48 mcg',
      frequency: '12 saatte bir',
      description: 'Uzun etkili beta-2 agonist',
      contraindications: 'Formoterol alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 206,
      name: 'Salmeterol',
      category: 'respiratory',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '100 mcg',
      frequency: '12 saatte bir',
      description: 'Uzun etkili beta-2 agonist',
      contraindications: 'Salmeterol alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 207,
      name: 'Ipratropium',
      category: 'respiratory',
      dosage: '0.02-0.04 mg/kg',
      maxDaily: '2.4 mg',
      frequency: '6-8 saatte bir',
      description: 'Antikolinerjik bronkodilatör',
      contraindications: 'Ipratropium alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 208,
      name: 'Tiotropium',
      category: 'respiratory',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '18 mcg',
      frequency: 'Günde bir kez',
      description: 'Uzun etkili antikolinerjik',
      contraindications: 'Tiotropium alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 209,
      name: 'Budesonide',
      category: 'respiratory',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '1800 mcg',
      frequency: '12 saatte bir',
      description: 'İnhaler kortikosteroid',
      contraindications: 'Budesonide alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 210,
      name: 'Fluticasone',
      category: 'respiratory',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '1000 mcg',
      frequency: '12 saatte bir',
      description: 'İnhaler kortikosteroid',
      contraindications: 'Fluticasone alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 211,
      name: 'Beclomethasone',
      category: 'respiratory',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '1000 mcg',
      frequency: '12 saatte bir',
      description: 'İnhaler kortikosteroid',
      contraindications: 'Beclomethasone alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 212,
      name: 'Mometasone',
      category: 'respiratory',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '800 mcg',
      frequency: '12 saatte bir',
      description: 'İnhaler kortikosteroid',
      contraindications: 'Mometasone alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 213,
      name: 'Ciclesonide',
      category: 'respiratory',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '320 mcg',
      frequency: 'Günde bir kez',
      description: 'İnhaler kortikosteroid',
      contraindications: 'Ciclesonide alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 214,
      name: 'Montelukast',
      category: 'respiratory',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '10 mg',
      frequency: 'Günde bir kez',
      description: 'Lökotrien reseptör antagonisti',
      contraindications: 'Montelukast alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 215,
      name: 'Zafirlukast',
      category: 'respiratory',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '40 mg',
      frequency: '12 saatte bir',
      description: 'Lökotrien reseptör antagonisti',
      contraindications: 'Zafirlukast alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 216,
      name: 'Zileuton',
      category: 'respiratory',
      dosage: '10-20 mg/kg',
      maxDaily: '2400 mg',
      frequency: '6 saatte bir',
      description: '5-lipoksijenaz inhibitörü',
      contraindications: 'Zileuton alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 217,
      name: 'Omalizumab',
      category: 'respiratory',
      dosage: '0.016 mg/kg',
      maxDaily: '600 mg',
      frequency: '2-4 haftada bir',
      description: 'Anti-IgE monoklonal antikor',
      contraindications: 'Omalizumab alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 218,
      name: 'Mepolizumab',
      category: 'respiratory',
      dosage: '0.1 mg/kg',
      maxDaily: '100 mg',
      frequency: '4 haftada bir',
      description: 'Anti-IL-5 monoklonal antikor',
      contraindications: 'Mepolizumab alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 219,
      name: 'Reslizumab',
      category: 'respiratory',
      dosage: '0.1 mg/kg',
      maxDaily: '110 mg',
      frequency: '4 haftada bir',
      description: 'Anti-IL-5 monoklonal antikor',
      contraindications: 'Reslizumab alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 220,
      name: 'Benralizumab',
      category: 'respiratory',
      dosage: '0.1 mg/kg',
      maxDaily: '30 mg',
      frequency: '4 haftada bir',
      description: 'Anti-IL-5 reseptör monoklonal antikor',
      contraindications: 'Benralizumab alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 221,
      name: 'Dupilumab',
      category: 'respiratory',
      dosage: '0.1 mg/kg',
      maxDaily: '300 mg',
      frequency: '2 haftada bir',
      description: 'Anti-IL-4/13 monoklonal antikor',
      contraindications: 'Dupilumab alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 222,
      name: 'Tezepelumab',
      category: 'respiratory',
      dosage: '0.1 mg/kg',
      maxDaily: '210 mg',
      frequency: '4 haftada bir',
      description: 'Anti-TSLP monoklonal antikor',
      contraindications: 'Tezepelumab alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 223,
      name: 'Acetylcysteine',
      category: 'respiratory',
      dosage: '10-20 mg/kg',
      maxDaily: '2400 mg',
      frequency: '8 saatte bir',
      description: 'Mukolitik ajan',
      contraindications: 'Acetylcysteine alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 224,
      name: 'Bromhexine',
      category: 'respiratory',
      dosage: '0.5-1 mg/kg',
      maxDaily: '96 mg',
      frequency: '8 saatte bir',
      description: 'Mukolitik ajan',
      contraindications: 'Bromhexine alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 225,
      name: 'Ambroxol',
      category: 'respiratory',
      dosage: '0.5-1 mg/kg',
      maxDaily: '120 mg',
      frequency: '8 saatte bir',
      description: 'Mukolitik ajan',
      contraindications: 'Ambroxol alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 226,
      name: 'Guaifenesin',
      category: 'respiratory',
      dosage: '5-10 mg/kg',
      maxDaily: '2400 mg',
      frequency: '8 saatte bir',
      description: 'Ekspektoran',
      contraindications: 'Guaifenesin alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 227,
      name: 'Dextromethorphan',
      category: 'respiratory',
      dosage: '0.5-1 mg/kg',
      maxDaily: '120 mg',
      frequency: '8 saatte bir',
      description: 'Antitussif',
      contraindications: 'Dextromethorphan alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 228,
      name: 'Codeine',
      category: 'respiratory',
      dosage: '0.5-1 mg/kg',
      maxDaily: '240 mg',
      frequency: '8 saatte bir',
      description: 'Antitussif',
      contraindications: 'Codeine alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 229,
      name: 'Hydrocodone',
      category: 'respiratory',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '60 mg',
      frequency: '8 saatte bir',
      description: 'Antitussif',
      contraindications: 'Hydrocodone alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 230,
      name: 'Phenylephrine',
      category: 'respiratory',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '40 mg',
      frequency: '8 saatte bir',
      description: 'Dekonjestan',
      contraindications: 'Phenylephrine alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 231,
      name: 'Pseudoephedrine',
      category: 'respiratory',
      dosage: '1-2 mg/kg',
      maxDaily: '240 mg',
      frequency: '8 saatte bir',
      description: 'Dekonjestan',
      contraindications: 'Pseudoephedrine alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 232,
      name: 'Oxymetazoline',
      category: 'respiratory',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '0.1 mg',
      frequency: '8 saatte bir',
      description: 'Topikal dekonjestan',
      contraindications: 'Oxymetazoline alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 233,
      name: 'Xylometazoline',
      category: 'respiratory',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '0.1 mg',
      frequency: '8 saatte bir',
      description: 'Topikal dekonjestan',
      contraindications: 'Xylometazoline alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 234,
      name: 'Naphazoline',
      category: 'respiratory',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '0.1 mg',
      frequency: '8 saatte bir',
      description: 'Topikal dekonjestan',
      contraindications: 'Naphazoline alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 235,
      name: 'Cromolyn Sodium',
      category: 'respiratory',
      dosage: '1-2 mg/kg',
      maxDaily: '160 mg',
      frequency: '8 saatte bir',
      description: 'Mast hücre stabilizatörü',
      contraindications: 'Cromolyn Sodium alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 236,
      name: 'Nedocromil',
      category: 'respiratory',
      dosage: '1-2 mg/kg',
      maxDaily: '16 mg',
      frequency: '8 saatte bir',
      description: 'Mast hücre stabilizatörü',
      contraindications: 'Nedocromil alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 237,
      name: 'Ketotifen',
      category: 'respiratory',
      dosage: '0.02-0.04 mg/kg',
      maxDaily: '4 mg',
      frequency: '12 saatte bir',
      description: 'Mast hücre stabilizatörü',
      contraindications: 'Ketotifen alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 238,
      name: 'Roflumilast',
      category: 'respiratory',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '1 mg',
      frequency: 'Günde bir kez',
      description: 'PDE4 inhibitörü',
      contraindications: 'Roflumilast alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 239,
      name: 'Apremilast',
      category: 'respiratory',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '30 mg',
      frequency: '12 saatte bir',
      description: 'PDE4 inhibitörü',
      contraindications: 'Apremilast alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 240,
      name: 'Crisaborole',
      category: 'respiratory',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      frequency: '12 saatte bir',
      description: 'PDE4 inhibitörü',
      contraindications: 'Crisaborole alerjisi, taşikardi, hipertiroidizm',
      sideEffects: 'Tremor, taşikardi, baş ağrısı, hipokalemi',
      interactions: 'Beta blokerler, diüretikler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },

    // Neurological (Nörolojik İlaçlar)
    {
      id: 241,
      name: 'Phenytoin',
      category: 'neurological',
      dosage: '5-10 mg/kg',
      maxDaily: '600 mg',
      frequency: '8-12 saatte bir',
      description: 'Antiepileptik',
      contraindications: 'Phenytoin alerjisi, sinüs bradikardisi, AV blok',
      sideEffects: 'Gingival hiperplazi, hirsutizm, ataksi, nistagmus',
      interactions: 'Warfarin, oral kontraseptifler ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 242,
      name: 'Carbamazepine',
      category: 'neurological',
      dosage: '10-20 mg/kg',
      maxDaily: '1600 mg',
      frequency: '8-12 saatte bir',
      description: 'Antiepileptik ve nöropatik ağrı',
      contraindications: 'Carbamazepine alerjisi, AV blok, kemik iliği depresyonu',
      sideEffects: 'Döküntü, karaciğer toksisitesi, lökopeni, diplopi',
      interactions: 'Warfarin, oral kontraseptifler ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 243,
      name: 'Diazepam',
      category: 'neurological',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '40 mg',
      frequency: '6-8 saatte bir',
      description: 'Benzodiazepin, anksiyolitik',
      contraindications: 'Diazepam alerjisi, miyastenia gravis, şiddetli solunum yetmezliği',
      sideEffects: 'Sedasyon, bağımlılık, yoksunluk sendromu, ataksi',
      interactions: 'Alkol, opioidler, antidepresanlar ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 244,
      name: 'Lorazepam',
      category: 'neurological',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '10 mg',
      frequency: '6-8 saatte bir',
      description: 'Benzodiazepin, anksiyolitik',
      contraindications: 'Lorazepam alerjisi, miyastenia gravis, şiddetli solunum yetmezliği',
      sideEffects: 'Sedasyon, bağımlılık, yoksunluk sendromu, ataksi',
      interactions: 'Alkol, opioidler, antidepresanlar ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 245,
      name: 'Valproic Acid',
      category: 'neurological',
      dosage: '10-20 mg/kg',
      maxDaily: '3000 mg',
      frequency: '8-12 saatte bir',
      description: 'Antiepileptik',
      contraindications: 'Valproic acid alerjisi, karaciğer hastalığı, pankreatit',
      sideEffects: 'Karaciğer toksisitesi, pankreatit, trombositopeni, kilo alımı',
      interactions: 'Warfarin, lamotrigin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 246,
      name: 'Lamotrigine',
      category: 'neurological',
      dosage: '1-5 mg/kg',
      maxDaily: '400 mg',
      frequency: '12 saatte bir',
      description: 'Antiepileptik',
      contraindications: 'Lamotrigine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 247,
      name: 'Levetiracetam',
      category: 'neurological',
      dosage: '10-20 mg/kg',
      maxDaily: '3000 mg',
      frequency: '12 saatte bir',
      description: 'Antiepileptik',
      contraindications: 'Levetiracetam alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 248,
      name: 'Topiramate',
      category: 'neurological',
      dosage: '1-5 mg/kg',
      maxDaily: '400 mg',
      frequency: '12 saatte bir',
      description: 'Antiepileptik',
      contraindications: 'Topiramate alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 249,
      name: 'Gabapentin',
      category: 'neurological',
      dosage: '10-20 mg/kg',
      maxDaily: '3600 mg',
      frequency: '8 saatte bir',
      description: 'Antiepileptik ve nöropatik ağrı',
      contraindications: 'Gabapentin alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 250,
      name: 'Pregabalin',
      category: 'neurological',
      dosage: '2-6 mg/kg',
      maxDaily: '600 mg',
      frequency: '12 saatte bir',
      description: 'Antiepileptik ve nöropatik ağrı',
      contraindications: 'Pregabalin alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 251,
      name: 'Oxcarbazepine',
      category: 'neurological',
      dosage: '10-20 mg/kg',
      maxDaily: '2400 mg',
      frequency: '12 saatte bir',
      description: 'Antiepileptik',
      contraindications: 'Oxcarbazepine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 252,
      name: 'Zonisamide',
      category: 'neurological',
      dosage: '2-8 mg/kg',
      maxDaily: '600 mg',
      frequency: 'Günde bir kez',
      description: 'Antiepileptik',
      contraindications: 'Zonisamide alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 253,
      name: 'Lacosamide',
      category: 'neurological',
      dosage: '2-4 mg/kg',
      maxDaily: '400 mg',
      frequency: '12 saatte bir',
      description: 'Antiepileptik',
      contraindications: 'Lacosamide alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 254,
      name: 'Rufinamide',
      category: 'neurological',
      dosage: '10-20 mg/kg',
      maxDaily: '3200 mg',
      frequency: '12 saatte bir',
      description: 'Antiepileptik',
      contraindications: 'Rufinamide alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 255,
      name: 'Vigabatrin',
      category: 'neurological',
      dosage: '20-40 mg/kg',
      maxDaily: '4000 mg',
      frequency: '12 saatte bir',
      description: 'Antiepileptik',
      contraindications: 'Vigabatrin alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 256,
      name: 'Tiagabine',
      category: 'neurological',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '56 mg',
      frequency: '8 saatte bir',
      description: 'Antiepileptik',
      contraindications: 'Tiagabine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 257,
      name: 'Felbamate',
      category: 'neurological',
      dosage: '15-45 mg/kg',
      maxDaily: '3600 mg',
      frequency: '8 saatte bir',
      description: 'Antiepileptik',
      contraindications: 'Felbamate alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 258,
      name: 'Ethosuximide',
      category: 'neurological',
      dosage: '10-20 mg/kg',
      maxDaily: '1500 mg',
      frequency: '12 saatte bir',
      description: 'Antiepileptik',
      contraindications: 'Ethosuximide alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 259,
      name: 'Clonazepam',
      category: 'neurological',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '20 mg',
      frequency: '8 saatte bir',
      description: 'Benzodiazepin, antiepileptik',
      contraindications: 'Clonazepam alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 260,
      name: 'Clobazam',
      category: 'neurological',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '40 mg',
      frequency: '12 saatte bir',
      description: 'Benzodiazepin, antiepileptik',
      contraindications: 'Clobazam alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 261,
      name: 'Midazolam',
      category: 'neurological',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '20 mg',
      frequency: '8 saatte bir',
      description: 'Benzodiazepin, sedatif',
      contraindications: 'Midazolam alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 262,
      name: 'Alprazolam',
      category: 'neurological',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '4 mg',
      frequency: '8 saatte bir',
      description: 'Benzodiazepin, anksiyolitik',
      contraindications: 'Alprazolam alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 263,
      name: 'Clonazepam',
      category: 'neurological',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '20 mg',
      frequency: '8 saatte bir',
      description: 'Benzodiazepin, anksiyolitik',
      contraindications: 'Clonazepam alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 264,
      name: 'Buspirone',
      category: 'neurological',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '60 mg',
      frequency: '8 saatte bir',
      description: 'Anksiyolitik',
      contraindications: 'Buspirone alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 265,
      name: 'Hydroxyzine',
      category: 'neurological',
      dosage: '0.5-1 mg/kg',
      maxDaily: '400 mg',
      frequency: '8 saatte bir',
      description: 'Anksiyolitik ve antihistamin',
      contraindications: 'Hydroxyzine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 266,
      name: 'Mirtazapine',
      category: 'neurological',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '45 mg',
      frequency: 'Günde bir kez',
      description: 'Antidepresan',
      contraindications: 'Mirtazapine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 267,
      name: 'Trazodone',
      category: 'neurological',
      dosage: '1-2 mg/kg',
      maxDaily: '400 mg',
      frequency: 'Günde bir kez',
      description: 'Antidepresan',
      contraindications: 'Trazodone alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 268,
      name: 'Fluoxetine',
      category: 'neurological',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '80 mg',
      frequency: 'Günde bir kez',
      description: 'SSRI antidepresan',
      contraindications: 'Fluoxetine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 269,
      name: 'Sertraline',
      category: 'neurological',
      dosage: '0.5-1 mg/kg',
      maxDaily: '200 mg',
      frequency: 'Günde bir kez',
      description: 'SSRI antidepresan',
      contraindications: 'Sertraline alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 270,
      name: 'Paroxetine',
      category: 'neurological',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '60 mg',
      frequency: 'Günde bir kez',
      description: 'SSRI antidepresan',
      contraindications: 'Paroxetine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 271,
      name: 'Citalopram',
      category: 'neurological',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '40 mg',
      frequency: 'Günde bir kez',
      description: 'SSRI antidepresan',
      contraindications: 'Citalopram alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 272,
      name: 'Escitalopram',
      category: 'neurological',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      frequency: 'Günde bir kez',
      description: 'SSRI antidepresan',
      contraindications: 'Escitalopram alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 273,
      name: 'Venlafaxine',
      category: 'neurological',
      dosage: '0.5-1 mg/kg',
      maxDaily: '375 mg',
      frequency: 'Günde bir kez',
      description: 'SNRI antidepresan',
      contraindications: 'Venlafaxine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 274,
      name: 'Duloxetine',
      category: 'neurological',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '120 mg',
      frequency: 'Günde bir kez',
      description: 'SNRI antidepresan',
      contraindications: 'Duloxetine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 275,
      name: 'Bupropion',
      category: 'neurological',
      dosage: '1-3 mg/kg',
      maxDaily: '450 mg',
      frequency: 'Günde bir kez',
      description: 'NDRI antidepresan',
      contraindications: 'Bupropion alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 276,
      name: 'Amitriptyline',
      category: 'neurological',
      dosage: '0.5-1 mg/kg',
      maxDaily: '300 mg',
      frequency: 'Günde bir kez',
      description: 'Trisiklik antidepresan',
      contraindications: 'Amitriptyline alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 277,
      name: 'Nortriptyline',
      category: 'neurological',
      dosage: '0.5-1 mg/kg',
      maxDaily: '150 mg',
      frequency: 'Günde bir kez',
      description: 'Trisiklik antidepresan',
      contraindications: 'Nortriptyline alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 278,
      name: 'Imipramine',
      category: 'neurological',
      dosage: '0.5-1 mg/kg',
      maxDaily: '300 mg',
      frequency: 'Günde bir kez',
      description: 'Trisiklik antidepresan',
      contraindications: 'Imipramine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 279,
      name: 'Clomipramine',
      category: 'neurological',
      dosage: '0.5-1 mg/kg',
      maxDaily: '250 mg',
      frequency: 'Günde bir kez',
      description: 'Trisiklik antidepresan',
      contraindications: 'Clomipramine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 280,
      name: 'Desipramine',
      category: 'neurological',
      dosage: '0.5-1 mg/kg',
      maxDaily: '300 mg',
      frequency: 'Günde bir kez',
      description: 'Trisiklik antidepresan',
      contraindications: 'Desipramine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 281,
      name: 'Doxepin',
      category: 'neurological',
      dosage: '0.5-1 mg/kg',
      maxDaily: '300 mg',
      frequency: 'Günde bir kez',
      description: 'Trisiklik antidepresan',
      contraindications: 'Doxepin alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 282,
      name: 'Trimipramine',
      category: 'neurological',
      dosage: '0.5-1 mg/kg',
      maxDaily: '200 mg',
      frequency: 'Günde bir kez',
      description: 'Trisiklik antidepresan',
      contraindications: 'Trimipramine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 283,
      name: 'Protriptyline',
      category: 'neurological',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '60 mg',
      frequency: 'Günde bir kez',
      description: 'Trisiklik antidepresan',
      contraindications: 'Protriptyline alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 284,
      name: 'Amoxapine',
      category: 'neurological',
      dosage: '0.5-1 mg/kg',
      maxDaily: '400 mg',
      frequency: 'Günde bir kez',
      description: 'Trisiklik antidepresan',
      contraindications: 'Amoxapine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 285,
      name: 'Maprotiline',
      category: 'neurological',
      dosage: '0.5-1 mg/kg',
      maxDaily: '225 mg',
      frequency: 'Günde bir kez',
      description: 'Tetracyclic antidepresan',
      contraindications: 'Maprotiline alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 286,
      name: 'Mirtazapine',
      category: 'neurological',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '45 mg',
      frequency: 'Günde bir kez',
      description: 'Tetracyclic antidepresan',
      contraindications: 'Mirtazapine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 287,
      name: 'Mianserin',
      category: 'neurological',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '90 mg',
      frequency: 'Günde bir kez',
      description: 'Tetracyclic antidepresan',
      contraindications: 'Mianserin alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 288,
      name: 'Setiptiline',
      category: 'neurological',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '30 mg',
      frequency: 'Günde bir kez',
      description: 'Tetracyclic antidepresan',
      contraindications: 'Setiptiline alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 289,
      name: 'Moclobemide',
      category: 'neurological',
      dosage: '2-4 mg/kg',
      maxDaily: '600 mg',
      frequency: 'Günde bir kez',
      description: 'MAO-A inhibitörü',
      contraindications: 'Moclobemide alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 290,
      name: 'Phenelzine',
      category: 'neurological',
      dosage: '0.5-1 mg/kg',
      maxDaily: '90 mg',
      frequency: 'Günde bir kez',
      description: 'MAO inhibitörü',
      contraindications: 'Phenelzine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 291,
      name: 'Tranylcypromine',
      category: 'neurological',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '60 mg',
      frequency: 'Günde bir kez',
      description: 'MAO inhibitörü',
      contraindications: 'Tranylcypromine alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 292,
      name: 'Isocarboxazid',
      category: 'neurological',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '60 mg',
      frequency: 'Günde bir kez',
      description: 'MAO inhibitörü',
      contraindications: 'Isocarboxazid alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 293,
      name: 'Selegiline',
      category: 'neurological',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      frequency: 'Günde bir kez',
      description: 'MAO-B inhibitörü',
      contraindications: 'Selegiline alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 294,
      name: 'Rasagiline',
      category: 'neurological',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '1 mg',
      frequency: 'Günde bir kez',
      description: 'MAO-B inhibitörü',
      contraindications: 'Rasagiline alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 295,
      name: 'Safinamide',
      category: 'neurological',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '100 mg',
      frequency: 'Günde bir kez',
      description: 'MAO-B inhibitörü',
      contraindications: 'Safinamide alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 296,
      name: 'Levodopa',
      category: 'neurological',
      dosage: '2-5 mg/kg',
      maxDaily: '2000 mg',
      frequency: '8 saatte bir',
      description: 'Dopamin prekürsörü',
      contraindications: 'Levodopa alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 297,
      name: 'Carbidopa',
      category: 'neurological',
      dosage: '0.5-1 mg/kg',
      maxDaily: '200 mg',
      frequency: '8 saatte bir',
      description: 'DOPA dekarboksilaz inhibitörü',
      contraindications: 'Carbidopa alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 298,
      name: 'Entacapone',
      category: 'neurological',
      dosage: '5-10 mg/kg',
      maxDaily: '1600 mg',
      frequency: '8 saatte bir',
      description: 'COMT inhibitörü',
      contraindications: 'Entacapone alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 299,
      name: 'Tolcapone',
      category: 'neurological',
      dosage: '2-4 mg/kg',
      maxDaily: '600 mg',
      frequency: '8 saatte bir',
      description: 'COMT inhibitörü',
      contraindications: 'Tolcapone alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },
    {
      id: 300,
      name: 'Opicapone',
      category: 'neurological',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '50 mg',
      frequency: 'Günde bir kez',
      description: 'COMT inhibitörü',
      contraindications: 'Opicapone alerjisi, ciddi karaciğer yetmezliği',
      sideEffects: 'Döküntü, baş ağrısı, diplopi, ataksi',
      interactions: 'Valproic acid, karbamazepin ile etkileşim',
      pregnancyCategory: 'D - Hamilelikte riskli',
    },

    // Endocrine (Endokrin İlaçlar)
    {
      id: 301,
      name: 'Insulin',
      category: 'endocrine',
      dosage: '0.5-1 U/kg',
      maxDaily: '100 U',
      frequency: 'Günde 2-4 kez',
      description: 'Hipoglisemik ajan',
      contraindications: 'Hipoglisemi, insülin alerjisi',
      sideEffects: 'Hipoglisemi, lipodistrofi, kilo alımı',
      interactions: 'Beta blokerler, alkol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 302,
      name: 'Metformin',
      category: 'endocrine',
      dosage: '10-15 mg/kg',
      maxDaily: '2550 mg',
      frequency: 'Günde 2-3 kez',
      description: 'Biguanid, hipoglisemik',
      contraindications: 'Böbrek yetmezliği, karaciğer yetmezliği, laktik asidoz',
      sideEffects: 'Gastrointestinal yan etkiler, laktik asidoz, B12 eksikliği',
      interactions: 'Kontrast maddeler, alkol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 303,
      name: 'Levothyroxine',
      category: 'endocrine',
      dosage: '1.6-2.2 mcg/kg',
      maxDaily: '300 mcg',
      frequency: 'Günde bir kez',
      description: 'Tiroid hormonu',
      contraindications: 'Hipertiroidizm, adrenal yetmezlik',
      sideEffects: 'Hipertiroidizm, kalp çarpıntısı, kilo kaybı',
      interactions: 'Demir, kalsiyum, antasitler ile etkileşim',
      pregnancyCategory: 'A - Hamilelikte güvenli',
    },
    {
      id: 304,
      name: 'Glipizide',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '40 mg',
      frequency: 'Günde 1-2 kez',
      description: 'Sulfonilüre, hipoglisemik',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Hipoglisemi, kilo alımı, gastrointestinal yan etkiler',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 305,
      name: 'Glibenclamide',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      frequency: 'Günde 1-2 kez',
      description: 'Sulfonilüre, hipoglisemik',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Hipoglisemi, kilo alımı, gastrointestinal yan etkiler',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 306,
      name: 'Gliclazide',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '320 mg',
      frequency: 'Günde 1-2 kez',
      description: 'Sulfonilüre, hipoglisemik',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Hipoglisemi, kilo alımı, gastrointestinal yan etkiler',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 307,
      name: 'Glimepiride',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '8 mg',
      frequency: 'Günde 1-2 kez',
      description: 'Sulfonilüre, hipoglisemik',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Hipoglisemi, kilo alımı, gastrointestinal yan etkiler',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 308,
      name: 'Repaglinide',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '16 mg',
      frequency: 'Günde 3 kez',
      description: 'Meglitinid, hipoglisemik',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Hipoglisemi, kilo alımı, gastrointestinal yan etkiler',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 309,
      name: 'Nateglinide',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '360 mg',
      frequency: 'Günde 3 kez',
      description: 'Meglitinid, hipoglisemik',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Hipoglisemi, kilo alımı, gastrointestinal yan etkiler',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 310,
      name: 'Pioglitazone',
      category: 'endocrine',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '45 mg',
      frequency: 'Günde bir kez',
      description: 'Tiazolidindion, hipoglisemik',
      contraindications: 'Kalp yetmezliği, karaciğer yetmezliği',
      sideEffects: 'Kilo alımı, ödem, kalp yetmezliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 311,
      name: 'Rosiglitazone',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '8 mg',
      frequency: 'Günde bir kez',
      description: 'Tiazolidindion, hipoglisemik',
      contraindications: 'Kalp yetmezliği, karaciğer yetmezliği',
      sideEffects: 'Kilo alımı, ödem, kalp yetmezliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 312,
      name: 'Acarbose',
      category: 'endocrine',
      dosage: '1-2 mg/kg',
      maxDaily: '300 mg',
      frequency: 'Günde 3 kez',
      description: 'Alfa-glukozidaz inhibitörü',
      contraindications: 'İnflamatuar bağırsak hastalığı, böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 313,
      name: 'Miglitol',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '300 mg',
      frequency: 'Günde 3 kez',
      description: 'Alfa-glukozidaz inhibitörü',
      contraindications: 'İnflamatuar bağırsak hastalığı, böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 314,
      name: 'Voglibose',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '0.9 mg',
      frequency: 'Günde 3 kez',
      description: 'Alfa-glukozidaz inhibitörü',
      contraindications: 'İnflamatuar bağırsak hastalığı, böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 315,
      name: 'Sitagliptin',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '100 mg',
      frequency: 'Günde bir kez',
      description: 'DPP-4 inhibitörü',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 316,
      name: 'Vildagliptin',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '100 mg',
      frequency: 'Günde bir kez',
      description: 'DPP-4 inhibitörü',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 317,
      name: 'Saxagliptin',
      category: 'endocrine',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '10 mg',
      frequency: 'Günde bir kez',
      description: 'DPP-4 inhibitörü',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 318,
      name: 'Linagliptin',
      category: 'endocrine',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '5 mg',
      frequency: 'Günde bir kez',
      description: 'DPP-4 inhibitörü',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 319,
      name: 'Alogliptin',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '25 mg',
      frequency: 'Günde bir kez',
      description: 'DPP-4 inhibitörü',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 320,
      name: 'Exenatide',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '20 mcg',
      frequency: 'Günde 2 kez',
      description: 'GLP-1 agonist',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 321,
      name: 'Liraglutide',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '3 mg',
      frequency: 'Günde bir kez',
      description: 'GLP-1 agonist',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 322,
      name: 'Dulaglutide',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '1.5 mg',
      frequency: 'Günde bir kez',
      description: 'GLP-1 agonist',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 323,
      name: 'Lixisenatide',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '20 mcg',
      frequency: 'Günde bir kez',
      description: 'GLP-1 agonist',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 324,
      name: 'Semaglutide',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '1 mg',
      frequency: 'Günde bir kez',
      description: 'GLP-1 agonist',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 325,
      name: 'Albiglutide',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '50 mg',
      frequency: 'Günde bir kez',
      description: 'GLP-1 agonist',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 326,
      name: 'Canagliflozin',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '300 mg',
      frequency: 'Günde bir kez',
      description: 'SGLT2 inhibitörü',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 327,
      name: 'Dapagliflozin',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '10 mg',
      frequency: 'Günde bir kez',
      description: 'SGLT2 inhibitörü',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 328,
      name: 'Empagliflozin',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '25 mg',
      frequency: 'Günde bir kez',
      description: 'SGLT2 inhibitörü',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 329,
      name: 'Ertugliflozin',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '15 mg',
      frequency: 'Günde bir kez',
      description: 'SGLT2 inhibitörü',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 330,
      name: 'Liraglutide',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '3 mg',
      frequency: 'Günde bir kez',
      description: 'GLP-1 agonist',
      contraindications: 'Tip 1 diyabet, şiddetli böbrek yetmezliği',
      sideEffects: 'Gastrointestinal yan etkiler, karaciğer enzim yüksekliği',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 331,
      name: 'Prednisolone',
      category: 'endocrine',
      dosage: '0.5-2 mg/kg',
      maxDaily: '80 mg',
      frequency: 'Günde bir kez',
      description: 'Kortikosteroid',
      contraindications: 'Sistemik fungal enfeksiyonlar, aktif tüberküloz',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 332,
      name: 'Dexamethasone',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '16 mg',
      frequency: 'Günde bir kez',
      description: 'Kortikosteroid',
      contraindications: 'Sistemik fungal enfeksiyonlar, aktif tüberküloz',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 333,
      name: 'Hydrocortisone',
      category: 'endocrine',
      dosage: '1-2 mg/kg',
      maxDaily: '300 mg',
      frequency: 'Günde bir kez',
      description: 'Kortikosteroid',
      contraindications: 'Sistemik fungal enfeksiyonlar, aktif tüberküloz',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 334,
      name: 'Methylprednisolone',
      category: 'endocrine',
      dosage: '0.5-2 mg/kg',
      maxDaily: '1000 mg',
      frequency: 'Günde bir kez',
      description: 'Kortikosteroid',
      contraindications: 'Sistemik fungal enfeksiyonlar, aktif tüberküloz',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 335,
      name: 'Triamcinolone',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '40 mg',
      frequency: 'Günde bir kez',
      description: 'Kortikosteroid',
      contraindications: 'Sistemik fungal enfeksiyonlar, aktif tüberküloz',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 336,
      name: 'Betamethasone',
      category: 'endocrine',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '8 mg',
      frequency: 'Günde bir kez',
      description: 'Kortikosteroid',
      contraindications: 'Sistemik fungal enfeksiyonlar, aktif tüberküloz',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 337,
      name: 'Fludrocortisone',
      category: 'endocrine',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '0.2 mg',
      frequency: 'Günde bir kez',
      description: 'Mineralokortikoid',
      contraindications: 'Sistemik fungal enfeksiyonlar, aktif tüberküloz',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 338,
      name: 'Testosterone',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '400 mg',
      frequency: 'Günde bir kez',
      description: 'Androjen hormonu',
      contraindications: 'Prostat kanseri, meme kanseri',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 339,
      name: 'Estradiol',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '2 mg',
      frequency: 'Günde bir kez',
      description: 'Östrojen hormonu',
      contraindications: 'Meme kanseri, endometriyal kanser',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 340,
      name: 'Progesterone',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '200 mg',
      frequency: 'Günde bir kez',
      description: 'Progestin hormonu',
      contraindications: 'Meme kanseri, endometriyal kanser',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 341,
      name: 'Growth Hormone',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '0.1 mg',
      frequency: 'Günde bir kez',
      description: 'Büyüme hormonu',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 342,
      name: 'Somatostatin',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '0.6 mg',
      frequency: 'Günde bir kez',
      description: 'Somatostatin analogu',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 343,
      name: 'Octreotide',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '1.5 mg',
      frequency: 'Günde bir kez',
      description: 'Somatostatin analogu',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 344,
      name: 'Lanreotide',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '120 mg',
      frequency: 'Günde bir kez',
      description: 'Somatostatin analogu',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 345,
      name: 'Pasireotide',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '1.2 mg',
      frequency: 'Günde bir kez',
      description: 'Somatostatin analogu',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 346,
      name: 'Cabergoline',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '3 mg',
      frequency: 'Günde bir kez',
      description: 'Dopamin agonist',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 347,
      name: 'Bromocriptine',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '30 mg',
      frequency: 'Günde bir kez',
      description: 'Dopamin agonist',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 348,
      name: 'Pergolide',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '5 mg',
      frequency: 'Günde bir kez',
      description: 'Dopamin agonist',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 349,
      name: 'Quinagolide',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '0.3 mg',
      frequency: 'Günde bir kez',
      description: 'Dopamin agonist',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 350,
      name: 'Pramipexole',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '4.5 mg',
      frequency: 'Günde bir kez',
      description: 'Dopamin agonist',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 351,
      name: 'Ropinirole',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '24 mg',
      frequency: 'Günde bir kez',
      description: 'Dopamin agonist',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 352,
      name: 'Rotigotine',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '8 mg',
      frequency: 'Günde bir kez',
      description: 'Dopamin agonist',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 353,
      name: 'Apomorphine',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '10 mg',
      frequency: 'Günde bir kez',
      description: 'Dopamin agonist',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 354,
      name: 'Lisuride',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '0.6 mg',
      frequency: 'Günde bir kez',
      description: 'Dopamin agonist',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 355,
      name: 'Terguride',
      category: 'endocrine',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '1.5 mg',
      frequency: 'Günde bir kez',
      description: 'Dopamin agonist',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 356,
      name: 'Alizapride',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '200 mg',
      frequency: 'Günde bir kez',
      description: 'Dopamin antagonist',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 357,
      name: 'Domperidone',
      category: 'endocrine',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '80 mg',
      frequency: 'Günde bir kez',
      description: 'Dopamin antagonist',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 358,
      name: 'Metoclopramide',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '60 mg',
      frequency: 'Günde bir kez',
      description: 'Dopamin antagonist',
      contraindications: 'Aktif malignite, ciddi böbrek yetmezliği',
      sideEffects: 'Kilo alımı, ödem, hipertansiyon, diyabet',
      interactions: 'Warfarin, alkol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 359,
      name: 'Haloperidol',
      category: 'endocrine',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '30 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 360,
      name: 'Chlorpromazine',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '1000 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 361,
      name: 'Fluphenazine',
      category: 'endocrine',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '20 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 362,
      name: 'Perphenazine',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '64 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 363,
      name: 'Trifluoperazine',
      category: 'endocrine',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '40 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 364,
      name: 'Thioridazine',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '800 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 365,
      name: 'Mesoridazine',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '400 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 366,
      name: 'Pimozide',
      category: 'endocrine',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '20 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 367,
      name: 'Molindone',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '225 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 368,
      name: 'Loxapine',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '250 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 369,
      name: 'Clozapine',
      category: 'endocrine',
      dosage: '1-2 mg/kg',
      maxDaily: '900 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 370,
      name: 'Olanzapine',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 371,
      name: 'Quetiapine',
      category: 'endocrine',
      dosage: '1-2 mg/kg',
      maxDaily: '800 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 372,
      name: 'Risperidone',
      category: 'endocrine',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '16 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 373,
      name: 'Paliperidone',
      category: 'endocrine',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '12 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 374,
      name: 'Aripiprazole',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '30 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 375,
      name: 'Ziprasidone',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '160 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 376,
      name: 'Asenapine',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 377,
      name: 'Iloperidone',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '24 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 378,
      name: 'Lurasidone',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '160 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 379,
      name: 'Brexpiprazole',
      category: 'endocrine',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '4 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 380,
      name: 'Cariprazine',
      category: 'endocrine',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '6 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 381,
      name: 'Pimavanserin',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '34 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 382,
      name: 'Valbenazine',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '80 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 383,
      name: 'Deutetrabenazine',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '48 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 384,
      name: 'Tetrabenazine',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '100 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 385,
      name: 'Amisulpride',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '1200 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 386,
      name: 'Sulpiride',
      category: 'endocrine',
      dosage: '1-2 mg/kg',
      maxDaily: '2400 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 387,
      name: 'Tiapride',
      category: 'endocrine',
      dosage: '1-2 mg/kg',
      maxDaily: '1200 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 388,
      name: 'Remoxipride',
      category: 'endocrine',
      dosage: '1-2 mg/kg',
      maxDaily: '600 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 389,
      name: 'Raclopride',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 390,
      name: 'Nemonapride',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '30 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 391,
      name: 'Sertindole',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '24 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 392,
      name: 'Zotepine',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '300 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 393,
      name: 'Sultopride',
      category: 'endocrine',
      dosage: '1-2 mg/kg',
      maxDaily: '2400 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 394,
      name: 'Timiperone',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '12 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 395,
      name: 'Nemonapride',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '30 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 396,
      name: 'Mosapramine',
      category: 'endocrine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '300 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 397,
      name: 'Perospirone',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '48 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 398,
      name: 'Blonanserin',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '24 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 399,
      name: 'Paliperidone',
      category: 'endocrine',
      dosage: '0.05-0.1 mg/kg',
      maxDaily: '12 mg',
      description: 'Dopamin antagonist',
    },
    {
      id: 400,
      name: 'Aripiprazole',
      category: 'endocrine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '30 mg',
      description: 'Dopamin antagonist',
    },

    // Antihistamines (Antihistaminler)
    {
      id: 401,
      name: 'Diphenhydramine',
      category: 'antihistamine',
      dosage: '1-2 mg/kg',
      maxDaily: '300 mg',
      frequency: '6-8 saatte bir',
      description: 'H1 antagonisti, sedatif',
      contraindications: 'Diphenhydramine alerjisi, glokom, prostat hipertrofisi',
      sideEffects: 'Sedasyon, ağız kuruluğu, bulanık görme, kabızlık',
      interactions: 'Alkol, benzodiazepinler, antidepresanlar ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 402,
      name: 'Cetirizine',
      category: 'antihistamine',
      dosage: '0.25-0.5 mg/kg',
      maxDaily: '20 mg',
      frequency: 'Günde bir kez',
      description: 'H1 antagonisti, non-sedatif',
      contraindications: 'Cetirizine alerjisi, şiddetli böbrek yetmezliği',
      sideEffects: 'Uyku hali, ağız kuruluğu, baş ağrısı, yorgunluk',
      interactions: 'Alkol, sedatifler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 403,
      name: 'Loratadine',
      category: 'antihistamine',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '20 mg',
      frequency: 'Günde bir kez',
      description: 'H1 antagonisti, non-sedatif',
      contraindications: 'Loratadine alerjisi, şiddetli karaciğer yetmezliği',
      sideEffects: 'Baş ağrısı, yorgunluk, ağız kuruluğu, bulantı',
      interactions: 'Eritromisin, ketokonazol ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 404,
      name: 'Fexofenadine',
      category: 'antihistamine',
      dosage: '1-2 mg/kg',
      maxDaily: '180 mg',
      frequency: 'Günde bir kez',
      description: 'H1 antagonisti, non-sedatif',
      contraindications: 'Fexofenadine alerjisi',
      sideEffects: 'Baş ağrısı, yorgunluk, bulantı, dispepsi',
      interactions: 'Alüminyum, magnezyum içeren antasitler ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 405,
      name: 'Desloratadine',
      category: 'antihistamine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '10 mg',
      frequency: 'Günde bir kez',
      description: 'H1 antagonisti, non-sedatif',
      contraindications: 'Desloratadine alerjisi',
      sideEffects: 'Baş ağrısı, yorgunluk, ağız kuruluğu, bulantı',
      interactions: 'Eritromisin, ketokonazol ile etkileşim',
      pregnancyCategory: 'C - Hamilelikte dikkatli kullanım',
    },
    {
      id: 406,
      name: 'Levocetirizine',
      category: 'antihistamine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '10 mg',
      frequency: 'Günde bir kez',
      description: 'H1 antagonisti, non-sedatif',
      contraindications: 'Levocetirizine alerjisi, şiddetli böbrek yetmezliği',
      sideEffects: 'Uyku hali, ağız kuruluğu, baş ağrısı, yorgunluk',
      interactions: 'Alkol, sedatifler ile etkileşim',
      pregnancyCategory: 'B - Hamilelikte güvenli',
    },
    {
      id: 407,
      name: 'Bilastine',
      category: 'antihistamine',
      dosage: '1-2 mg/kg',
      maxDaily: '40 mg',
      description: 'H1 antagonisti, non-sedatif',
    },
    {
      id: 408,
      name: 'Rupatadine',
      category: 'antihistamine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      description: 'H1 antagonisti, non-sedatif',
    },
    {
      id: 409,
      name: 'Ebastine',
      category: 'antihistamine',
      dosage: '0.2-0.4 mg/kg',
      maxDaily: '20 mg',
      description: 'H1 antagonisti, non-sedatif',
    },
    {
      id: 410,
      name: 'Mizolastine',
      category: 'antihistamine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      description: 'H1 antagonisti, non-sedatif',
    },
    {
      id: 411,
      name: 'Azelastine',
      category: 'antihistamine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '4 mg',
      description: 'H1 antagonisti, topikal',
    },
    {
      id: 412,
      name: 'Olopatadine',
      category: 'antihistamine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '10 mg',
      description: 'H1 antagonisti, topikal',
    },
    {
      id: 413,
      name: 'Ketotifen',
      category: 'antihistamine',
      dosage: '0.02-0.04 mg/kg',
      maxDaily: '4 mg',
      description: 'H1 antagonisti, mast hücre stabilizatörü',
    },
    {
      id: 414,
      name: 'Cromolyn Sodium',
      category: 'antihistamine',
      dosage: '1-2 mg/kg',
      maxDaily: '160 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 415,
      name: 'Nedocromil',
      category: 'antihistamine',
      dosage: '1-2 mg/kg',
      maxDaily: '16 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 416,
      name: 'Lodoxamide',
      category: 'antihistamine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '8 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 417,
      name: 'Pemirolast',
      category: 'antihistamine',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '20 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 418,
      name: 'Tranilast',
      category: 'antihistamine',
      dosage: '5-10 mg/kg',
      maxDaily: '600 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 419,
      name: 'Repirinast',
      category: 'antihistamine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '150 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 420,
      name: 'Ibudilast',
      category: 'antihistamine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '60 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 421,
      name: 'Amlexanox',
      category: 'antihistamine',
      dosage: '0.5-1 mg/kg',
      maxDaily: '200 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 422,
      name: 'Disodium Cromoglycate',
      category: 'antihistamine',
      dosage: '1-2 mg/kg',
      maxDaily: '160 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 423,
      name: 'Sodium Cromoglycate',
      category: 'antihistamine',
      dosage: '1-2 mg/kg',
      maxDaily: '160 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 424,
      name: 'Cromoglicic Acid',
      category: 'antihistamine',
      dosage: '1-2 mg/kg',
      maxDaily: '160 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 425,
      name: 'Cromolyn',
      category: 'antihistamine',
      dosage: '1-2 mg/kg',
      maxDaily: '160 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 426,
      name: 'Cromoglycate',
      category: 'antihistamine',
      dosage: '1-2 mg/kg',
      maxDaily: '160 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 427,
      name: 'Cromolyn Sodium',
      category: 'antihistamine',
      dosage: '1-2 mg/kg',
      maxDaily: '160 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 428,
      name: 'Cromolyn Disodium',
      category: 'antihistamine',
      dosage: '1-2 mg/kg',
      maxDaily: '160 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 429,
      name: 'Cromolyn Disodium Salt',
      category: 'antihistamine',
      dosage: '1-2 mg/kg',
      maxDaily: '160 mg',
      description: 'Mast hücre stabilizatörü',
    },
    {
      id: 430,
      name: 'Cromolyn Disodium Salt',
      category: 'antihistamine',
      dosage: '1-2 mg/kg',
      maxDaily: '160 mg',
      description: 'Mast hücre stabilizatörü',
    },

    // Vitamins & Supplements (Vitaminler ve Takviyeler)
    {
      id: 431,
      name: 'Vitamin D3',
      category: 'vitamin',
      dosage: '400-1000 IU',
      maxDaily: '4000 IU',
      frequency: 'Günde bir kez',
      description: 'Kalsiyum emilimi için',
      contraindications: 'Hiperkalsemi, hiperkalsiüri, böbrek taşı',
      sideEffects: 'Hiperkalsemi, böbrek taşı, bulantı, kusma',
      interactions: 'Kalsiyum takviyeleri, diüretikler ile etkileşim',
      pregnancyCategory: 'A - Hamilelikte güvenli',
    },
    {
      id: 432,
      name: 'Folic Acid',
      category: 'vitamin',
      dosage: '0.4-1 mg',
      maxDaily: '5 mg',
      frequency: 'Günde bir kez',
      description: 'B9 vitamini, folat',
      contraindications: 'Folic acid alerjisi, pernisiyöz anemi',
      sideEffects: 'Bulantı, karın ağrısı, uykusuzluk, irritabilite',
      interactions: 'Methotrexate, antikonvülzanlar ile etkileşim',
      pregnancyCategory: 'A - Hamilelikte güvenli',
    },
    {
      id: 433,
      name: 'Iron Sulfate',
      category: 'vitamin',
      dosage: '3-6 mg/kg',
      maxDaily: '200 mg',
      frequency: 'Günde 1-2 kez',
      description: 'Demir eksikliği anemisi',
      contraindications: 'Hemokromatozis, hemolitik anemi',
      sideEffects: 'Kabızlık, bulantı, karın ağrısı, siyah dışkı',
      interactions: 'Antasitler, kalsiyum, çay ile etkileşim',
      pregnancyCategory: 'A - Hamilelikte güvenli',
    },
    {
      id: 434,
      name: 'Vitamin B12',
      category: 'vitamin',
      dosage: '0.5-1 mcg/kg',
      maxDaily: '1000 mcg',
      frequency: 'Günde bir kez',
      description: 'B12 vitamini, kobalamin',
      contraindications: 'Vitamin B12 alerjisi',
      sideEffects: 'Bulantı, kusma, ishal, baş ağrısı',
      interactions: 'Metformin, proton pompa inhibitörleri ile etkileşim',
      pregnancyCategory: 'A - Hamilelikte güvenli',
    },
    {
      id: 435,
      name: 'Vitamin B1',
      category: 'vitamin',
      dosage: '0.5-1 mg/kg',
      maxDaily: '100 mg',
      frequency: 'Günde bir kez',
      description: 'B1 vitamini, tiamin',
      contraindications: 'Vitamin B1 alerjisi',
      sideEffects: 'Bulantı, kusma, karın ağrısı, baş ağrısı',
      interactions: 'Alkol, diüretikler ile etkileşim',
      pregnancyCategory: 'A - Hamilelikte güvenli',
    },
    {
      id: 436,
      name: 'Vitamin B2',
      category: 'vitamin',
      dosage: '0.5-1 mg/kg',
      maxDaily: '100 mg',
      frequency: 'Günde bir kez',
      description: 'B2 vitamini, riboflavin',
      contraindications: 'Vitamin B2 alerjisi',
      sideEffects: 'Sarı idrar, bulantı, karın ağrısı',
      interactions: 'Antasitler, alkol ile etkileşim',
      pregnancyCategory: 'A - Hamilelikte güvenli',
    },
    {
      id: 437,
      name: 'Vitamin B3',
      category: 'vitamin',
      dosage: '5-10 mg/kg',
      maxDaily: '1000 mg',
      description: 'B3 vitamini, niasin',
    },
    {
      id: 438,
      name: 'Vitamin B5',
      category: 'vitamin',
      dosage: '2-5 mg/kg',
      maxDaily: '500 mg',
      description: 'B5 vitamini, pantotenik asit',
    },
    {
      id: 439,
      name: 'Vitamin B6',
      category: 'vitamin',
      dosage: '0.5-1 mg/kg',
      maxDaily: '100 mg',
      description: 'B6 vitamini, piridoksin',
    },
    {
      id: 440,
      name: 'Vitamin B7',
      category: 'vitamin',
      dosage: '0.03-0.1 mg/kg',
      maxDaily: '10 mg',
      description: 'B7 vitamini, biotin',
    },
    {
      id: 441,
      name: 'Vitamin C',
      category: 'vitamin',
      dosage: '10-20 mg/kg',
      maxDaily: '2000 mg',
      description: 'C vitamini, askorbik asit',
    },
    {
      id: 442,
      name: 'Vitamin A',
      category: 'vitamin',
      dosage: '0.5-1 mg/kg',
      maxDaily: '10 mg',
      description: 'A vitamini, retinol',
    },
    {
      id: 443,
      name: 'Vitamin E',
      category: 'vitamin',
      dosage: '0.5-1 mg/kg',
      maxDaily: '1000 mg',
      description: 'E vitamini, tokoferol',
    },
    {
      id: 444,
      name: 'Vitamin K1',
      category: 'vitamin',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '10 mg',
      description: 'K1 vitamini, filokinon',
    },
    {
      id: 445,
      name: 'Vitamin K2',
      category: 'vitamin',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '10 mg',
      description: 'K2 vitamini, menakinon',
    },
    {
      id: 446,
      name: 'Calcium',
      category: 'vitamin',
      dosage: '10-20 mg/kg',
      maxDaily: '2500 mg',
      description: 'Kalsiyum, kemik sağlığı',
    },
    {
      id: 447,
      name: 'Magnesium',
      category: 'vitamin',
      dosage: '5-10 mg/kg',
      maxDaily: '1000 mg',
      description: 'Magnezyum, kas ve sinir sağlığı',
    },
    {
      id: 448,
      name: 'Zinc',
      category: 'vitamin',
      dosage: '0.5-1 mg/kg',
      maxDaily: '40 mg',
      description: 'Çinko, bağışıklık sistemi',
    },
    {
      id: 449,
      name: 'Selenium',
      category: 'vitamin',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '400 mcg',
      description: 'Selenyum, antioksidan',
    },
    {
      id: 450,
      name: 'Copper',
      category: 'vitamin',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '10 mg',
      description: 'Bakır, enzim aktivitesi',
    },
    {
      id: 451,
      name: 'Manganese',
      category: 'vitamin',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '11 mg',
      description: 'Manganez, kemik sağlığı',
    },
    {
      id: 452,
      name: 'Chromium',
      category: 'vitamin',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Krom, glukoz metabolizması',
    },
    {
      id: 453,
      name: 'Molybdenum',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '2000 mcg',
      description: 'Molibden, enzim aktivitesi',
    },
    {
      id: 454,
      name: 'Iodine',
      category: 'vitamin',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '1100 mcg',
      description: 'İyot, tiroid fonksiyonu',
    },
    {
      id: 455,
      name: 'Fluoride',
      category: 'vitamin',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '10 mg',
      description: 'Florür, diş sağlığı',
    },
    {
      id: 456,
      name: 'Boron',
      category: 'vitamin',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '20 mg',
      description: 'Bor, kemik sağlığı',
    },
    {
      id: 457,
      name: 'Silicon',
      category: 'vitamin',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '50 mg',
      description: 'Silikon, kemik sağlığı',
    },
    {
      id: 458,
      name: 'Vanadium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1800 mcg',
      description: 'Vanadyum, glukoz metabolizması',
    },
    {
      id: 459,
      name: 'Nickel',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Nikel, enzim aktivitesi',
    },
    {
      id: 460,
      name: 'Tin',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Kalay, enzim aktivitesi',
    },
    {
      id: 461,
      name: 'Cobalt',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Kobalt, B12 vitamini',
    },
    {
      id: 462,
      name: 'Aluminum',
      category: 'vitamin',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '50 mg',
      description: 'Alüminyum, kemik sağlığı',
    },
    {
      id: 463,
      name: 'Arsenic',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Arsenik, enzim aktivitesi',
    },
    {
      id: 464,
      name: 'Barium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Baryum, kemik sağlığı',
    },
    {
      id: 465,
      name: 'Bismuth',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Bizmut, mide sağlığı',
    },
    {
      id: 466,
      name: 'Cadmium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Kadmiyum, enzim aktivitesi',
    },
    {
      id: 467,
      name: 'Lead',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Kurşun, kemik sağlığı',
    },
    {
      id: 468,
      name: 'Mercury',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Cıva, enzim aktivitesi',
    },
    {
      id: 469,
      name: 'Silver',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Gümüş, antimikrobiyal',
    },
    {
      id: 470,
      name: 'Gold',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Altın, anti-inflamatuar',
    },
    {
      id: 471,
      name: 'Platinum',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Platin, antikanser',
    },
    {
      id: 472,
      name: 'Palladium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Paladyum, katalizör',
    },
    {
      id: 473,
      name: 'Rhodium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Rodyum, katalizör',
    },
    {
      id: 474,
      name: 'Ruthenium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Rutenyum, katalizör',
    },
    {
      id: 475,
      name: 'Osmium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Osmiyum, katalizör',
    },
    {
      id: 476,
      name: 'Iridium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'İridyum, katalizör',
    },
    {
      id: 477,
      name: 'Titanium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Titanyum, kemik sağlığı',
    },
    {
      id: 478,
      name: 'Zirconium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Zirkonyum, kemik sağlığı',
    },
    {
      id: 479,
      name: 'Hafnium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Hafniyum, nükleer',
    },
    {
      id: 480,
      name: 'Tantalum',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Tantal, kemik sağlığı',
    },
    {
      id: 481,
      name: 'Tungsten',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Tungsten, enzim aktivitesi',
    },
    {
      id: 482,
      name: 'Rhenium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Renyum, katalizör',
    },
    {
      id: 483,
      name: 'Osmium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Osmiyum, katalizör',
    },
    {
      id: 484,
      name: 'Iridium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'İridyum, katalizör',
    },
    {
      id: 485,
      name: 'Platinum',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Platin, antikanser',
    },
    {
      id: 486,
      name: 'Gold',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Altın, anti-inflamatuar',
    },
    {
      id: 487,
      name: 'Silver',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Gümüş, antimikrobiyal',
    },
    {
      id: 488,
      name: 'Mercury',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Cıva, enzim aktivitesi',
    },
    {
      id: 489,
      name: 'Lead',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Kurşun, kemik sağlığı',
    },
    {
      id: 490,
      name: 'Cadmium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Kadmiyum, enzim aktivitesi',
    },
    {
      id: 491,
      name: 'Bismuth',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Bizmut, mide sağlığı',
    },
    {
      id: 492,
      name: 'Barium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Baryum, kemik sağlığı',
    },
    {
      id: 493,
      name: 'Arsenic',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Arsenik, enzim aktivitesi',
    },
    {
      id: 494,
      name: 'Aluminum',
      category: 'vitamin',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '50 mg',
      description: 'Alüminyum, kemik sağlığı',
    },
    {
      id: 495,
      name: 'Cobalt',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Kobalt, B12 vitamini',
    },
    {
      id: 496,
      name: 'Tin',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Kalay, enzim aktivitesi',
    },
    {
      id: 497,
      name: 'Nickel',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1000 mcg',
      description: 'Nikel, enzim aktivitesi',
    },
    {
      id: 498,
      name: 'Vanadium',
      category: 'vitamin',
      dosage: '0.001-0.002 mg/kg',
      maxDaily: '1800 mcg',
      description: 'Vanadyum, glukoz metabolizması',
    },
    {
      id: 499,
      name: 'Silicon',
      category: 'vitamin',
      dosage: '0.1-0.2 mg/kg',
      maxDaily: '50 mg',
      description: 'Silikon, kemik sağlığı',
    },
    {
      id: 500,
      name: 'Boron',
      category: 'vitamin',
      dosage: '0.01-0.02 mg/kg',
      maxDaily: '20 mg',
      description: 'Bor, kemik sağlığı',
    },
  ];

  const categories = [
    { id: 'all', name: 'Tümü', icon: '💊', color: '#4A90E2' },
    { id: 'analgesic', name: 'Ağrı Kesici', icon: '🩹', color: '#FF6B6B' },
    { id: 'antibiotic', name: 'Antibiyotik', icon: '🦠', color: '#4ECDC4' },
    { id: 'opioid', name: 'Opioid', icon: '💉', color: '#45B7D1' },
    { id: 'cardiac', name: 'Kardiyak', icon: '❤️', color: '#FF9F43' },
    { id: 'diuretic', name: 'Diüretik', icon: '💧', color: '#6C5CE7' },
    {
      id: 'gastrointestinal',
      name: 'Gastrointestinal',
      icon: '🫀',
      color: '#A29BFE',
    },
    { id: 'respiratory', name: 'Solunum', icon: '🫁', color: '#FD79A8' },
    { id: 'neurological', name: 'Nörolojik', icon: '🧠', color: '#FDCB6E' },
    { id: 'endocrine', name: 'Endokrin', icon: '⚕️', color: '#E17055' },
    { id: 'antihistamine', name: 'Antihistamin', icon: '🤧', color: '#74B9FF' },
    { id: 'vitamin', name: 'Vitamin', icon: '💊', color: '#00B894' },
  ];

  const filteredDrugs = drugs.filter(drug => {
    const matchesSearch = drug.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || drug.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDrugSelect = (drug: any) => {
    setSelectedDrug(drug);
    navigation.navigate('DrugDetail', { drug });
  };

  const handleContinue = () => {
    if (!selectedDrug) {
      Alert.alert('Lütfen bir ilaç seçin');
      return;
    }
    navigation.navigate('DosageCalculation', { selectedDrug });
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 50,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Geri Butonu */}
      <TouchableOpacity 
        style={styles.backButtonTop}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonIcon}>‹</Text>
      </TouchableOpacity>
      
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>💊 İlaç Seçimi</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>🔍 İlaç Ara</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="İlaç adını yazın..."
              placeholderTextColor="#A0AEC0"
            />
            <View style={styles.searchIcon}>
              <Text style={styles.searchIconText}>🔍</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>📂 Kategori Seçin</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id &&
                    styles.categoryButtonSelected,
                  { borderColor: category.color },
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id &&
                      styles.categoryTextSelected,
                    {
                      color:
                        selectedCategory === category.id
                          ? category.color
                          : '#4a5568',
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            💊 İlaç Listesi ({filteredDrugs.length} ilaç)
          </Text>
          {filteredDrugs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>🔍 İlaç bulunamadı</Text>
              <Text style={styles.emptyStateSubtext}>
                Farklı bir arama terimi deneyin
              </Text>
            </View>
          ) : (
            filteredDrugs.map(drug => {
              const categoryInfo = categories.find(
                cat => cat.id === drug.category
              );
              return (
                <TouchableOpacity
                  key={drug.id}
                  style={[
                    styles.drugItem,
                    selectedDrug?.id === drug.id && styles.drugItemSelected,
                  ]}
                  onPress={() => handleDrugSelect(drug)}
                >
                  <View style={styles.drugHeader}>
                    <View style={styles.drugIconContainer}>
                      <Text style={styles.drugIcon}>
                        {categoryInfo?.icon || '💊'}
                      </Text>
                    </View>
                    <View style={styles.drugInfo}>
                      <Text
                        style={[
                          styles.drugName,
                          selectedDrug?.id === drug.id &&
                            styles.drugNameSelected,
                        ]}
                      >
                        {drug.name}
                      </Text>
                      <Text style={styles.drugDescription}>
                        {drug.description}
                      </Text>
                    </View>
                    {selectedDrug?.id === drug.id && (
                      <View style={styles.selectedIconContainer}>
                        <Text style={styles.selectedIcon}>✓</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.drugDetails}>
                    <View style={styles.drugDetailRow}>
                      <Text style={styles.drugDetailLabel}>📏 Doz:</Text>
                      <Text style={styles.drugDetailValue}>{drug.dosage}</Text>
                    </View>
                    <View style={styles.drugDetailRow}>
                      <Text style={styles.drugDetailLabel}>⚠️ Max Günlük:</Text>
                      <Text style={styles.drugDetailValue}>
                        {drug.maxDaily}
                      </Text>
                    </View>
                    <View style={styles.drugDetailRow}>
                      <Text style={styles.drugDetailLabel}>🏷️ Kategori:</Text>
                      <Text
                        style={[
                          styles.drugDetailValue,
                          { color: categoryInfo?.color || '#4A90E2' },
                        ]}
                      >
                        {categoryInfo?.name || drug.category}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {selectedDrug && (
          <View style={styles.selectedDrugInfo}>
            <Text style={styles.selectedDrugTitle}>Seçilen İlaç:</Text>
            <Text style={styles.selectedDrugName}>{selectedDrug.name}</Text>
            <Text style={styles.selectedDrugDetails}>
              Doz: {selectedDrug.dosage} | Max Günlük: {selectedDrug.maxDaily}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>➡️ Devam Et</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

// İlaç Detay Ekranı
function DrugDetailScreen({ navigation, route }: any) {
  const { colors } = useContext(ThemeContext);
  const { drug } = route.params;
  const [isSelected, setIsSelected] = useState(false);

  const handleSelectDrug = () => {
    setIsSelected(true);
    Alert.alert(
      'İlaç Seçildi',
      `${drug.name} başarıyla seçildi. Hasta bilgileri ekranına yönlendiriliyorsunuz.`,
      [
        {
          text: 'Tamam',
          onPress: () =>
            navigation.navigate('PatientInfo', { selectedDrug: drug }),
        },
      ]
    );
  };

  const getCategoryInfo = (category: string) => {
    const categoryMap: any = {
      analgesic: { name: 'Ağrı Kesici', icon: '💊', color: '#FF6B6B' },
      antibiotic: { name: 'Antibiyotik', icon: '🦠', color: '#4ECDC4' },
      opioid: { name: 'Opioid', icon: '⚠️', color: '#FF8E53' },
      cardiovascular: { name: 'Kardiyovasküler', icon: '❤️', color: '#FF6B6B' },
      diuretic: { name: 'Diüretik', icon: '💧', color: '#45B7D1' },
      gastrointestinal: {
        name: 'Gastrointestinal',
        icon: '🫁',
        color: '#96CEB4',
      },
      respiratory: { name: 'Solunum', icon: '🫁', color: '#FFEAA7' },
      neurological: { name: 'Nörolojik', icon: '🧠', color: '#DDA0DD' },
      endocrine: { name: 'Endokrin', icon: '⚖️', color: '#98D8C8' },
      antihistamine: { name: 'Antihistaminik', icon: '🤧', color: '#F7DC6F' },
      vitamin: { name: 'Vitamin', icon: '💊', color: '#85C1E9' },
      other: { name: 'Diğer', icon: '💊', color: '#D5DBDB' },
    };
    return (
      categoryMap[category] || {
        name: 'Bilinmiyor',
        icon: '💊',
        color: '#D5DBDB',
      }
    );
  };

  const categoryInfo = getCategoryInfo(drug.category);

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 50,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Geri Butonu */}
      <TouchableOpacity 
        style={styles.backButtonTop}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonIcon}>‹</Text>
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💊 İlaç Detayı</Text>
      </View>

      <View style={styles.drugDetailCard}>
        <View style={styles.drugHeaderDetail}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: categoryInfo.color },
            ]}
          >
            <Text style={styles.categoryIcon}>{categoryInfo.icon}</Text>
            <Text style={styles.categoryName}>{categoryInfo.name}</Text>
          </View>
          <Text style={styles.drugNameDetail}>{drug.name}</Text>
          <Text style={styles.drugDescriptionDetail}>{drug.description}</Text>
        </View>

        <View style={styles.drugInfoSection}>
          <Text style={styles.sectionTitleDetail}>📋 Dozaj Bilgileri</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>💊 Dozaj:</Text>
            <Text style={styles.infoValue}>{drug.dosage}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📊 Maksimum Günlük Doz:</Text>
            <Text style={styles.infoValue}>{drug.maxDaily}</Text>
          </View>

          {drug.frequency && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>⏰ Kullanım Sıklığı:</Text>
              <Text style={styles.infoValue}>{drug.frequency}</Text>
            </View>
          )}

          {drug.contraindications && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>⚠️ Kontrendikasyonlar:</Text>
              <Text style={styles.infoValue}>{drug.contraindications}</Text>
            </View>
          )}

          {drug.sideEffects && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🚨 Yan Etkiler:</Text>
              <Text style={styles.infoValue}>{drug.sideEffects}</Text>
            </View>
          )}

          {drug.interactions && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>⚡ İlaç Etkileşimleri:</Text>
              <Text style={styles.infoValue}>{drug.interactions}</Text>
            </View>
          )}

          {drug.pregnancyCategory && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🤱 Hamilelik Kategorisi:</Text>
              <Text style={styles.infoValue}>{drug.pregnancyCategory}</Text>
            </View>
          )}
        </View>

        <View style={styles.drugInfoSection}>
          <Text style={styles.sectionTitleDetail}>📝 Kullanım Talimatları</Text>
          <Text style={styles.instructionsText}>
            • Dozaj hesaplaması için hasta bilgilerini girin{'\n'}• Yaş, kilo ve
            diğer faktörler dozajı etkiler{'\n'}• Doktor onayı olmadan
            kullanmayın{'\n'}• Yan etkiler görüldüğünde hemen doktora başvurun
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.selectButton,
            isSelected && styles.selectButtonSelected,
          ]}
          onPress={handleSelectDrug}
        >
          <Text style={styles.selectButtonText}>
            {isSelected ? '✅ Seçildi' : '🎯 Bu İlacı Seç'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Doz Hesaplama Ekranı
function DosageCalculationScreen({ navigation, route }: any) {
  const { selectedDrug, patientData, calculationResult } = route.params || {};
  const [showResult, setShowResult] = React.useState(true);

  const saveCalculation = () => {
    if (calculationResult) {
      Alert.alert(
        'Hesaplama Kaydedildi',
        'Doza hesaplama geçmişe kaydedildi.',
        [{ text: 'Tamam' }]
      );
    }
  };

  const editPatientInfo = () => {
    navigation.navigate('PatientInfo', { 
      selectedDrug, 
      patientData,
      isEditing: true 
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>📊 Doz Hesaplama Sonuçları</Text>

        {selectedDrug && (
          <View style={styles.selectedDrugCard}>
            <Text style={styles.selectedDrugTitle}>Seçilen İlaç:</Text>
            <Text style={styles.selectedDrugName}>{selectedDrug.name}</Text>
            <Text style={styles.selectedDrugDetails}>
              Doz: {selectedDrug.dosage} | Max Günlük: {selectedDrug.maxDaily}
            </Text>
          </View>
        )}

        {patientData && (
          <View style={styles.patientDataCard}>
            <Text style={styles.patientDataTitle}>📋 Hasta Bilgileri:</Text>
            <Text style={styles.patientDataText}>
              Yaş: {patientData.age} yaş
            </Text>
            <Text style={styles.patientDataText}>
              Kilo: {patientData.weight} kg
            </Text>
            <Text style={styles.patientDataText}>
              Boy: {patientData.height} cm
            </Text>
            <Text style={styles.patientDataText}>
              Cinsiyet: {patientData.gender === 'male' ? 'Erkek' : 'Kadın'}
            </Text>
            <Text style={styles.patientDataText}>
              Tip:{' '}
              {patientData.patientType === 'adult'
                ? 'Yetişkin'
                : patientData.patientType === 'child'
                  ? 'Çocuk'
                  : patientData.patientType === 'neonatal'
                    ? 'Yenidoğan'
                    : 'Yaşlı'}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={editPatientInfo}
            >
              <Text style={styles.editButtonText}>✏️ Bilgileri Düzenle</Text>
            </TouchableOpacity>
          </View>
        )}

        {!calculationResult && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              💡 Doz hesaplama sonuçları görüntülenemiyor. Lütfen hasta bilgileri ekranından hesaplama yapın.
            </Text>
          </View>
        )}

        {showResult && calculationResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>📊 Hesaplama Sonucu</Text>

            <View style={styles.resultCard}>
              <Text style={styles.resultDrugName}>
                {calculationResult.drugName}
              </Text>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Tek Doz:</Text>
                <Text style={styles.resultValue}>
                  {calculationResult.singleDose} mg
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Maksimum Günlük:</Text>
                <Text style={styles.resultValue}>
                  {calculationResult.maxDailyDose} mg
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Kullanım Sıklığı:</Text>
                <Text style={styles.resultValue}>
                  {calculationResult.frequency}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Hasta Kilosu:</Text>
                <Text style={styles.resultValue}>
                  {calculationResult.weight} kg
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>BMI:</Text>
                <Text style={styles.resultValue}>
                  {calculationResult.bmi} kg/m²
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Creatinine:</Text>
                <Text style={styles.resultValue}>
                  {calculationResult.creatinine} mg/dL
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>CRCL:</Text>
                <Text style={styles.resultValue}>
                  {calculationResult.crcl} mL/min
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Doz Ayar Faktörü:</Text>
                <Text style={styles.resultValue}>
                  {calculationResult.adjustmentFactor}x
                </Text>
              </View>
            </View>

            {calculationResult.warnings.length > 0 && (
              <View style={styles.warningContainer}>
                <Text style={styles.warningTitle}>⚠️ Uyarılar:</Text>
                {calculationResult.warnings.map((warning, index) => (
                  <Text key={index} style={styles.warningText}>
                    • {warning}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.safetyIndicator}>
              <Text
                style={[
                  styles.safetyText,
                  calculationResult.isSafe
                    ? styles.safeText
                    : styles.unsafeText,
                ]}
              >
                {calculationResult.isSafe
                  ? '✅ Güvenli Doz'
                  : '⚠️ Dikkatli Kullanın'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.saveResultButton}
              onPress={saveCalculation}
            >
              <Text style={styles.saveResultButtonText}>💾 Sonucu Kaydet</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </ScrollView>
  );
}

// Geçmiş Ekranı
function HistoryScreen({ navigation }: any) {
  const { colors } = useContext(ThemeContext);
  const [searchText, setSearchText] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState('all');

  // Örnek hesaplama geçmişi
  const [historyData] = React.useState([
    {
      id: 1,
      drugName: 'Paracetamol',
      patientWeight: 70,
      singleDose: 1050,
      maxDailyDose: 4200,
      frequency: '4 kez/gün',
      date: '2024-01-15',
      time: '14:30',
      isSafe: true,
      warnings: [],
    },
    {
      id: 2,
      drugName: 'Aspirin',
      patientWeight: 65,
      singleDose: 812,
      maxDailyDose: 2436,
      frequency: '3 kez/gün',
      date: '2024-01-14',
      time: '09:15',
      isSafe: true,
      warnings: [],
    },
    {
      id: 3,
      drugName: 'Ibuprofen',
      patientWeight: 45,
      singleDose: 337,
      maxDailyDose: 1012,
      frequency: '3 kez/gün',
      date: '2024-01-13',
      time: '16:45',
      isSafe: true,
      warnings: ['Düşük kilo! Pediatrik doz kontrolü gerekli.'],
    },
    {
      id: 4,
      drugName: 'Amoxicillin',
      patientWeight: 80,
      singleDose: 3000,
      maxDailyDose: 9000,
      frequency: '3 kez/gün',
      date: '2024-01-12',
      time: '11:20',
      isSafe: false,
      warnings: [
        'Yüksek doz! Dikkatli kullanın.',
        'Yüksek kilo! Maksimum doz sınırını kontrol edin.',
      ],
    },
    {
      id: 5,
      drugName: 'Morphine',
      patientWeight: 60,
      singleDose: 6,
      maxDailyDose: 120,
      frequency: '4 kez/gün',
      date: '2024-01-11',
      time: '08:30',
      isSafe: true,
      warnings: [],
    },
  ]);

  const filters = [
    { id: 'all', name: 'Tümü' },
    { id: 'safe', name: 'Güvenli' },
    { id: 'warning', name: 'Uyarılı' },
    { id: 'today', name: 'Bugün' },
    { id: 'week', name: 'Bu Hafta' },
  ];

  const filteredHistory = historyData.filter(item => {
    const matchesSearch = item.drugName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    let matchesFilter = true;

    switch (selectedFilter) {
      case 'safe':
        matchesFilter = item.isSafe && item.warnings.length === 0;
        break;
      case 'warning':
        matchesFilter = !item.isSafe || item.warnings.length > 0;
        break;
      case 'today':
        matchesFilter = item.date === '2024-01-15';
        break;
      case 'week':
        // Bu hafta kontrolü (basitleştirilmiş)
        matchesFilter = [
          '2024-01-15',
          '2024-01-14',
          '2024-01-13',
          '2024-01-12',
          '2024-01-11',
        ].includes(item.date);
        break;
    }

    return matchesSearch && matchesFilter;
  });

  const formatDate = (date, time) => {
    return `${date} ${time}`;
  };

  const getSafetyIcon = (isSafe, warnings) => {
    if (!isSafe || warnings.length > 0) return '⚠️';
    return '✅';
  };

  const getSafetyColor = (isSafe, warnings) => {
    if (!isSafe || warnings.length > 0) return '#FF6B6B';
    return '#4ECDC4';
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 50,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Geri Butonu */}
      <TouchableOpacity 
        style={styles.backButtonTop}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonIcon}>‹</Text>
      </TouchableOpacity>
      
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>📊 Hesaplama Geçmişi</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ara</Text>
          <TextInput
            style={styles.input}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="İlaç adı ile ara..."
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Filtrele</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {filters.map(filter => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.categoryButton,
                  selectedFilter === filter.id && styles.categoryButtonSelected,
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedFilter === filter.id && styles.categoryTextSelected,
                  ]}
                >
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kayıtlar ({filteredHistory.length})</Text>
          {filteredHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                📝 Henüz hesaplama kaydı yok
              </Text>
              <Text style={styles.emptyStateSubtext}>
                İlk hesaplamanızı yapmak için ana sayfaya dönün
              </Text>
            </View>
          ) : (
            filteredHistory.map(item => (
              <TouchableOpacity key={item.id} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDrugName}>{item.drugName}</Text>
                  <Text
                    style={[
                      styles.historySafetyIcon,
                      { color: getSafetyColor(item.isSafe, item.warnings) },
                    ]}
                  >
                    {getSafetyIcon(item.isSafe, item.warnings)}
                  </Text>
                </View>

                <View style={styles.historyDetails}>
                  <View style={styles.historyRow}>
                    <Text style={styles.historyLabel}>Tek Doz:</Text>
                    <Text style={styles.historyValue}>
                      {item.singleDose} mg
                    </Text>
                  </View>

                  <View style={styles.historyRow}>
                    <Text style={styles.historyLabel}>Max Günlük:</Text>
                    <Text style={styles.historyValue}>
                      {item.maxDailyDose} mg
                    </Text>
                  </View>

                  <View style={styles.historyRow}>
                    <Text style={styles.historyLabel}>Sıklık:</Text>
                    <Text style={styles.historyValue}>{item.frequency}</Text>
                  </View>

                  <View style={styles.historyRow}>
                    <Text style={styles.historyLabel}>Kilo:</Text>
                    <Text style={styles.historyValue}>
                      {item.patientWeight} kg
                    </Text>
                  </View>

                  <View style={styles.historyRow}>
                    <Text style={styles.historyLabel}>Tarih:</Text>
                    <Text style={styles.historyValue}>
                      {formatDate(item.date, item.time)}
                    </Text>
                  </View>
                </View>

                {item.warnings.length > 0 && (
                  <View style={styles.historyWarnings}>
                    <Text style={styles.historyWarningTitle}>Uyarılar:</Text>
                    {item.warnings.map((warning, index) => (
                      <Text key={index} style={styles.historyWarningText}>
                        • {warning}
                      </Text>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

      </View>
    </ScrollView>
  );
}

// Ayarlar Ekranı
function SettingsScreen({ navigation }: any) {
  const { isDark, toggleTheme, colors } = useContext(ThemeContext);
  const { language, setLanguage, t } = useContext(LanguageContext);
  const [notifications, setNotifications] = React.useState(true);
  const [autoSave, setAutoSave] = React.useState(true);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const languages = [
    { id: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { id: 'en', name: 'English', flag: '🇺🇸' },
  ];

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    Alert.alert(
      `Dil değiştirildi: ${languages.find(l => l.id === lang)?.name}`
    );
  };

  const handleThemeToggle = () => {
    toggleTheme();
    Alert.alert(
      `Tema değiştirildi: ${isDark ? 'Açık Tema' : 'Koyu Tema'}`
    );
  };

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
    Alert.alert(`Bildirimler ${!notifications ? 'açıldı' : 'kapatıldı'}`);
  };

  const handleAutoSaveToggle = () => {
    setAutoSave(!autoSave);
    Alert.alert(`Otomatik kaydetme ${!autoSave ? 'açıldı' : 'kapatıldı'}`);
  };

  const handleExportData = () => {
    Alert.alert('Veriler dışa aktarıldı!');
  };

  const handleImportData = () => {
    Alert.alert('Veri içe aktarma özelliği yakında gelecek!');
  };

  const handleClearHistory = () => {
    Alert.alert('Geçmiş temizlendi!');
  };

  const handleAbout = () => {
    Alert.alert(
      'Dosage Calculator v1.0.0\n\nSağlık profesyonelleri için güvenli doz hesaplama uygulaması.\n\nGeliştirici: Erdem Gökmuharremoğlu\nLisans: MIT\n\nBu uygulama sadece eğitim amaçlıdır. Tıbbi tavsiye niteliği taşımaz.'
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 50,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Geri Butonu */}
      <TouchableOpacity 
        style={styles.backButtonTop}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonIcon}>‹</Text>
      </TouchableOpacity>
      
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>⚙️ Ayarlar</Text>

        {/* Dil Ayarları */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>🌍 Dil</Text>
          <View style={styles.settingsGroup}>
            {languages.map(lang => (
              <TouchableOpacity
                key={lang.id}
                style={[
                  styles.settingsOption,
                  language === lang.id && styles.settingsOptionSelected,
                ]}
                onPress={() => handleLanguageChange(lang.id)}
              >
                <Text style={styles.settingsOptionIcon}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.settingsOptionText,
                    language === lang.id && styles.settingsOptionTextSelected,
                  ]}
                >
                  {lang.name}
                </Text>
                {language === lang.id && (
                  <Text style={styles.settingsOptionCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tema Ayarları */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>🎨 Tema</Text>
          <View style={styles.settingsGroup}>
            <TouchableOpacity
              style={[
                styles.settingsOption,
                !isDark && styles.settingsOptionSelected,
              ]}
              onPress={() => !isDark || handleThemeToggle()}
            >
              <Text style={styles.settingsOptionIcon}>☀️</Text>
              <Text
                style={[
                  styles.settingsOptionText,
                  !isDark && styles.settingsOptionTextSelected,
                ]}
              >
                Açık Tema
              </Text>
              {!isDark && (
                <Text style={styles.settingsOptionCheck}>✓</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.settingsOption,
                isDark && styles.settingsOptionSelected,
              ]}
              onPress={() => isDark || handleThemeToggle()}
            >
              <Text style={styles.settingsOptionIcon}>🌙</Text>
              <Text
                style={[
                  styles.settingsOptionText,
                  isDark && styles.settingsOptionTextSelected,
                ]}
              >
                Koyu Tema
              </Text>
              {isDark && (
                <Text style={styles.settingsOptionCheck}>✓</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Bildirim Ayarları */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>🔔 Bildirimler</Text>
          <TouchableOpacity
            style={styles.settingsToggle}
            onPress={handleNotificationToggle}
          >
            <View style={styles.settingsToggleInfo}>
              <Text style={styles.settingsToggleIcon}>🔔</Text>
              <Text style={styles.settingsToggleText}>Bildirimleri Aç</Text>
            </View>
            <View
              style={[
                styles.settingsToggleSwitch,
                notifications && styles.settingsToggleSwitchActive,
              ]}
            >
              <View
                style={[
                  styles.settingsToggleThumb,
                  notifications && styles.settingsToggleThumbActive,
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Otomatik Kaydetme */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>💾 Veri Yönetimi</Text>
          <TouchableOpacity
            style={styles.settingsToggle}
            onPress={handleAutoSaveToggle}
          >
            <View style={styles.settingsToggleInfo}>
              <Text style={styles.settingsToggleIcon}>💾</Text>
              <Text style={styles.settingsToggleText}>Otomatik Kaydet</Text>
            </View>
            <View
              style={[
                styles.settingsToggleSwitch,
                autoSave && styles.settingsToggleSwitchActive,
              ]}
            >
              <View
                style={[
                  styles.settingsToggleThumb,
                  autoSave && styles.settingsToggleThumbActive,
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Gelişmiş Ayarlar */}
        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={styles.advancedToggleText}>
            {showAdvanced ? '🔽' : '▶️'} Gelişmiş Ayarlar
          </Text>
        </TouchableOpacity>

        {showAdvanced && (
          <View style={styles.advancedSettings}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleExportData}
            >
              <Text style={styles.settingsButtonIcon}>📤</Text>
              <Text style={styles.settingsButtonText}>Verileri Dışa Aktar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleImportData}
            >
              <Text style={styles.settingsButtonIcon}>📥</Text>
              <Text style={styles.settingsButtonText}>Veri İçe Aktar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingsButton, styles.settingsButtonDanger]}
              onPress={handleClearHistory}
            >
              <Text style={styles.settingsButtonIcon}>🗑️</Text>
              <Text style={styles.settingsButtonText}>Geçmişi Temizle</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Hakkında */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>ℹ️ Bilgi</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleAbout}>
            <Text style={styles.settingsButtonIcon}>ℹ️</Text>
            <Text style={styles.settingsButtonText}>Uygulama Hakkında</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false, // Header'ı tamamen kaldır
            }}
          >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PatientInfo"
          component={PatientInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DrugSelection"
          component={DrugSelectionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DrugDetail"
          component={DrugDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ChemotherapyDose" options={{ headerShown: false }}>
          {() => (
            <UIThemeProvider>
              <ChemotherapyDoseScreen />
            </UIThemeProvider>
          )}
        </Stack.Screen>
          </Stack.Navigator>
          <StatusBar style="light" backgroundColor="#dc2626" />
        </NavigationContainer>
      </LanguageProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef7f7', // Modern kızılay kırmızısı arka plan
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Daha şeffaf beyaz arka plan
    borderRadius: 24,
    padding: 24,
    shadowColor: '#dc2626',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#fef2f2',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#dc2626',
    marginBottom: 12,
    letterSpacing: -0.5,
    textShadowColor: '#fef2f2',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  medicalIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  medicalIcon: {
    fontSize: 36,
    marginHorizontal: 12,
    opacity: 0.9,
    textShadowColor: '#fef2f2',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#dc2626', // Kızılay kırmızısı
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: '#fef2f2',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 17,
    color: '#7f1d1d', // Koyu kırmızı
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.9,
  },
  redCrossContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
  },
  redCrossText: {
    fontSize: 24,
    marginHorizontal: 8,
    opacity: 0.7,
  },
  menuContainer: {
    flex: 1,
  },
  menuButton: {
    backgroundColor: '#fff',
    padding: 24,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#dc2626',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#fef2f2', // Modern açık kırmızı border
    transform: [{ scale: 1 }],
  },
  menuButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#dc2626', // Kızılay kırmızısı
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  menuButtonSubtext: {
    fontSize: 15,
    color: '#7f1d1d', // Koyu kırmızı
    opacity: 0.75,
    lineHeight: 20,
  },

  // Form Styles
  formContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#dc2626', // Kızılay kırmızısı
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: '#fef2f2',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fef2f2',
    borderRadius: 20,
    paddingHorizontal: 20,
    shadowColor: '#dc2626',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    padding: 18,
    fontSize: 17,
    color: '#1f2937',
    fontWeight: '500',
  },
  inputUnit: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '700',
    marginLeft: 12,
    opacity: 0.8,
  },

  // Radio Button Styles
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  radioButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fef2f2',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#dc2626',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  radioButtonSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#f7fafc',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  radioIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  radioText: {
    fontSize: 16,
    color: '#4a5568',
    fontWeight: '600',
  },
  radioTextSelected: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },

  // Picker Styles
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pickerButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  pickerButtonSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#f7fafc',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pickerIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  pickerText: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: '600',
    textAlign: 'center',
  },
  pickerTextSelected: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },

  // Button Styles
  saveButton: {
    backgroundColor: '#48bb78',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#48bb78',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#4A90E2',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  calculateButton: {
    backgroundColor: '#ed8936',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#ed8936',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Yeni Geri Butonu Stilleri
  backButtonTop: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1000,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#dc2626',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#fef2f2',
  },
  backButtonIcon: {
    fontSize: 28,
    fontWeight: '300',
    color: '#dc2626',
    marginLeft: -2, // İkonu ortalama için
  },
  // Eski Geri Butonu Stilleri (kullanılmıyor)
  backButton: {
    backgroundColor: '#718096',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Search Styles
  searchContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    paddingRight: 50,
    fontSize: 16,
    color: '#2d3748',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIconText: {
    fontSize: 16,
    color: '#fff',
  },

  // Drug Selection Styles
  categoryScroll: {
    marginTop: 10,
  },
  categoryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryButtonSelected: {
    backgroundColor: '#f7fafc',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#4a5568',
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryTextSelected: {
    fontWeight: 'bold',
  },
  drugItem: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  drugItemSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#f7fafc',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  drugHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  drugIconContainer: {
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  drugIcon: {
    fontSize: 24,
  },
  drugInfo: {
    flex: 1,
  },
  drugName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  drugNameSelected: {
    color: '#4A90E2',
  },
  drugDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
  selectedIconContainer: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  drugDetails: {
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  drugDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  drugDetailLabel: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: '500',
  },
  drugDetailValue: {
    fontSize: 14,
    color: '#2d3748',
    fontWeight: '600',
  },
  selectedDrugInfo: {
    backgroundColor: '#ebf8ff',
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
  },
  selectedDrugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 5,
  },
  selectedDrugName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 5,
  },
  selectedDrugDetails: {
    fontSize: 14,
    color: '#718096',
  },
  selectedDrugCard: {
    backgroundColor: '#f7fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },

  // Calculation Result Styles
  resultContainer: {
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  resultDrugName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 16,
    color: '#4a5568',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 16,
    color: '#2d3748',
    fontWeight: 'bold',
  },
  warningContainer: {
    backgroundColor: '#fed7d7',
    borderWidth: 1,
    borderColor: '#feb2b2',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c53030',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#c53030',
    marginBottom: 4,
  },
  safetyIndicator: {
    alignItems: 'center',
    marginBottom: 15,
  },
  safetyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  safeText: {
    color: '#38a169',
  },
  unsafeText: {
    color: '#e53e3e',
  },
  saveResultButton: {
    backgroundColor: '#38a169',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveResultButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // History Styles
  emptyState: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#718096',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
  },
  historyItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyDrugName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  historySafetyIcon: {
    fontSize: 18,
  },
  historyDetails: {
    marginBottom: 10,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  historyLabel: {
    fontSize: 14,
    color: '#718096',
  },
  historyValue: {
    fontSize: 14,
    color: '#2d3748',
    fontWeight: '500',
  },
  historyWarnings: {
    backgroundColor: '#fed7d7',
    borderWidth: 1,
    borderColor: '#feb2b2',
    borderRadius: 8,
    padding: 10,
  },
  historyWarningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#c53030',
    marginBottom: 4,
  },
  historyWarningText: {
    fontSize: 12,
    color: '#c53030',
  },

  // Settings Styles
  settingsSection: {
    marginBottom: 25,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
  },
  settingsGroup: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingsOptionSelected: {
    backgroundColor: '#ebf8ff',
  },
  settingsOptionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingsOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#4a5568',
    fontWeight: '500',
  },
  settingsOptionTextSelected: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  settingsOptionCheck: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  settingsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  settingsToggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsToggleIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingsToggleText: {
    fontSize: 16,
    color: '#4a5568',
    fontWeight: '500',
  },
  settingsToggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    padding: 2,
  },
  settingsToggleSwitchActive: {
    backgroundColor: '#4A90E2',
  },
  settingsToggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  settingsToggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  advancedToggle: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  advancedToggleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a5568',
  },
  advancedSettings: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 15,
    overflow: 'hidden',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingsButtonDanger: {
    borderBottomWidth: 0,
  },
  settingsButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingsButtonText: {
    fontSize: 16,
    color: '#4a5568',
    fontWeight: '500',
  },

  // Yeni eklenen stiller - İlaç Seçimi ve Hesaplama
  drugSelector: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fecaca',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#dc2626',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  drugSelectorText: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '500',
  },
  drugSelectorIcon: {
    fontSize: 16,
    color: '#dc2626',
  },
  drugListContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#dc2626',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  drugList: {
    maxHeight: 200,
  },
  drugOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  drugOptionSelected: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  drugOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4,
  },
  drugOptionDesc: {
    fontSize: 14,
    color: '#991b1b',
  },
  dosageResultContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  dosageResultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 15,
    textAlign: 'center',
  },
  dosageResultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#dc2626',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  dosageResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dosageResultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991b1b',
  },
  dosageResultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
  },

  // Hasta Bilgileri Kartı Stilleri
  patientDataCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#dc2626',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  patientDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  patientDataText: {
    fontSize: 16,
    color: '#991b1b',
    marginBottom: 6,
    fontWeight: '500',
  },

  // Bilgi Mesajı Stilleri
  infoContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  infoText: {
    fontSize: 16,
    color: '#92400e',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Drug Detail Screen Styles
  backButtonDetail: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonTextDetail: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '600',
  },
  drugDetailCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  drugHeaderDetail: {
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 10,
  },
  categoryName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  drugNameDetail: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  drugDescriptionDetail: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  drugInfoSection: {
    marginBottom: 20,
  },
  sectionTitleDetail: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#dc2626',
    paddingBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    flex: 2,
    textAlign: 'right',
  },
  instructionsText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  selectButton: {
    backgroundColor: '#dc2626',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  selectButtonSelected: {
    backgroundColor: '#16a34a',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#f59e0b',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // EULA Styles
  eulaContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#dc2626',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eulaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 15,
  },
  eulaText: {
    fontSize: 14,
    color: '#7f1d1d',
    lineHeight: 20,
    marginBottom: 8,
  },
  eulaButton: {
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eulaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
