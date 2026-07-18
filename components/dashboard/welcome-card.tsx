import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { MaterialIcons } from '@expo/vector-icons';

type WelcomeCardProps = {
  studentName: string;
  studentId: string;
  department: string;
  semester: string;
};

export function WelcomeCard({ studentName, studentId, department, semester }: WelcomeCardProps) {
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const primaryLight = useThemeColor({}, 'primaryLight');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.greetingSection}>
          <Text style={[styles.greeting, { color: muted }]}>{getGreeting()}</Text>
          <Text style={[styles.name, { color: text }]}>{studentName}</Text>
        </View>
        <Avatar name={studentName} size={56} />
      </View>

      <View style={styles.infoRow}>
        <InfoChip icon="badge" label={studentId} bg={primaryLight} iconColor={primary} textColor={text} />
        <InfoChip icon="school" label={department} bg={primaryLight} iconColor={primary} textColor={text} />
        <InfoChip icon="calendar-today" label={semester} bg={primaryLight} iconColor={primary} textColor={text} />
      </View>
    </Card>
  );
}

function InfoChip({
  icon,
  label,
  bg,
  iconColor,
  textColor,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  bg: string;
  iconColor: string;
  textColor: string;
}) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <MaterialIcons name={icon} size={14} color={iconColor} />
      <Text style={[styles.chipLabel, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingSection: {
    flex: 1,
    gap: 4,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
});
