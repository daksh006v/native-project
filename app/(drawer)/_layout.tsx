import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
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

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const background = Colors[colorScheme].drawerBackground;
  const text = Colors[colorScheme].text;
  const muted = Colors[colorScheme].muted;
  const primary = Colors[colorScheme].primary;
  const separator = Colors[colorScheme].separator;

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 16, borderBottomColor: separator },
        ]}
      >
        <Avatar name="Daksh Bajaniya" size={64} />
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: text }]}>Daksh Bajaniya</Text>
          <Text style={[styles.email, { color: muted }]}>daksh.bajaniya@university.edu</Text>
          <View style={[styles.roleBadge, { backgroundColor: primary + '20' }]}>
            <Text style={[styles.roleText, { color: primary }]}>Field Researcher</Text>
          </View>
        </View>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerItems}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View
        style={[
          styles.footer,
          { borderTopColor: separator, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <Pressable style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
          <MaterialIcons name="logout" size={20} color={muted} />
          <Text style={[styles.logoutText, { color: muted }]}>Log Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme() ?? 'light';
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
        drawerType: 'front',
        drawerStyle: {
          width: 300,
          backgroundColor: colors.drawerBackground,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="new-survey"
        options={{
          title: 'New Survey',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle-outline" size={size} color={color} />
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
        name="history"
        options={{
          title: 'Survey History',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
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
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  email: {
    fontSize: 13,
    fontWeight: '400',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  drawerItems: {
    paddingTop: 8,
  },
  drawerLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
