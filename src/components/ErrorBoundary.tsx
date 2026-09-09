import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { reportError } from '../services/monitoring';

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

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // This used to only console.error, so a crash that reached the boundary was
    // invisible in production — the very crashes worth knowing about.
    reportError(error, {
      boundary: 'root',
      componentStack: errorInfo.componentStack?.slice(0, 500) ?? 'unknown',
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback error={this.state.error} onReset={this.handleReset} />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ error?: Error; onReset: () => void }> = ({
  error,
  onReset,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('errors.crashTitle')}</Text>
      <Text style={styles.message}>{t('errors.crashMessage')}</Text>

      {__DEV__ && error && (
        <Text style={styles.errorDetails}>{error.message}</Text>
      )}

      {/* Clears the boundary and re-mounts the tree. `window.location.reload()`
          is a web API and was a no-op here, so this button did nothing. */}
      <TouchableOpacity
        style={styles.button}
        onPress={onReset}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>{t('errors.crashRetry')}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Hook-based Error Boundary for functional components
export const ErrorBoundary: React.FC<Props> = props => {
  return <ErrorBoundaryClass {...props} />;
};

export default ErrorBoundary;
