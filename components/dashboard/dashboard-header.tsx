import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

export function DashboardHeader() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const background = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'separator');

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: background,
          borderBottomColor: border,
        },
      ]}
    >
      <Pressable
        style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
        onPress={openDrawer}
        hitSlop={12}
      >
        <MaterialIcons name="menu" size={24} color={text} />
      </Pressable>

      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: text }]}>Smart Survey</Text>
        <Text style={[styles.subtitle, { color: primary }]}>Field Inspection</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.notifButton, pressed && styles.pressed]}
        hitSlop={12}
      >
        <MaterialIcons name="notifications-none" size={24} color={text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
