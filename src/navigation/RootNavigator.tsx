import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { COLORS } from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import MainScreen from '@/src/screens/MainScreen';
import SettingsScreen from '@/src/screens/SettingsScreen';

export type RootTabParamList = {
  Main: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const NAV_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const TAB_ICONS = {
  Main: require('@assets/images/main.png'),
  Settings: require('@assets/images/settings.png'),
} as const;

export default function RootNavigator() {
  const { t } = useApp();

  return (
    <NavigationContainer theme={NAV_THEME}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          sceneContainerStyle: {
            backgroundColor: 'transparent',
          },
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
            tabBarIcon: ({ color, size }) => (
              <Image
                source={TAB_ICONS.Main}
                style={{
                  width: size ?? 22,
                  height: size ?? 22,
                  tintColor: color,
                }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: t('tabs.settings'),
            tabBarAccessibilityLabel: t('tabs.settings'),
            tabBarIcon: ({ color, size }) => (
              <Image
                source={TAB_ICONS.Settings}
                style={{
                  width: size ?? 22,
                  height: size ?? 22,
                  tintColor: color,
                }}
                resizeMode="contain"
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
