import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '../types';
import { COLORS } from '../constants';

// Screens
import HomeScreen from '../screens/HomeScreen';
import PatientInfoScreen from '../screens/PatientInfoScreen';
import DrugSelectionScreen from '../screens/DrugSelectionScreen';
import DosageCalculationScreen from '../screens/DosageCalculationScreen';
import ProductInfoScreen from '../screens/ProductInfoScreen';
import ChemotherapyScreen from '../screens/ChemotherapyScreen';
import ChemotherapyDoseScreen from '../screens/ChemotherapyDoseScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Calculator"
        component={HomeScreen}
        options={{
          title: 'Hesaplayıcı',
          tabBarLabel: 'Hesaplayıcı',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Geçmiş',
          tabBarLabel: 'Geçmiş',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Ayarlar',
          tabBarLabel: 'Ayarlar',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.surface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PatientInfo"
          component={PatientInfoScreen}
          options={{
            title: 'Hasta Bilgileri',
          }}
        />
        <Stack.Screen
          name="DrugSelection"
          component={DrugSelectionScreen}
          options={{
            title: 'İlaç Seçimi',
          }}
        />
        <Stack.Screen
          name="DosageCalculation"
          component={DosageCalculationScreen}
          options={{
            title: 'Doz Hesaplama',
          }}
        />
        <Stack.Screen
          name="ProductInfo"
          component={ProductInfoScreen}
          options={{
            title: 'Kısa Ürün Bilgisi',
          }}
        />
        <Stack.Screen
          name="Chemotherapy"
          component={ChemotherapyScreen}
          options={{
            title: 'Kemoterapi Hesaplayıcı',
          }}
        />
        <Stack.Screen
          name="ChemotherapyDose"
          component={ChemotherapyDoseScreen}
          options={{
            title: 'Kemoterapi Dozu',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
