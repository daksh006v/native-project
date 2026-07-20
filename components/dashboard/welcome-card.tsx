import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';

type WelcomeCardProps = {
  studentName: string;
  studentId: string;
  department: string;
  semester: string;
};

export function WelcomeCard({ studentName, studentId, department, semester }: WelcomeCardProps) {
  const heroCard = useThemeColor({}, 'heroCard');
  const heroText = useThemeColor({}, 'heroText');

  return (
    <View style={[styles.container, { backgroundColor: heroCard }]}>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.textStack}>
            <Text style={[styles.greeting, { color: 'rgba(255,255,255,0.8)' }]}>
              Welcome back,
            </Text>
            <Text style={[styles.name, { color: heroText }]}>
              {studentName}
            </Text>
          </View>
          <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <MaterialIcons name="school" size={28} color={heroText} />
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.infoBadge}>
            <MaterialIcons name="badge" size={16} color={heroText} />
            <Text style={[styles.badgeText, { color: heroText }]}>{studentId}</Text>
          </View>
          <View style={styles.infoBadge}>
            <MaterialIcons name="timeline" size={16} color={heroText} />
            <Text style={[styles.badgeText, { color: heroText }]}>{semester}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    marginHorizontal: 16,
    overflow: 'hidden',
    position: 'relative',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  content: {
    padding: 24,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textStack: {
    flex: 1,
    paddingRight: 16,
  },
  greeting: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    letterSpacing: -0.5,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  badgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  }
});
