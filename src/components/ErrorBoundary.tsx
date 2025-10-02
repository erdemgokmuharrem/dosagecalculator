import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Send error to Sentry or other error tracking service
    if (__DEV__) {
      console.log('Error Info:', errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: theme.fontSizes.xl,
      fontWeight: 'bold',
      color: theme.colors.error,
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
    errorDetails: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      fontFamily: 'monospace',
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    buttonText: {
      color: theme.colors.surface,
      fontSize: theme.fontSizes.md,
      fontWeight: 'bold',
    },
  });

  const handleReload = () => {
    // Reset error boundary state
    window.location?.reload?.();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bir Hata Oluştu</Text>
      <Text style={styles.message}>
        Uygulamada beklenmeyen bir hata oluştu. Lütfen uygulamayı yeniden başlatın.
      </Text>
      
      {__DEV__ && error && (
        <Text style={styles.errorDetails}>
          {error.message}
        </Text>
      )}
      
      <TouchableOpacity style={styles.button} onPress={handleReload}>
        <Text style={styles.buttonText}>Yeniden Başlat</Text>
      </TouchableOpacity>
    </View>
  );
};

// Hook-based Error Boundary for functional components
export const ErrorBoundary: React.FC<Props> = (props) => {
  return <ErrorBoundaryClass {...props} />;
};

export default ErrorBoundary;
