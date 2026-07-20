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
  const primaryLight = useThemeColor({}, 'primaryLight');
  const primaryText = useThemeColor({}, 'text'); // using main text color for icon inside primaryLight

  const statusConfig = {
    completed: { label: 'Completed', variant: 'accent' as const },
    pending: { label: 'Pending', variant: 'muted' as const },
    'in-progress': { label: 'In Progress', variant: 'primary' as const },
  };

  const { label: statusLabel, variant } = statusConfig[status];

  return (
    <View style={[styles.container, { borderBottomColor: separator }]}>
      <View style={[styles.iconWrap, { backgroundColor: primaryLight }]}>
        <MaterialIcons name="place" size={24} color={primaryText} />
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
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 16,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  location: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
});
