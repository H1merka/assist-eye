/**
 * Корневой навигатор приложения.
 *
 * Stack Navigator: Home → Settings | History
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {HomeScreen} from '@ui/screens/HomeScreen';
import {SettingsScreen} from '@ui/screens/SettingsScreen';
import {HistoryScreen} from '@ui/screens/HistoryScreen';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Настройки'}}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{title: 'История'}}
      />
    </Stack.Navigator>
  );
}
