import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, Drug } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { sampleDrugs, getDrugsByCategory } from '../data/drugs';
import { AdBanner } from '../components/AdBanner';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CATEGORY_ICONS: Record<string, string> = {
  Analgesics: '💊',
  Antibiotics: '🦠',
  'Cardiac Glycosides': '❤️',
  Anticoagulants: '🩸',
  Antidiabetics: '💉',
  Corticosteroids: '⚡',
  Cardiovascular: '🫀',
  Antihypertensives: '📉',
  Diuretics: '💧',
  Immunosuppressants: '🛡️',
  Neurology: '🧠',
  Psychiatry: '🧩',
  Respiratory: '🫁',
  Gastrointestinal: '🫃',
  Oncology: '⚕️',
  Antimicrobials: '🧪',
  Emergency: '🚨',
  Endocrinology: '🔬',
  Ophthalmology: '👁️',
  Dermatology: '🩹',
};

const DOSAGE_FORM_ICONS: Record<string, string> = {
  tablet: '⬜',
  capsule: '💊',
  syrup: '🧃',
  injection: '💉',
  cream: '🧴',
  drops: '💧',
  inhaler: '🌬️',
  patch: '🩹',
  suppository: '🔶',
  powder: '🌫️',
};

const VademecumScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const allCategories = useMemo(
    () => Array.from(new Set(sampleDrugs.map(d => d.category))),
    []
  );

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setDebouncedQuery(text), 80);
  }, []);

  const filteredDrugs = useMemo(() => {
    let drugs =
      selectedCategory === 'All'
        ? sampleDrugs
        : getDrugsByCategory(selectedCategory);
    if (showFavoritesOnly) {
      drugs = drugs.filter(d => favorites.includes(d.id));
    }
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      drugs = drugs.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.genericName.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.productInfo?.activeIngredient?.toLowerCase().includes(q)
      );
    }
    return drugs;
  }, [debouncedQuery, selectedCategory, favorites, showFavoritesOnly]);

  const toggleFavorite = useCallback((drugId: string) => {
    setFavorites(prev =>
      prev.includes(drugId)
        ? prev.filter(id => id !== drugId)
        : [...prev, drugId]
    );
  }, []);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    // Header section
    headerSection: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '900',
      color: '#FFFFFF',
      marginBottom: 2,
    },
    headerSubtitle: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.75)',
      marginBottom: 12,
    },
    // Search
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 12,
      paddingHorizontal: 12,
      marginBottom: 10,
    },
    searchIcon: { fontSize: 15, marginRight: 8 },
    searchInput: {
      flex: 1,
      paddingVertical: 10,
      fontSize: 14,
      color: '#FFFFFF',
    },
    // Filter bar
    filterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    favoriteFilterBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      gap: 4,
    },
    favoriteFilterBtnActive: {
      borderColor: '#F59E0B',
      backgroundColor: '#FEF3C7',
    },
    favoriteFilterText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },
    favoriteFilterTextActive: { color: '#92400E' },
    drugCount: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: 'auto',
    },
    // Category scroll
    catContainer: {
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    catScroll: { paddingHorizontal: 12, paddingVertical: 8 },
    catChip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      marginRight: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    catChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    catChipText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    catChipTextActive: { color: '#FFFFFF' },
    // Drug list
    listContent: { padding: 12, paddingBottom: 30 },
    drugCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 14,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    drugIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 14,
      backgroundColor: theme.colors.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    drugIconText: { fontSize: 22 },
    drugInfo: { flex: 1 },
    drugName: {
      fontSize: 15,
      fontWeight: '800',
      color: theme.colors.text,
      marginBottom: 2,
    },
    drugGeneric: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    drugMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap',
    },
    drugCategoryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      backgroundColor: theme.colors.primary + '15',
      borderRadius: 8,
    },
    drugCategoryText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    drugFormBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    drugFormText: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    drugActions: { alignItems: 'center', gap: 8 },
    favoriteBtn: { padding: 6 },
    favoriteBtnText: { fontSize: 20 },
    chevron: { fontSize: 16, color: theme.colors.textSecondary },
    // Empty state
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyIcon: { fontSize: 48, marginBottom: 16 },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 6,
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  const renderDrugCard = useCallback(
    ({ item }: { item: Drug }) => {
      const isFav = favorites.includes(item.id);
      return (
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.drugCard}
          onPress={() => navigation.navigate('DrugDetail', { drugId: item.id })}
          activeOpacity={0.8}
        >
          <View style={styles.drugIconContainer}>
            <Text style={styles.drugIconText}>
              {CATEGORY_ICONS[item.category] || '💊'}
            </Text>
          </View>

          <View style={styles.drugInfo}>
            <Text style={styles.drugName}>{item.name}</Text>
            <Text style={styles.drugGeneric}>{item.genericName}</Text>
            <View style={styles.drugMetaRow}>
              <View style={styles.drugCategoryBadge}>
                <Text style={styles.drugCategoryText}>{item.category}</Text>
              </View>
              <View style={styles.drugFormBadge}>
                <Text style={styles.drugFormText}>
                  {DOSAGE_FORM_ICONS[item.dosageForm] || ''} {item.dosageForm}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.drugActions}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={
                isFav
                  ? t('vademecum.removeFavorite')
                  : t('vademecum.addFavorite')
              }
              accessibilityState={{ selected: isFav }}
              style={styles.favoriteBtn}
              onPress={() => toggleFavorite(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.favoriteBtnText}>{isFav ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [favorites, toggleFavorite, navigation]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with search */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>💊 İlaç Rehberi</Text>
        <Text style={styles.headerSubtitle}>
          Vademecum — {sampleDrugs.length} ilaç
        </Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="İlaç, etken madde, kategori ara..."
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t('common.clearSearch')}
              onPress={() => {
                setSearchQuery('');
                setDebouncedQuery('');
              }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter row */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ selected: showFavoritesOnly }}
          style={[
            styles.favoriteFilterBtn,
            showFavoritesOnly && styles.favoriteFilterBtnActive,
          ]}
          onPress={() => setShowFavoritesOnly(p => !p)}
        >
          <Text>{showFavoritesOnly ? '⭐' : '☆'}</Text>
          <Text
            style={[
              styles.favoriteFilterText,
              showFavoritesOnly && styles.favoriteFilterTextActive,
            ]}
          >
            {t('vademecum.favorites')}
          </Text>
        </TouchableOpacity>
        <Text style={styles.drugCount}>{filteredDrugs.length} ilaç</Text>
      </View>

      {/* Category chips */}
      <View style={styles.catContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === 'All' }}
            style={[
              styles.catChip,
              selectedCategory === 'All' && styles.catChipActive,
            ]}
            onPress={() => setSelectedCategory('All')}
          >
            <Text
              style={[
                styles.catChipText,
                selectedCategory === 'All' && styles.catChipTextActive,
              ]}
            >
              🔍 Tümü
            </Text>
          </TouchableOpacity>
          {allCategories.map(cat => (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={{ selected: selectedCategory === cat }}
              key={cat}
              style={[
                styles.catChip,
                selectedCategory === cat && styles.catChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.catChipText,
                  selectedCategory === cat && styles.catChipTextActive,
                ]}
              >
                {CATEGORY_ICONS[cat] || '💊'} {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Drug list */}
      <FlatList
        data={filteredDrugs}
        keyExtractor={item => item.id}
        renderItem={renderDrugCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        initialNumToRender={8}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>{t('drug.noResults')}</Text>
            <Text style={styles.emptySubtitle}>
              {showFavoritesOnly
                ? t('vademecum.noFavorites')
                : t('vademecum.noMatches')}
            </Text>
          </View>
        }
      />

      <AdBanner />
    </SafeAreaView>
  );
};

export default VademecumScreen;
