import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Messages } from '@/constants/messages';

type TabIconProps = {
  color: string;
  size: number;
  focused: boolean;
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#f3f4f6',
          paddingTop: 8,
          paddingBottom: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: Messages.tabs.dashboard,
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: Messages.tabs.expenses,
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="balance"
        options={{
          title: Messages.tabs.balance,
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
