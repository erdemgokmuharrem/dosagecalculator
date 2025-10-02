import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { GRADIENTS } from '../constants';

interface ModernCardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'elevated' | 'outlined';
  gradientColors?: string[];
  style?: ViewStyle;
  onPress?: () => void;
}

const ModernCard: React.FC<ModernCardProps> = ({
  children,
  variant = 'default',
  gradientColors,
  style,
  onPress,
  ...touchableProps
}) => {
  const { theme } = useTheme();

  const getCardStyles = () => {
    const baseStyles = {
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surface,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 8,
        };
      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'gradient':
        return {
          ...baseStyles,
          overflow: 'hidden',
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surface,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        };
    }
  };

  const cardStyle = [getCardStyles(), style];

  const renderContent = () => {
    if (variant === 'gradient') {
      const colors = gradientColors || GRADIENTS.surface;
      return (
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      );
    }

    return <View style={styles.content}>{children}</View>;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.95}
        {...touchableProps}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ModernCard;
