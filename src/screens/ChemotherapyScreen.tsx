import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAppStore } from '../store';
import { CHEMOTHERAPY_DRUGS, CHEMOTHERAPY_CATEGORIES, ADMINISTRATION_ROUTES, DILUTION_SOLVENTS } from '../data/chemotherapy';
import { calculateChemotherapyDose, PatientInfo } from '../features/chemotherapy/calculations';
import ModernCard from '../components/ModernCard';
import GradientButton from '../components/GradientButton';
import FadeInView from '../components/FadeInView';
import Icon from '../components/Icon';
import LoadingSpinner from '../components/LoadingSpinner';

const ChemotherapyScreen: React.FC = () => {
  const { theme } = useTheme();
  const { setSelectedPatient, setSelectedDrug } = useAppStore();
  
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    weight: 70,
    height: 170,
    age: 50,
    gender: 'male',
    gfr: undefined,
    auc: undefined,
  });
  
  const [selectedDrug, setSelectedDrugState] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoute, setSelectedRoute] = useState<string>('IV');
  const [selectedSolvent, setSelectedSolvent] = useState<string>('0.9% NaCl');
  const [infusionTime, setInfusionTime] = useState<string>('60');
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Filtrelenmiş ilaçlar
  const filteredDrugs = useMemo(() => {
    let drugs = CHEMOTHERAPY_DRUGS;
    
    if (selectedCategory !== 'All') {
      drugs = drugs.filter(drug => drug.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      drugs = drugs.filter(drug => 
        drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drug.genericName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return drugs;
  }, [selectedCategory, searchQuery]);

  // Hesaplama yap
  const handleCalculate = useCallback(async () => {
    if (!selectedDrug) {
      Alert.alert('Hata', 'Lütfen bir ilaç seçin');
      return;
    }

    if (patientInfo.weight <= 0 || patientInfo.height <= 0) {
      Alert.alert('Hata', 'Geçerli kilo ve boy değerleri girin');
      return;
    }

    setIsCalculating(true);
    
    try {
      const drug = CHEMOTHERAPY_DRUGS.find(d => d.id === selectedDrug);
      if (!drug) {
        throw new Error('İlaç bulunamadı');
      }

      const result = calculateChemotherapyDose(drug, patientInfo);
      setCalculationResult(result);
      
      // Store'a kaydet
      setSelectedPatient({
        id: 'chemotherapy-patient',
        name: 'Kemoterapi Hastası',
        age: patientInfo.age,
        weight: patientInfo.weight,
        height: patientInfo.height,
        gender: patientInfo.gender,
      });
      
      setSelectedDrug(drug);
      
    } catch (error) {
      Alert.alert('Hesaplama Hatası', error.message);
    } finally {
      setIsCalculating(false);
    }
  }, [selectedDrug, patientInfo, setSelectedPatient, setSelectedDrug]);

  // İlaç seç
  const handleDrugSelect = useCallback((drugId: string) => {
    setSelectedDrugState(drugId);
    setCalculationResult(null);
  }, []);

  // Kategori seç
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    header: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.lg,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: 'bold',
      color: theme.colors.surface,
      marginBottom: theme.spacing.xs,
    },
    headerSubtitle: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.surface,
      opacity: 0.9,
    },
    section: {
      margin: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    inputRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    inputContainer: {
      flex: 1,
      marginHorizontal: theme.spacing.xs,
    },
    inputLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
    },
    searchContainer: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
    },
    searchInput: {
      flex: 1,
      padding: theme.spacing.md,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
    },
    categoryContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    categoryScrollView: {
      flexDirection: 'row',
    },
    categoryButton: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    categoryButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryButtonText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
    },
    categoryButtonTextActive: {
      color: theme.colors.surface,
      fontWeight: 'bold',
    },
    drugList: {
      flex: 1,
      padding: theme.spacing.md,
    },
    drugCard: {
      marginBottom: theme.spacing.md,
    },
    drugHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    drugName: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    drugGenericName: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    drugInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    drugCategory: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    drugUnit: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
    },
    drugDescription: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    calculateButton: {
      margin: theme.spacing.md,
    },
    resultContainer: {
      margin: theme.spacing.md,
    },
    resultTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    resultCard: {
      marginBottom: theme.spacing.md,
    },
    resultRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    resultLabel: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
      flex: 1,
    },
    resultValue: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'right',
    },
    warningContainer: {
      backgroundColor: theme.colors.warningLight,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    warningTitle: {
      fontSize: theme.fontSizes.md,
      fontWeight: 'bold',
      color: theme.colors.warning,
      marginBottom: theme.spacing.sm,
    },
    warningText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.warning,
      marginBottom: theme.spacing.xs,
    },
    resultText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FadeInView delay={0}>
          <View style={styles.header}>
            <Icon name="pill" size={32} color={theme.colors.surface} />
            <Text style={styles.headerTitle}>Kemoterapi Hesaplayıcı</Text>
            <Text style={styles.headerSubtitle}>Güvenli doz hesaplama</Text>
          </View>
        </FadeInView>

        <ScrollView style={styles.content}>
          {/* Hasta Bilgileri */}
          <FadeInView delay={100}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Icon name="user" size={20} color={theme.colors.primary} /> Hasta Bilgileri
              </Text>
              
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Kilo (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={patientInfo.weight.toString()}
                    onChangeText={(text) => setPatientInfo(prev => ({ ...prev, weight: parseFloat(text) || 0 }))}
                    keyboardType="numeric"
                    placeholder="70"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Boy (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={patientInfo.height.toString()}
                    onChangeText={(text) => setPatientInfo(prev => ({ ...prev, height: parseFloat(text) || 0 }))}
                    keyboardType="numeric"
                    placeholder="170"
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Yaş</Text>
                  <TextInput
                    style={styles.input}
                    value={patientInfo.age.toString()}
                    onChangeText={(text) => setPatientInfo(prev => ({ ...prev, age: parseInt(text) || 0 }))}
                    keyboardType="numeric"
                    placeholder="50"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Cinsiyet</Text>
                  <View style={{ flexDirection: 'row', marginTop: theme.spacing.sm }}>
                    <TouchableOpacity
                      style={[
                        styles.categoryButton,
                        patientInfo.gender === 'male' && styles.categoryButtonActive,
                        { marginRight: theme.spacing.sm }
                      ]}
                      onPress={() => setPatientInfo(prev => ({ ...prev, gender: 'male' }))}
                    >
                      <Text style={[
                        styles.categoryButtonText,
                        patientInfo.gender === 'male' && styles.categoryButtonTextActive
                      ]}>
                        Erkek
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.categoryButton,
                        patientInfo.gender === 'female' && styles.categoryButtonActive
                      ]}
                      onPress={() => setPatientInfo(prev => ({ ...prev, gender: 'female' }))}
                    >
                      <Text style={[
                        styles.categoryButtonText,
                        patientInfo.gender === 'female' && styles.categoryButtonTextActive
                      ]}>
                        Kadın
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>GFR (opsiyonel)</Text>
                  <TextInput
                    style={styles.input}
                    value={patientInfo.gfr?.toString() || ''}
                    onChangeText={(text) => setPatientInfo(prev => ({ ...prev, gfr: parseFloat(text) || undefined }))}
                    keyboardType="numeric"
                    placeholder="90"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>AUC (Carboplatin için)</Text>
                  <TextInput
                    style={styles.input}
                    value={patientInfo.auc?.toString() || ''}
                    onChangeText={(text) => setPatientInfo(prev => ({ ...prev, auc: parseFloat(text) || undefined }))}
                    keyboardType="numeric"
                    placeholder="5"
                  />
                </View>
              </View>
            </View>
          </FadeInView>

          {/* Uygulama Yolu ve Solvent Seçimi */}
          <FadeInView delay={150}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Icon name="syringe" size={20} color={theme.colors.primary} /> Uygulama Detayları
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Uygulama Yolu</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoryScrollView}
                >
                  {ADMINISTRATION_ROUTES.map(route => (
                    <TouchableOpacity
                      key={route}
                      style={[
                        styles.categoryButton,
                        selectedRoute === route && styles.categoryButtonActive,
                      ]}
                      onPress={() => setSelectedRoute(route)}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          selectedRoute === route && styles.categoryButtonTextActive,
                        ]}
                      >
                        {route}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Solvent (Çözücü)</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoryScrollView}
                >
                  {DILUTION_SOLVENTS.map(solvent => (
                    <TouchableOpacity
                      key={solvent}
                      style={[
                        styles.categoryButton,
                        selectedSolvent === solvent && styles.categoryButtonActive,
                      ]}
                      onPress={() => setSelectedSolvent(solvent)}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          selectedSolvent === solvent && styles.categoryButtonTextActive,
                        ]}
                      >
                        {solvent}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>İnfüzyon Süresi (dakika)</Text>
                <TextInput
                  style={styles.input}
                  value={infusionTime}
                  onChangeText={setInfusionTime}
                  keyboardType="numeric"
                  placeholder="60"
                />
              </View>
            </View>
          </FadeInView>

          {/* İlaç Arama */}
          <FadeInView delay={250}>
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Icon name="search" size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Kemoterapi ilacı ara..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>
          </FadeInView>

          {/* Kategoriler */}
          <FadeInView delay={350}>
            <View style={styles.categoryContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScrollView}
              >
                {CHEMOTHERAPY_CATEGORIES.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category && styles.categoryButtonActive,
                    ]}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === category && styles.categoryButtonTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </FadeInView>

          {/* İlaç Listesi */}
          <FadeInView delay={450}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Icon name="pill" size={20} color={theme.colors.primary} /> İlaç Seçimi
              </Text>
              
              {filteredDrugs.map((drug) => (
                <ModernCard
                  key={drug.id}
                  variant={selectedDrug === drug.id ? "gradient" : "elevated"}
                  style={styles.drugCard}
                  onPress={() => handleDrugSelect(drug.id)}
                >
                  <View style={styles.drugHeader}>
                    <Icon name="pill" size={20} color={theme.colors.primary} />
                    <Text style={styles.drugName}>{drug.name}</Text>
                  </View>
                  <Text style={styles.drugGenericName}>{drug.genericName}</Text>

                  <View style={styles.drugInfo}>
                    <Text style={styles.drugCategory}>{drug.category}</Text>
                    <Text style={styles.drugUnit}>{drug.unit}</Text>
                  </View>

                  <Text style={styles.drugDescription}>
                    {drug.administrationRoute} • {drug.dilution.solvent} • Max: {drug.maxDailyDose} {drug.unit}
                  </Text>
                </ModernCard>
              ))}
            </View>
          </FadeInView>

          {/* Hesaplama Butonu */}
          <FadeInView delay={550}>
            <GradientButton
              title="Dozu Hesapla"
              onPress={handleCalculate}
              variant="primary"
              size="large"
              fullWidth
              loading={isCalculating}
              style={styles.calculateButton}
            />
          </FadeInView>

          {/* Sonuçlar */}
          {calculationResult && (
            <FadeInView delay={650}>
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>
                  <Icon name="calculator" size={24} color={theme.colors.primary} /> Hesaplama Sonucu
                </Text>

                <ModernCard variant="elevated" style={styles.resultCard}>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>İlaç:</Text>
                    <Text style={styles.resultValue}>{calculationResult.drug.name}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>BSA:</Text>
                    <Text style={styles.resultValue}>{calculationResult.patientInfo.bsa.toFixed(2)} m²</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Hesaplanan Doz:</Text>
                    <Text style={styles.resultValue}>
                      {calculationResult.calculatedDose.dose} {calculationResult.calculatedDose.unit}
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Yöntem:</Text>
                    <Text style={styles.resultValue}>{calculationResult.calculatedDose.method}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Seçilen Uygulama Yolu:</Text>
                    <Text style={styles.resultValue}>{selectedRoute}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Seçilen Solvent:</Text>
                    <Text style={styles.resultValue}>{selectedSolvent}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>İnfüzyon Süresi:</Text>
                    <Text style={styles.resultValue}>{infusionTime} dakika</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Önerilen Hacim:</Text>
                    <Text style={styles.resultValue}>{calculationResult.administration.volume}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Önerilen Konsantrasyon:</Text>
                    <Text style={styles.resultValue}>{calculationResult.drug.dilution.concentration}</Text>
                  </View>
                </ModernCard>

                {calculationResult.safety.warnings.length > 0 && (
                  <ModernCard variant="outlined" style={styles.warningContainer}>
                    <Text style={styles.warningTitle}>
                      <Icon name="warning" size={20} color={theme.colors.warning} /> Uyarılar
                    </Text>
                    {calculationResult.safety.warnings.map((warning: string, index: number) => (
                      <Text key={index} style={styles.warningText}>
                        • {warning}
                      </Text>
                    ))}
                  </ModernCard>
                )}

                <ModernCard variant="elevated" style={styles.resultCard}>
                  <Text style={styles.sectionTitle}>
                    <Icon name="info" size={20} color={theme.colors.primary} /> İzlem Gereksinimleri
                  </Text>
                  {calculationResult.monitoring.required.map((item: string, index: number) => (
                    <Text key={index} style={styles.resultText}>
                      • {item}
                    </Text>
                  ))}
                  <Text style={styles.resultText}>
                    Sıklık: {calculationResult.monitoring.frequency}
                  </Text>
                </ModernCard>
              </View>
            </FadeInView>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChemotherapyScreen;
