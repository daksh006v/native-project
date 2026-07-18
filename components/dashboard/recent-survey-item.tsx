import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/badge';

type RecentSurveyItemProps = {
  location: string;
  date: string;
  status: 'completed' | 'pending' | 'in-progress';
};

export function RecentSurveyItem({ location, date, status }: RecentSurveyItemProps) {
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const separator = useThemeColor({}, 'separator');
  const statusConfig = {
    completed: { label: 'Completed', variant: 'primary' as const },
    pending: { label: 'Pending', variant: 'muted' as const },
    'in-progress': { label: 'In Progress', variant: 'accent' as const },
  };

  const { label: statusLabel, variant } = statusConfig[status];

  return (
    <View style={[styles.container, { borderBottomColor: separator }]}>
      <View style={[styles.iconWrap, { backgroundColor: useThemeColor({}, 'primaryLight') }]}>
        <MaterialIcons name="place" size={20} color={useThemeColor({}, 'primary')} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.location, { color: text }]} numberOfLines={1}>
          {location}
        </Text>
        <Text style={[styles.date, { color: muted }]}>{date}</Text>
      </View>
      <Badge label={statusLabel} variant={variant} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  location: {
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    fontWeight: '400',
  },
});
