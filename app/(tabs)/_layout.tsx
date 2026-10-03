import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#777e8b',
        tabBarStyle: {
          backgroundColor: '#181b22',
          borderTopColor: '#292d36',
          height: Platform.OS === 'web' ? 58 : 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Lobby',
        }}
      />

      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />

      <Tabs.Screen
        name="two"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}