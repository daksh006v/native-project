import React from 'react';
import { StyleSheet, ScrollView, View, Text, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { WelcomeCard } from '@/components/dashboard/welcome-card';
import { SurveyStatCard } from '@/components/dashboard/survey-stat-card';
import { QuickActionCard } from '@/components/dashboard/quick-action-card';
import { RecentSurveyItem } from '@/components/dashboard/recent-survey-item';
import { Card } from '@/components/ui/card';

const MOCK_STUDENT = {
  name: 'Daksh Bajaniya',
  studentId: 'CS-2025-29',
  department: 'Computer Science',
  semester: '3rd',
};

const MOCK_RECENT_SURVEYS = [
  {
    id: '1',
    location: 'Rajasthan Water Basin - Sector 12',
    date: '18 Jul 2026, 9:30 AM',
    status: 'completed' as const,
  },
  {
    id: '2',
    location: 'Delhi NCR Air Quality Station',
    date: '17 Jul 2026, 3:15 PM',
    status: 'completed' as const,
  },
  {
    id: '3',
    location: 'Gujarat Soil Testing Site',
    date: '17 Jul 2026, 11:00 AM',
    status: 'in-progress' as const,
  },
  {
    id: '4',
    location: 'Mumbai Coastal Survey Zone',
    date: '16 Jul 2026, 2:45 PM',
    status: 'pending' as const,
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const primary = useThemeColor({}, 'primary');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <DashboardHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <WelcomeCard
            studentName={MOCK_STUDENT.name}
            studentId={MOCK_STUDENT.studentId}
            department={MOCK_STUDENT.department}
            semester={MOCK_STUDENT.semester}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>Overview</Text>
          <View style={styles.statsRow}>
            <SurveyStatCard count={12} label="Today's Surveys" />
            <View style={styles.statSpacer} />
            <SurveyStatCard count={87} label="Total Surveys" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <QuickActionCard
              title="New Survey"
              icon="add-circle-outline"
              onPress={() => router.push('/new-survey')}
              variant="primary"
            />
            <View style={styles.actionSpacer} />
            <QuickActionCard
              title="View History"
              icon="history"
              onPress={() => router.push('/history')}
              variant="accent"
            />
          </View>
          <View style={[styles.actionsRow, { marginTop: 12 }]}>
            <QuickActionCard
              title="Upload Data"
              icon="cloud-upload"
              onPress={() => Alert.alert('Coming Soon', 'Upload Data feature will be available in a future update.')}
              variant="muted"
            />
            <View style={styles.actionSpacer} />
            <QuickActionCard
              title="Sync Status"
              icon="sync"
              onPress={() => Alert.alert('Coming Soon', 'Sync Status feature will be available in a future update.')}
              variant="primary"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: text }]}>Recent Surveys</Text>
            <Text
              style={[styles.seeAll, { color: primary }]}
              onPress={() => router.push('/history')}
            >
              See All
            </Text>
          </View>
          <Card style={styles.recentCard}>
            {MOCK_RECENT_SURVEYS.map((survey, index) => (
              <RecentSurveyItem
                key={survey.id}
                location={survey.location}
                date={survey.date}
                status={survey.status}
              />
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
  },
  statSpacer: {
    width: 12,
  },
  actionsRow: {
    flexDirection: 'row',
  },
  actionSpacer: {
    width: 12,
  },
  recentCard: {
    padding: 4,
    paddingHorizontal: 16,
  },
});
