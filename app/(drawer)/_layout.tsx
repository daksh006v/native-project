import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import {
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/avatar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Badge } from '@/components/ui/badge';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const background = Colors[colorScheme].drawerBackground;
  const text = Colors[colorScheme].text;
  const muted = Colors[colorScheme].muted;

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 24 },
        ]}
      >
        <Avatar name="Daksh Bajaniya" size={64} />
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: text }]}>Daksh Bajaniya</Text>
          <Text style={[styles.email, { color: muted }]}>daksh.bajaniya@university.edu</Text>
          <View style={{ marginTop: 8 }}>
            <Badge label="Field Researcher" variant="primary" />
          </View>
        </View>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerItems}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={{ paddingBottom: insets.bottom + 16 }} />
    </View>
  );
}

export default function DrawerLayout() {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.drawerActive,
        drawerInactiveTintColor: colors.drawerInactive,
        drawerActiveBackgroundColor: colors.primaryLight,
        drawerLabelStyle: styles.drawerLabel,
        drawerItemStyle: styles.drawerItem,
        drawerType: 'front',
        drawerStyle: {
          width: 320,
          backgroundColor: colors.drawerBackground,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="camera"
        options={{
          title: 'Camera',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="camera-alt" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="location"
        options={{
          title: 'Location',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="location-on" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="contacts" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="clipboard"
        options={{
          title: 'Clipboard',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="content-paste" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="survey-preview"
        options={{
          title: 'Survey Preview',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  headerInfo: {
    gap: 2,
  },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    letterSpacing: -0.3,
  },
  email: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  drawerItems: {
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  drawerItem: {
    borderRadius: 16,
    paddingVertical: 2,
  },
  drawerLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    marginLeft: -12,
  },
});
