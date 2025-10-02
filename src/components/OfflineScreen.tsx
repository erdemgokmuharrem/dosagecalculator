import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface OfflineScreenProps {
  onRetry?: () => void;
}

const OfflineScreen: React.FC<OfflineScreenProps> = ({ onRetry }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    icon: {
      fontSize: 64,
      marginBottom: theme.spacing.lg,
      color: theme.colors.textSecondary,
    },
    title: {
      fontSize: theme.fontSizes.xl,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    message: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      lineHeight: 20,
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    retryButtonText: {
      color: theme.colors.surface,
      fontSize: theme.fontSizes.md,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📡</Text>
      <Text style={styles.title}>İnternet Bağlantısı Yok</Text>
      <Text style={styles.message}>
        İnternet bağlantınızı kontrol edin ve tekrar deneyin. 
        Bazı özellikler çevrimdışı modda çalışmaya devam edecektir.
      </Text>
      
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OfflineScreen;
