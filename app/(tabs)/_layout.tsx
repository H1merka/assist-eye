import { Tabs } from 'expo-router';
import { History, Mic, Settings } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { useApp } from '@/context/AppContext';

export default function TabLayout() {
  const { t } = useApp();

  return (
    <Tabs
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
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabMain'),
          tabBarAccessibilityLabel: t('tabMain'),
          tabBarIcon: ({ color, size }) => (
            <Mic color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabHistory'),
          tabBarAccessibilityLabel: t('tabHistory'),
          tabBarIcon: ({ color, size }) => (
            <History color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabSettings'),
          tabBarAccessibilityLabel: t('tabSettings'),
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
