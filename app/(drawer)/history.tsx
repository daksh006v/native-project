import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const accent = useThemeColor({}, 'accent');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: accent + '20' }]}>
          <MaterialIcons name="history" size={48} color={accent} />
        </View>
        <Text style={[styles.title, { color: text }]}>Survey History</Text>
        <Text style={[styles.subtitle, { color: muted }]}>
          View all your past survey inspections
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
