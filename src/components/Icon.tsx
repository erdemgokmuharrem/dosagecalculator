import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: string } = {
      // Navigation icons
      home: '🏠',
      calculator: '🧮',
      history: '📋',
      settings: '⚙️',
      user: '👤',
      patient: '🏥',

      // Medical icons
      pill: '💊',
      syringe: '💉',
      heart: '❤️',
      stethoscope: '🩺',
      medical: '⚕️',
      hospital: '🏥',

      // Action icons
      plus: '➕',
      minus: '➖',
      check: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️',
      search: '🔍',
      filter: '🔽',
      refresh: '🔄',
      save: '💾',
      edit: '✏️',
      delete: '🗑️',
      share: '📤',
      download: '⬇️',
      upload: '⬆️',

      // UI icons
      arrow_right: '➡️',
      arrow_left: '⬅️',
      arrow_up: '⬆️',
      arrow_down: '⬇️',
      menu: '☰',
      close: '✕',
      back: '🔙',
      forward: '🔜',

      // Status icons
      success: '✅',
      loading: '⏳',
      pending: '⏸️',
      completed: '🎯',

      // Time icons
      clock: '🕐',
      calendar: '📅',
      time: '⏰',

      // Form icons
      email: '📧',
      phone: '📞',
      location: '📍',
      age: '🎂',
      weight: '⚖️',
      height: '📏',
      gender_male: '♂️',
      gender_female: '♀️',
    };

    return icons[iconName] || '❓';
  };

  return (
    <Text
      style={[
        styles.icon,
        {
          fontSize: size,
          color: iconColor,
        },
        style,
      ]}
    >
      {getIcon(name)}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});

export default Icon;
