import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, Patient } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useAppStore } from '../store';
import { PATIENT_TYPES } from '../constants';
import { validatePatientForCalculation } from '../features/dosage/calculations';
import { analytics } from '../services/analytics';
import GradientButton from '../components/GradientButton';
import ModernCard from '../components/ModernCard';
import LoadingSpinner from '../components/LoadingSpinner';

type PatientInfoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PatientInfo'
>;

const patientSchema = z.object({
  age: z
    .number()
    .min(0, "Yaş 0'dan büyük olmalıdır")
    .max(120, "Yaş 120'den küçük olmalıdır"),
  weight: z
    .number()
    .min(0.1, "Kilo 0.1'den büyük olmalıdır")
    .max(300, "Kilo 300'den küçük olmalıdır"),
  height: z
    .number()
    .min(1, "Boy 1'den büyük olmalıdır")
    .max(250, "Boy 250'den küçük olmalıdır"),
  gender: z.enum(['male', 'female']),
  patientType: z.enum(['adult', 'elderly', 'child', 'neonate']),
  serumCreatinine: z.number().min(0.1).max(10).optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

const PatientInfoScreen: React.FC = () => {
  const navigation = useNavigation<PatientInfoScreenNavigationProp>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { currentPatient, setCurrentPatient, addPatient } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: currentPatient
      ? {
          age: currentPatient.age,
          weight: currentPatient.weight,
          height: currentPatient.height,
          gender: currentPatient.gender,
          patientType: currentPatient.patientType,
          serumCreatinine: 1.0,
        }
      : {
          age: 30,
          weight: 70,
          height: 170,
          gender: 'male',
          patientType: 'adult',
          serumCreatinine: 1.0,
        },
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    form: {
      flex: 1,
    },
    inputGroup: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontSize: theme.fontSizes.md,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
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
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.fontSizes.sm,
      marginTop: theme.spacing.xs,
    },
    picker: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    pickerItem: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    pickerItemText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
    },
    infoCard: {
      backgroundColor: theme.colors.primary + '20',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    infoText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    setIsLoading(true);

    try {
      const patient: Patient = {
        id: currentPatient?.id || Date.now().toString(),
        age: data.age,
        weight: data.weight,
        height: data.height,
        gender: data.gender,
        patientType: data.patientType,
        bsa: Math.sqrt((data.height * data.weight) / 3600),
        crcl:
          data.gender === 'male'
            ? ((140 - data.age) * data.weight) /
              (72 * (data.serumCreatinine || 1.0))
            : ((140 - data.age) * data.weight * 0.85) /
              (72 * (data.serumCreatinine || 1.0)),
      };

      // Validate patient data
      const validationErrors = validatePatientForCalculation(patient);
      if (validationErrors.length > 0) {
        Alert.alert('Hata', validationErrors.join('\n'));
        return;
      }

      if (currentPatient) {
        // Update existing patient
        setCurrentPatient(patient);
      } else {
        // Add new patient
        addPatient(patient);
        setCurrentPatient(patient);
      }

      // Track analytics
      analytics.trackPatientInfoEntered(patient.patientType, patient.age);

      // Navigate to drug selection
      navigation.navigate('DrugSelection', { patientId: patient.id });
    } catch (error) {
      Alert.alert('Hata', 'Hasta bilgileri kaydedilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Hasta bilgilerini doğru girdiğinizden emin olun. Bu bilgiler doz
            hesaplaması için kritik öneme sahiptir.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Yaş *</Text>
            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.age && styles.inputError]}
                  value={value?.toString()}
                  onChangeText={text => onChange(parseFloat(text) || 0)}
                  placeholder="Yaş girin"
                  keyboardType="numeric"
                />
              )}
            />
            {errors.age && (
              <Text style={styles.errorText}>{errors.age.message}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kilo (kg) *</Text>
            <Controller
              control={control}
              name="weight"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.weight && styles.inputError]}
                  value={value?.toString()}
                  onChangeText={text => onChange(parseFloat(text) || 0)}
                  placeholder="Kilo girin"
                  keyboardType="numeric"
                />
              )}
            />
            {errors.weight && (
              <Text style={styles.errorText}>{errors.weight.message}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Boy (cm) *</Text>
            <Controller
              control={control}
              name="height"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.height && styles.inputError]}
                  value={value?.toString()}
                  onChangeText={text => onChange(parseFloat(text) || 0)}
                  placeholder="Boy girin"
                  keyboardType="numeric"
                />
              )}
            />
            {errors.height && (
              <Text style={styles.errorText}>{errors.height.message}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cinsiyet *</Text>
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <View style={styles.picker}>
                  <TouchableOpacity
                    style={styles.pickerItem}
                    onPress={() => onChange('male')}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        value === 'male' && { color: theme.colors.primary },
                      ]}
                    >
                      Erkek
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.pickerItem}
                    onPress={() => onChange('female')}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        value === 'female' && { color: theme.colors.primary },
                      ]}
                    >
                      Kadın
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hasta Tipi *</Text>
            <Controller
              control={control}
              name="patientType"
              render={({ field: { onChange, value } }) => (
                <View style={styles.picker}>
                  {PATIENT_TYPES.map(type => (
                    <TouchableOpacity
                      key={type.value}
                      style={styles.pickerItem}
                      onPress={() => onChange(type.value as any)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          value === type.value && {
                            color: theme.colors.primary,
                          },
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Serum Kreatinin (mg/dL) - Opsiyonel
            </Text>
            <Controller
              control={control}
              name="serumCreatinine"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.serumCreatinine && styles.inputError,
                  ]}
                  value={value?.toString()}
                  onChangeText={text => onChange(parseFloat(text) || 1.0)}
                  placeholder="1.0"
                  keyboardType="numeric"
                />
              )}
            />
            {errors.serumCreatinine && (
              <Text style={styles.errorText}>
                {errors.serumCreatinine.message}
              </Text>
            )}
          </View>

          <GradientButton
            title={isLoading ? 'Kaydediliyor...' : 'Devam Et'}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            loading={isLoading}
            variant="primary"
            size="large"
            fullWidth
            style={{ marginTop: theme.spacing.lg }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PatientInfoScreen;
