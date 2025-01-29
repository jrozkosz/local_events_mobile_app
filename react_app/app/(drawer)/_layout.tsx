import React from 'react';
import { Text, Alert, TouchableOpacity } from 'react-native';
import { Redirect, Stack, router } from 'expo-router';
import { useSession } from '../context/auth_context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer,  } from 'expo-router/drawer';
import { useTheme } from "../components/theme_context";
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerContent from '../components/custom_drawer_content';

export default function AppLayout() {
  const { session, isLoading, signOut } = useSession();
//   const { theme } = useTheme();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/signin_screen" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <Drawer
        drawerContent={CustomDrawerContent}
      >
        <Drawer.Screen
          name="home_screen"
          options={{
            drawerLabel: 'Home',
            title: 'Home dashboard',
            drawerIcon: ({size, color}) => (
              <Ionicons name="home-outline" size={size} solor={color}></Ionicons>
            ),
          }}
        />
        <Drawer.Screen
          name="myevents_screen"
          options={{
            drawerLabel: 'My Events',
            title: 'Events',
            drawerIcon: ({size, color}) => (
              <Ionicons name="calendar-outline" size={size} color={color}></Ionicons>
            ),
          }}
        />
        <Drawer.Screen
          name="profile_settings_screen"
          options={{
            drawerLabel: `Profile's settings`,
            title: 'Settings',
            drawerIcon: ({size, color}) => (
              <Ionicons name="settings-outline" size={size} color={color}></Ionicons>
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}