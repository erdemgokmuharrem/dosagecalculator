import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, SideEffect } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { getDrugById } from '../data/drugs';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useSubscription } from '../contexts/SubscriptionContext';
import { AdBanner } from '../components/AdBanner';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RoutePropType = RouteProp<RootStackParamList, 'DrugDetail'>;

const SIDE_EFFECT_COLORS: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  very_common: { bg: '#FEE2E2', text: '#991B1B', label: 'Çok Sık (>%10)' },
  common: { bg: '#FEF3C7', text: '#92400E', label: 'Sık (%1-10)' },
  uncommon: { bg: '#DBEAFE', text: '#1E40AF', label: 'Seyrek (%0.1-1)' },
  rare: { bg: '#D1FAE5', text: '#065F46', label: 'Nadir (%0.01-0.1)' },
  very_rare: { bg: '#F3F4F6', text: '#374151', label: 'Çok Nadir (<%0.01)' },
};

const DrugDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isPro } = useSubscription();

  const drug = getDrugById(route.params.drugId);

  // Declared before any conditional return so the hook order is stable.
  const groupedSideEffects = useMemo(() => {
    const sideEffects = drug?.sideEffects;
    if (!sideEffects || sideEffects.length === 0) return {};
    const first = sideEffects[0];
    if (typeof first === 'string') {
      return { plain: sideEffects as string[] };
    }
    const grouped: Record<string, string[]> = {};
    (sideEffects as SideEffect[]).forEach(se => {
      if (!grouped[se.frequency]) grouped[se.frequency] = [];
      grouped[se.frequency].push(se.effect);
    });
    return grouped;
  }, [drug?.sideEffects]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    mechanism: true,
    indications: false,
    contraindications: false,
    warnings: false,
    sideEffects: false,
    pharmacokinetics: false,
    interactions: false,
    administration: false,
    monitoring: false,
    dosageAdj: false,
    populations: false,
    storage: false,
  });

  const toggleSection = useCallback((key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSharePdf = async () => {
    if (!isPro) {
      Alert.alert(
        'Pro Özellik',
        'PDF olarak dışa aktarma özelliği sadece Pro sürümde mevcuttur. Ayarlar sayfasından yükseltebilirsiniz.',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Ayarlar',
            onPress: () => navigation.navigate('MainTabs' as any),
          }, // User navigates to tabs, can switch to Settings manually
        ]
      );
      return;
    }

    try {
      const pi = drug?.productInfo;
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
              h1 { color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; }
              h2 { color: #2563eb; margin-top: 20px; font-size: 18px; }
              .meta { color: #666; font-style: italic; margin-bottom: 20px; }
              .section { margin-bottom: 15px; }
              .label { font-weight: bold; color: #1f2937; }
              ul { margin-top: 5px; padding-left: 20px; }
              li { margin-bottom: 5px; font-size: 14px; line-height: 1.4; }
            </style>
          </head>
          <body>
            <h1>${drug?.name}</h1>
            <div class="meta">${drug?.genericName} | ${drug?.category} | ${drug?.dosageForm}</div>
            
            ${pi?.activeIngredient ? `<div class="section"><span class="label">{t('drug.activeIngredient')}:</span> ${pi.activeIngredient}</div>` : ''}
            ${pi?.mechanismOfAction ? `<div class="section"><span class="label">{t('vademecum.mechanismOfAction')}:</span> ${pi.mechanismOfAction}</div>` : ''}
            
            ${
              pi?.indications?.length
                ? `
              <div class="section">
                <h2>{t('vademecum.indications')}</h2>
                <ul>${pi.indications.map(i => `<li>${i}</li>`).join('')}</ul>
              </div>
            `
                : ''
            }
            
            ${
              pi?.contraindications?.length
                ? `
              <div class="section">
                <h2>{t('vademecum.contraindications')}</h2>
                <ul>${pi.contraindications.map(i => `<li style="color: #dc2626;">${i}</li>`).join('')}</ul>
              </div>
            `
                : ''
            }
            
            ${
              pi?.warnings?.length
                ? `
              <div class="section">
                <h2>{t('vademecum.warnings')}</h2>
                <ul>${pi.warnings.map(i => `<li>${i}</li>`).join('')}</ul>
              </div>
            `
                : ''
            }
            
            <div style="margin-top: 40px; font-size: 10px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
              Bu belge Dosage Calculator uygulaması tarafından oluşturulmuştur.<br/>
              Sadece bilgilendirme amaçlıdır, profesyonel tıbbi tavsiye yerine geçmez.
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: 'İlaç Bilgisini Paylaş',
      });
    } catch (error) {
      Alert.alert('Hata', 'PDF oluşturulurken bir hata oluştu.');
      console.error(error);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    headerCard: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24,
    },
    drugName: {
      fontSize: 26,
      fontWeight: '900',
      color: '#FFFFFF',
      marginBottom: 2,
    },
    genericName: {
      fontSize: 15,
      color: 'rgba(255,255,255,0.8)',
      marginBottom: 12,
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    metaBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 10,
    },
    metaBadgeText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
    activeIngredientCard: {
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 12,
      padding: 12,
    },
    aiLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: 'rgba(255,255,255,0.7)',
      marginBottom: 2,
    },
    aiValue: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
    actionRow: {
      flexDirection: 'row',
      padding: 12,
      gap: 10,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    actionBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 12,
      gap: 6,
    },
    actionBtnPrimary: {
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    actionBtnSecondary: {
      backgroundColor: theme.colors.background,
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
    },
    actionBtnTextPrimary: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
    actionBtnTextSecondary: {
      fontSize: 13,
      fontWeight: '800',
      color: theme.colors.primary,
    },
    scrollContent: { padding: 12, paddingBottom: 40 },
    accordion: {
      backgroundColor: theme.colors.surface,
      borderRadius: 14,
      marginBottom: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    accordionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      justifyContent: 'space-between',
    },
    accordionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    accordionIcon: { fontSize: 20, marginRight: 10 },
    accordionTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.colors.text,
      flex: 1,
    },
    accordionBadge: {
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      paddingHorizontal: 7,
      paddingVertical: 2,
      marginRight: 8,
    },
    accordionBadgeText: { fontSize: 10, fontWeight: '800', color: '#FFF' },
    accordionArrow: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '800',
    },
    accordionContent: {
      paddingHorizontal: 16,
      paddingBottom: 14,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: 12,
    },
    infoRow: {
      flexDirection: 'row',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    infoLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.text,
      width: 110,
    },
    infoValue: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      flex: 1,
      lineHeight: 19,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 6,
    },
    listBullet: { fontSize: 14, marginRight: 8, marginTop: 1 },
    listText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      flex: 1,
      lineHeight: 19,
    },
    listTextDanger: { color: '#DC2626' },
    listTextWarning: { color: '#D97706' },
    subSectionTitle: {
      fontSize: 12,
      fontWeight: '800',
      color: theme.colors.primary,
      marginTop: 14,
      marginBottom: 6,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    mechanismText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    sideEffectGroup: { marginBottom: 14 },
    sideEffectGroupTitle: {
      fontSize: 11,
      fontWeight: '800',
      marginBottom: 6,
      letterSpacing: 0.3,
    },
    sideEffectChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    sideEffectChip: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    sideEffectChipText: { fontSize: 12, fontWeight: '600' },
    disclaimer: {
      backgroundColor: theme.colors.primary + '10',
      borderRadius: 12,
      padding: 12,
      marginTop: 8,
      borderWidth: 1,
      borderColor: theme.colors.primary + '30',
    },
    disclaimerText: {
      fontSize: 11,
      color: theme.colors.primary,
      textAlign: 'center',
      lineHeight: 16,
    },
  });

  const Accordion: React.FC<{
    title: string;
    icon: string;
    sectionKey: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    badgeCount?: number;
  }> = ({ title, icon, sectionKey, children, defaultOpen, badgeCount }) => {
    const isOpen = openSections[sectionKey] ?? defaultOpen ?? false;
    return (
      <View style={styles.accordion}>
        <TouchableOpacity
          style={styles.accordionHeader}
          onPress={() => toggleSection(sectionKey)}
          activeOpacity={0.7}
        >
          <View style={styles.accordionLeft}>
            <Text style={styles.accordionIcon}>{icon}</Text>
            <Text style={styles.accordionTitle}>{title}</Text>
            {badgeCount !== undefined && badgeCount > 0 && (
              <View style={styles.accordionBadge}>
                <Text style={styles.accordionBadgeText}>{badgeCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.accordionArrow}>{isOpen ? '▼' : '▶'}</Text>
        </TouchableOpacity>
        {isOpen && <View style={styles.accordionContent}>{children}</View>}
      </View>
    );
  };

  const ListItem: React.FC<{
    text: string;
    type?: 'normal' | 'warning' | 'danger';
  }> = ({ text, type = 'normal' }) => (
    <View style={styles.listItem}>
      <Text
        style={[
          styles.listBullet,
          {
            color:
              type === 'danger'
                ? '#DC2626'
                : type === 'warning'
                  ? '#D97706'
                  : theme.colors.primary,
          },
        ]}
      >
        •
      </Text>
      <Text
        style={[
          styles.listText,
          type === 'danger' && styles.listTextDanger,
          type === 'warning' && styles.listTextWarning,
        ]}
      >
        {text}
      </Text>
    </View>
  );

  const InfoRow: React.FC<{ label: string; value: string }> = ({
    label,
    value,
  }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  if (!drug) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 48 }}>💊</Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: theme.colors.text,
              marginTop: 12,
            }}
          >
            {t('drug.noResults')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const pi = drug.productInfo;

  const frequencyOrder = [
    'very_common',
    'common',
    'uncommon',
    'rare',
    'very_rare',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.drugName}>{drug.name}</Text>
        <Text style={styles.genericName}>{drug.genericName}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeText}>📂 {drug.category}</Text>
          </View>
          <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeText}>
              {drug.dosageForm} • {drug.unit}
            </Text>
          </View>
          {drug.maxDailyDose && (
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>
                Max: {drug.maxDailyDose} {drug.unit}/gün
              </Text>
            </View>
          )}
        </View>
        {pi?.activeIngredient && (
          <View style={styles.activeIngredientCard}>
            <Text style={styles.aiLabel}>{t('drug.activeIngredient')}</Text>
            <Text style={styles.aiValue}>{pi.activeIngredient}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnPrimary]}
          onPress={() => navigation.navigate('MainTabs')}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 16 }}>⚡</Text>
          <Text style={styles.actionBtnTextPrimary}>
            {t('vademecum.calculateDose')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnSecondary]}
          onPress={handleSharePdf}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 16 }}>📤</Text>
          <Text style={styles.actionBtnTextSecondary}>
            {t('vademecum.share')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!pi ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Text style={{ fontSize: 40 }}>📋</Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: theme.colors.text,
                marginTop: 12,
              }}
            >
              {t('vademecum.noDetails')}
            </Text>
          </View>
        ) : (
          <>
            <Accordion
              title="Etki Mekanizması"
              icon="⚙️"
              sectionKey="mechanism"
              defaultOpen
            >
              <Text style={styles.mechanismText}>{pi.mechanismOfAction}</Text>
            </Accordion>

            <Accordion
              title="Endikasyonlar"
              icon="✅"
              sectionKey="indications"
              badgeCount={pi.indications.length}
            >
              {pi.indications.map((ind, i) => (
                <ListItem key={i} text={ind} />
              ))}
            </Accordion>

            <Accordion
              title="Kontrendikasyonlar"
              icon="🚫"
              sectionKey="contraindications"
              badgeCount={pi.contraindications.length}
            >
              {pi.contraindications.map((c, i) => (
                <ListItem key={i} text={c} type="danger" />
              ))}
            </Accordion>

            <Accordion
              title="Uyarılar ve Önlemler"
              icon="⚠️"
              sectionKey="warnings"
              badgeCount={pi.warnings.length}
            >
              {pi.warnings.map((w, i) => (
                <ListItem key={i} text={w} type="warning" />
              ))}
            </Accordion>

            <Accordion title="Yan Etkiler" icon="💢" sectionKey="sideEffects">
              {groupedSideEffects.plain
                ? (groupedSideEffects.plain as string[]).map((se, i) => (
                    <ListItem key={i} text={se} type="warning" />
                  ))
                : frequencyOrder
                    .filter(f => groupedSideEffects[f]?.length > 0)
                    .map(freq => {
                      const cfg = SIDE_EFFECT_COLORS[freq];
                      return (
                        <View key={freq} style={styles.sideEffectGroup}>
                          <Text
                            style={[
                              styles.sideEffectGroupTitle,
                              { color: cfg.text },
                            ]}
                          >
                            {cfg.label}
                          </Text>
                          <View style={styles.sideEffectChipsRow}>
                            {groupedSideEffects[freq].map(
                              (effect: string, i: number) => (
                                <View
                                  key={i}
                                  style={[
                                    styles.sideEffectChip,
                                    { backgroundColor: cfg.bg },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.sideEffectChipText,
                                      { color: cfg.text },
                                    ]}
                                  >
                                    {effect}
                                  </Text>
                                </View>
                              )
                            )}
                          </View>
                        </View>
                      );
                    })}
            </Accordion>

            <Accordion
              title="Farmakokinetik"
              icon="📊"
              sectionKey="pharmacokinetics"
            >
              <InfoRow label="Emilim" value={pi.pharmacokinetics.absorption} />
              <InfoRow
                label="Dağılım"
                value={pi.pharmacokinetics.distribution}
              />
              <InfoRow
                label="Metabolizma"
                value={pi.pharmacokinetics.metabolism}
              />
              <InfoRow
                label="Eliminasyon"
                value={pi.pharmacokinetics.elimination}
              />
              <InfoRow label="Yarı Ömür" value={pi.pharmacokinetics.halfLife} />
            </Accordion>

            <Accordion
              title="İlaç Etkileşimleri"
              icon="💊"
              sectionKey="interactions"
              badgeCount={
                pi.interactions.drugInteractions.length +
                pi.interactions.foodInteractions.length
              }
            >
              <Text style={styles.subSectionTitle}>
                {t('vademecum.drugInteractions')}
              </Text>
              {pi.interactions.drugInteractions.map((int, i) => (
                <ListItem key={i} text={int} type="warning" />
              ))}
              {pi.interactions.foodInteractions.length > 0 && (
                <>
                  <Text style={styles.subSectionTitle}>
                    {t('vademecum.foodInteractions')}
                  </Text>
                  {pi.interactions.foodInteractions.map((int, i) => (
                    <ListItem key={i} text={int} />
                  ))}
                </>
              )}
              {pi.interactions.labInteractions.length > 0 && (
                <>
                  <Text style={styles.subSectionTitle}>
                    {t('vademecum.labInteractions')}
                  </Text>
                  {pi.interactions.labInteractions.map((int, i) => (
                    <ListItem key={i} text={int} />
                  ))}
                </>
              )}
            </Accordion>

            <Accordion
              title="Uygulama Bilgileri"
              icon="💉"
              sectionKey="administration"
            >
              <InfoRow label="Uygulama Yolu" value={pi.administration.route} />
              <InfoRow label="Yöntem" value={pi.administration.method} />
              {pi.administration.duration && (
                <InfoRow label="Süre" value={pi.administration.duration} />
              )}
              {pi.administration.diluent &&
                pi.administration.diluent !== '-' && (
                  <InfoRow
                    label="Seyreltici"
                    value={pi.administration.diluent}
                  />
                )}
              {pi.administration.concentration &&
                pi.administration.concentration !== '-' && (
                  <InfoRow
                    label="Konsantrasyon"
                    value={pi.administration.concentration}
                  />
                )}
              {pi.administration.compatibility.length > 0 && (
                <>
                  <Text style={styles.subSectionTitle}>
                    {t('vademecum.compatibility')}
                  </Text>
                  {pi.administration.compatibility.map((c, i) => (
                    <ListItem key={i} text={c} />
                  ))}
                </>
              )}
              {pi.administration.incompatibility.length > 0 && (
                <>
                  <Text style={styles.subSectionTitle}>
                    {t('vademecum.incompatibility')}
                  </Text>
                  {pi.administration.incompatibility.map((c, i) => (
                    <ListItem key={i} text={c} type="danger" />
                  ))}
                </>
              )}
            </Accordion>

            <Accordion
              title="İzleme Parametreleri"
              icon="📋"
              sectionKey="monitoring"
            >
              <Text style={styles.subSectionTitle}>
                {t('vademecum.parameters')}
              </Text>
              {pi.monitoring.parameters.map((p, i) => (
                <ListItem key={i} text={p} />
              ))}
              <InfoRow label="İzlem Sıklığı" value={pi.monitoring.frequency} />
              {pi.monitoring.specialConsiderations.length > 0 && (
                <>
                  <Text style={styles.subSectionTitle}>
                    {t('vademecum.specialConsiderations')}
                  </Text>
                  {pi.monitoring.specialConsiderations.map((c, i) => (
                    <ListItem key={i} text={c} type="warning" />
                  ))}
                </>
              )}
            </Accordion>

            <Accordion
              title="Doz Ayarlamaları"
              icon="⚖️"
              sectionKey="dosageAdj"
            >
              <InfoRow label="Böbrek Yetmezliği" value={pi.renalAdjustment} />
              <InfoRow
                label="Karaciğer Yetmezliği"
                value={pi.hepaticAdjustment}
              />
            </Accordion>

            <Accordion
              title="Özel Popülasyonlar"
              icon="👥"
              sectionKey="populations"
            >
              <InfoRow label="Gebelik" value={pi.pregnancyCategory} />
              <InfoRow label="Emzirme" value={pi.lactation} />
              <InfoRow label="Pediatrik" value={pi.pediatricUse} />
              <InfoRow label="Geriatrik" value={pi.geriatricUse} />
            </Accordion>

            <Accordion title="Saklama Koşulları" icon="🏠" sectionKey="storage">
              <InfoRow label="Sıcaklık" value={pi.storage.temperature} />
              <InfoRow label="Işık" value={pi.storage.light} />
              <InfoRow label="Stabilite" value={pi.storage.stability} />
            </Accordion>

            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerText}>
                ⚠️ Bu bilgiler yalnızca eğitim amaçlıdır. Tedavi kararları için
                yetkili hekim onayı gereklidir.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
};

export default DrugDetailScreen;
