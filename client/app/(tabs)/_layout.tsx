import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(13, 16, 38, 0.92)',
          borderTopWidth: 0,
          height: Platform.OS === 'web' ? 60 : 56 + insets.bottom,
          paddingBottom: Platform.OS === 'web' ? 0 : insets.bottom,
        },
        tabBarActiveTintColor: '#7B6EF6',
        tabBarInactiveTintColor: '#4A4860',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '监测',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="mic" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '历史',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="list" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
