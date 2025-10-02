import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from './LoadingSpinner';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  refreshing?: boolean;
  style?: any;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  refreshing = false,
  style,
}) => {
  const { theme } = useTheme();

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.colors.primary}
      colors={[theme.colors.primary]}
      progressBackgroundColor={theme.colors.surface}
    />
  );

  return (
    <ScrollView
      style={[styles.container, style]}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PullToRefresh;
