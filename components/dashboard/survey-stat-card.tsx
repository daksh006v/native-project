import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Card } from '@/components/ui/card';
import { MaterialIcons } from '@expo/vector-icons';

type SurveyStatCardProps = {
  count: number;
  label?: string;
};

export function SurveyStatCard({ count, label = "Today's Surveys" }: SurveyStatCardProps) {
  const primary = useThemeColor({}, 'primary');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');

  return (
    <Card style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: primaryLight }]}>
        <MaterialIcons name="assignment" size={24} color={primary} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.count, { color: text }]}>{count}</Text>
        <Text style={[styles.label, { color: muted }]}>{label}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  count: {
    fontSize: 32,
    fontWeight: '800',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});
