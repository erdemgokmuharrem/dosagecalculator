import React from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

// Screens
import CalculatorScreen from '../screens/CalculatorScreen';
import VademecumScreen from '../screens/VademecumScreen';
import DrugDetailScreen from '../screens/DrugDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';

// Legacy screens (kept for chemotherapy)
import ChemotherapyDoseScreen from '../screens/ChemotherapyDoseScreen';
import ProductInfoScreen from '../screens/ProductInfoScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

interface TabIconProps {
  focused: boolean;
  icon: string;
  label: string;
  color: string;
}

const TAB_COUNT = 4;

const TabIcon: React.FC<TabIconProps> = ({ focused, icon, label, color }) => {
  // The icon slot is only as wide as its content, so the label needs an explicit
  // width. It used to be 60pt, which cut "Hesaplayıcı" to "Hesaplay…"; longer
  // translations (ru "Калькулятор") shrink to fit rather than truncate.
  const { width } = useWindowDimensions();
  const labelWidth = Math.floor(width / TAB_COUNT) - 8;
  return (
    <View style={[tabStyles.container, { width: labelWidth }]}>
      <Text style={tabStyles.icon}>{icon}</Text>
      <Text
        style={[
          tabStyles.label,
          { color, fontWeight: focused ? '800' : '600' },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {label}
      </Text>
    </View>
  );
};

const tabStyles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22, marginBottom: 2, lineHeight: 26 },
  label: {
    fontSize: 10,
    letterSpacing: 0,
    textAlign: 'center',
    includeFontPadding: false,
  },
});

const TabNavigator: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 12,
        },
      }}
    >
      <Tab.Screen
        name="CalculatorTab"
        component={CalculatorScreen}
        options={{
          title: t('navigation.calculator'),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="⚡"
              label={t('navigation.calculator')}
              color={
                focused ? theme.colors.primary : theme.colors.textSecondary
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="VademecumTab"
        component={VademecumScreen}
        options={{
          title: t('navigation.vademecum'),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="💊"
              label={t('navigation.vademecum')}
              color={
                focused ? theme.colors.primary : theme.colors.textSecondary
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{
          title: t('navigation.history'),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="📊"
              label={t('navigation.history')}
              color={
                focused ? theme.colors.primary : theme.colors.textSecondary
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: t('navigation.settings'),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="⚙️"
              label={t('navigation.settings')}
              color={
                focused ? theme.colors.primary : theme.colors.textSecondary
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '800' },
          headerShadowVisible: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DrugDetail"
          component={DrugDetailScreen}
          options={{
            title: t('vademecum.title'),
            headerBackTitle: t('common.back'),
          }}
        />
        <Stack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{
            title: `👑 ${t('subscription.title')}`,
            headerBackTitle: t('common.back'),
          }}
        />
        <Stack.Screen
          name="ChemotherapyDose"
          component={ChemotherapyDoseScreen}
          options={{
            title: t('navigation.chemotherapy', 'Chemotherapy Dose'),
            headerBackTitle: t('common.back'),
          }}
        />
        <Stack.Screen
          name="ProductInfo"
          component={ProductInfoScreen}
          options={{
            title: t('vademecum.indications'),
            headerBackTitle: t('common.back'),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
