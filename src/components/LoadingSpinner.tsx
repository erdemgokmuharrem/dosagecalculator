import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  text,
  color,
}) => {
  const { theme } = useTheme();
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };

    spin();
  }, [spinValue]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 20,
          height: 20,
          borderWidth: 2,
        };
      case 'large':
        return {
          width: 60,
          height: 60,
          borderWidth: 4,
        };
      default:
        return {
          width: 40,
          height: 40,
          borderWidth: 3,
        };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return theme.fontSizes.sm;
      case 'large':
        return theme.fontSizes.lg;
      default:
        return theme.fontSizes.md;
    }
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinnerColor = color || theme.colors.primary;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          getSizeStyles(),
          {
            borderColor: `${spinnerColor}20`,
            borderTopColor: spinnerColor,
            transform: [{ rotate: spin }],
          },
        ]}
      />
      {text && (
        <Text
          style={[
            styles.text,
            {
              fontSize: getTextSize(),
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.sm,
            },
          ]}
        >
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    borderRadius: 50,
  },
  text: {
    textAlign: 'center',
  },
});

export default LoadingSpinner;
