import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const mutedLight = useThemeColor({}, 'mutedLight');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: mutedLight }]}>
          <MaterialIcons name="settings" size={48} color={muted} />
        </View>
        <Text style={[styles.title, { color: text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: muted }]}>
          Configure app preferences and account settings
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
  },
});
