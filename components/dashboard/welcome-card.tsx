import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

type WelcomeCardProps = {
  studentName: string;
  studentId: string;
  department: string;
  semester: string;
};

export function WelcomeCard({ studentName, studentId, department, semester }: WelcomeCardProps) {
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
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

      <View style={[styles.divider, { backgroundColor: useThemeColor({}, 'separator') }]} />

      <View style={styles.detailsRow}>
        <DetailItem label="ID" value={studentId} color={muted} textColor={text} />
        <DetailItem label="Department" value={department} color={muted} textColor={text} />
        <DetailItem label="Semester" value={semester} color={muted} textColor={text} />
      </View>
    </Card>
  );
}

function DetailItem({
  label,
  value,
  color,
  textColor,
}: {
  label: string;
  value: string;
  color: string;
  textColor: string;
}) {
  return (
    <View style={styles.detailItem}>
      <Text style={[styles.detailLabel, { color }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: textColor }]}>{value}</Text>
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
  divider: {
    height: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    gap: 2,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
