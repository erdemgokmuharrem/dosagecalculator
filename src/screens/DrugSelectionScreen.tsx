import React, { useState, useMemo, useCallback, useRef, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, Drug } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useAppStore } from '../store';
import { sampleDrugs, searchDrugs, getDrugsByCategory } from '../data/drugs';
import { DRUG_CATEGORIES } from '../constants';
import { analytics } from '../services/analytics';
import ModernCard from '../components/ModernCard';
import GradientButton from '../components/GradientButton';
import FadeInView from '../components/FadeInView';
import Icon from '../components/Icon';

type DrugSelectionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DrugSelection'
>;
type DrugSelectionScreenRouteProp = RouteProp<
  RootStackParamList,
  'DrugSelection'
>;

const DrugSelectionScreen: React.FC = () => {
  const navigation = useNavigation<DrugSelectionScreenNavigationProp>();
  const route = useRoute<DrugSelectionScreenRouteProp>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { setSelectedDrug } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSearching, setIsSearching] = useState(false);
  
  // Debounce search query
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Optimized filtering with memoization
  const filteredDrugs = useMemo(() => {
    let drugs = sampleDrugs;

    // Filter by category first (more efficient)
    if (selectedCategory !== 'All') {
      drugs = getDrugsByCategory(selectedCategory);
    }

    // Then filter by search query
    if (debouncedSearchQuery.trim()) {
      const lowercaseQuery = debouncedSearchQuery.toLowerCase();
      drugs = drugs.filter(
        drug =>
          drug.name.toLowerCase().includes(lowercaseQuery) ||
          drug.genericName.toLowerCase().includes(lowercaseQuery) ||
          drug.category.toLowerCase().includes(lowercaseQuery)
      );
    }

    return drugs;
  }, [debouncedSearchQuery, selectedCategory]);

  // Debounced search handler
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    setIsSearching(true);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(text);
      setIsSearching(false);
    }, 50); // 50ms debounce for ultra-fast response
  }, []);

  // Memoized category selection handler
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
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
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface,
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
    },
    drugList: {
      flex: 1,
      padding: theme.spacing.md,
    },
    drugCard: {
      marginBottom: theme.spacing.md,
    },
    drugCardOptimized: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      elevation: 2,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
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
      marginBottom: theme.spacing.sm,
    },
    drugInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    drugCategory: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    drugUnit: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
    },
    drugDescription: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: theme.fontSizes.lg,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  // Memoized drug selection handler
  const handleSelectDrug = useCallback((drug: Drug) => {
    setSelectedDrug(drug);

    // Track analytics
    analytics.trackDrugSelected(drug.category, drug.dosageFormula.method);

    navigation.navigate('DosageCalculation', {
      patientId: route.params.patientId,
      drugId: drug.id,
    });
  }, [setSelectedDrug, navigation, route.params.patientId]);

  // Super optimized drug card component
  const DrugCard = memo(({ item, index, onSelect }: { 
    item: Drug; 
    index: number; 
    onSelect: (drug: Drug) => void;
  }) => (
    <TouchableOpacity 
      style={styles.drugCardOptimized}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.drugHeader}>
        <Icon name="pill" size={16} color={theme.colors.primary} />
        <Text style={styles.drugName} numberOfLines={1}>{item.name}</Text>
      </View>
      <Text style={styles.drugGenericName} numberOfLines={1}>{item.genericName}</Text>

      <View style={styles.drugInfo}>
        <Text style={styles.drugCategory} numberOfLines={1}>{item.category}</Text>
        <Text style={styles.drugUnit} numberOfLines={1}>{item.unit}</Text>
      </View>

      <Text style={styles.drugDescription} numberOfLines={2}>
        {item.dosageForm} • Max: {item.maxDailyDose}{item.unit}
      </Text>
    </TouchableOpacity>
  ));

  // Memoized drug card renderer
  const renderDrug = useCallback(({ item, index }: { item: Drug; index: number }) => (
    <DrugCard 
      item={item} 
      index={index} 
      onSelect={handleSelectDrug}
    />
  ), [handleSelectDrug]);

  // Memoized key extractor
  const keyExtractor = useCallback((item: Drug) => item.id, []);

  // Memoized empty state
  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Icon name="search" size={48} color={theme.colors.textSecondary} />
      <Text style={styles.emptyStateText}>
        {isSearching 
          ? 'Aranıyor...' 
          : searchQuery
            ? 'Arama kriterlerinize uygun ilaç bulunamadı'
            : 'İlaç bulunamadı'}
      </Text>
    </View>
  ), [isSearching, searchQuery, theme.colors.textSecondary]);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FadeInView delay={0}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Icon name="search" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="İlaç ara..."
                value={searchQuery}
                onChangeText={handleSearchChange}
                placeholderTextColor={theme.colors.textSecondary}
              />
              {isSearching && (
                <Icon name="loading" size={20} color={theme.colors.primary} />
              )}
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={200}>
          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScrollView}
            >
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === 'All' && styles.categoryButtonActive,
                ]}
                onPress={() => handleCategorySelect('All')}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === 'All' && styles.categoryButtonTextActive,
                  ]}
                >
                  Tümü
                </Text>
              </TouchableOpacity>

              {DRUG_CATEGORIES.map(category => (
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
                      selectedCategory === category &&
                        styles.categoryButtonTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </FadeInView>

        <FlatList
          data={filteredDrugs}
          renderItem={renderDrug}
          keyExtractor={keyExtractor}
          style={styles.drugList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          removeClippedSubviews={true}
          maxToRenderPerBatch={4}
          updateCellsBatchingPeriod={25}
          initialNumToRender={4}
          windowSize={5}
          getItemLayout={(data, index) => ({
            length: 120, // Reduced height for optimized card
            offset: 120 * index,
            index,
          })}
          legacyImplementation={false}
          disableVirtualization={false}
          onEndReachedThreshold={0.1}
          scrollEventThrottle={16}
        />
      </View>
    </SafeAreaView>
  );
};

export default DrugSelectionScreen;
