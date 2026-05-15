import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS } from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import MainScreen from '@/src/screens/MainScreen';
import HistoryScreen from '@/src/screens/HistoryScreen';
import SettingsScreen from '@/src/screens/SettingsScreen';

export type RootTabParamList = {
  Main: undefined;
  History: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootNavigator() {
  const { t } = useApp();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            height: 72,
            paddingBottom: 12,
            paddingTop: 8,
          },
          tabBarActiveTintColor: COLORS.tabActive,
          tabBarInactiveTintColor: COLORS.tabInactive,
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Main"
          component={MainScreen}
          options={{
            title: t('tabs.main'),
            tabBarAccessibilityLabel: t('tabs.main'),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: t('tabs.history'),
            tabBarAccessibilityLabel: t('tabs.history'),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: t('tabs.settings'),
            tabBarAccessibilityLabel: t('tabs.settings'),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
