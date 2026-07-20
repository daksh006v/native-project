import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { WelcomeCard } from '@/components/dashboard/welcome-card';
import { RecentSurveyItem } from '@/components/dashboard/recent-survey-item';
import { Card } from '@/components/ui/card';
import { getSurveys, type Survey } from '@/utils/storage';

const STUDENT = {
  name: 'Daksh Bajaniya',
  studentId: 'CS-2025-29',
  department: 'Computer Science',
  semester: '3rd',
};

const FEATURES = [
  { key: 'new-survey', title: 'Create', icon: 'add' as const, route: '/new-survey', bg: '#1A1A2E', color: '#FFFFFF' }, // Replaced in render logic for theme
  { key: 'history', title: 'History', icon: 'history' as const, route: '/history' },
  { key: 'camera', title: 'Camera', icon: 'camera-alt' as const, route: '/camera' },
  { key: 'location', title: 'Location', icon: 'location-on' as const, route: '/location' },
  { key: 'clipboard', title: 'Clipboard', icon: 'content-paste' as const, route: '/clipboard' },
  { key: 'contacts', title: 'Contacts', icon: 'contacts' as const, route: '/contacts' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const primaryText = useThemeColor({}, 'primaryText');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const accent = useThemeColor({}, 'accent');
  const cardColor = useThemeColor({}, 'card');
  const insets = useSafeAreaInsets();

  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const data = await getSurveys();
          if (active) setSurveys(data);
        } catch {
          // silently fail
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => { active = false; };
    }, [])
  );

  const todayStr = new Date().toDateString();
  const todayCount = surveys.filter(s => new Date(s.createdAt).toDateString() === todayStr).length;
  const totalCount = surveys.length;
  const recentSurveys = surveys.slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <DashboardHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeaderSpacing}>
          <WelcomeCard
            studentName={STUDENT.name}
            studentId={STUDENT.studentId}
            department={STUDENT.department}
            semester={STUDENT.semester}
          />
        </View>

        {/* Survey Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>Activities</Text>
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={primary} />
            </View>
          ) : (
            <View style={styles.statsRow}>
              <Card style={[styles.statCard, { backgroundColor: cardColor }]}>
                <View style={[styles.statIcon, { backgroundColor: primaryLight }]}>
                  <MaterialIcons name="today" size={24} color={text} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={[styles.statCount, { color: text }]}>{todayCount}</Text>
                  <Text style={[styles.statLabel, { color: muted }]}>Today</Text>
                </View>
              </Card>
              <Card style={[styles.statCard, { backgroundColor: cardColor }]}>
                <View style={[styles.statIcon, { backgroundColor: primaryLight }]}>
                  <MaterialIcons name="assignment" size={24} color={text} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={[styles.statCount, { color: text }]}>{totalCount}</Text>
                  <Text style={[styles.statLabel, { color: muted }]}>Total</Text>
                </View>
              </Card>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>Quick Actions</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((feature, index) => {
              const isFirst = index === 0;
              return (
                <Pressable
                  key={feature.key}
                  style={({ pressed }) => [
                    styles.featureCard,
                    { backgroundColor: isFirst ? primary : cardColor },
                    pressed && styles.featurePressed,
                  ]}
                  onPress={() => router.push(feature.route as any)}
                >
                  <View style={[
                    styles.featureIcon, 
                    { backgroundColor: isFirst ? 'rgba(255,255,255,0.1)' : primaryLight }
                  ]}>
                    <MaterialIcons 
                      name={feature.icon} 
                      size={28} 
                      color={isFirst ? primaryText : text} 
                    />
                  </View>
                  <Text style={[
                    styles.featureTitle, 
                    { color: isFirst ? primaryText : text }
                  ]}>
                    {feature.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Quick Start CTA */}
        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [
              styles.ctaCard,
              { backgroundColor: accent },
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => router.push('/new-survey')}
          >
            <View style={styles.ctaContent}>
              <View style={styles.ctaTextSection}>
                <Text style={[styles.ctaTitle, { color: '#000' }]}>Start a New Survey</Text>
                <Text style={[styles.ctaSubtitle, { color: 'rgba(0,0,0,0.6)' }]}>
                  Capture field data with photos, location, and notes
                </Text>
              </View>
              <View style={[styles.ctaIconWrap, { backgroundColor: '#000' }]}>
                <MaterialIcons name="arrow-forward" size={24} color="#FFF" />
              </View>
            </View>
          </Pressable>
        </View>

        {/* Recent Surveys */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: text }]}>Recent Surveys</Text>
            {totalCount > 0 && (
              <Text
                style={[styles.seeAll, { color: text }]}
                onPress={() => router.push('/history')}
              >
                See All
              </Text>
            )}
          </View>
          <Card style={[styles.recentCard, { backgroundColor: cardColor }]}>
            {loading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="small" color={primary} />
              </View>
            ) : recentSurveys.length > 0 ? (
              recentSurveys.map((survey) => {
                const dateStr = new Date(survey.createdAt).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                });
                return (
                  <RecentSurveyItem
                    key={survey.id}
                    location={survey.siteName}
                    date={dateStr}
                    status="completed"
                  />
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="inbox" size={32} color={muted + '80'} />
                <Text style={[styles.emptyText, { color: muted }]}>
                  No surveys yet — create your first one!
                </Text>
              </View>
            )}
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
    paddingBottom: 40,
    gap: 32,
  },
  sectionHeaderSpacing: {
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 16,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    letterSpacing: -0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    opacity: 0.6,
  },
  loadingRow: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statCount: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 20,
  },
  statLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '31%',
    flexGrow: 1,
    flexBasis: '30%',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
    paddingHorizontal: 8,
    borderRadius: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
      android: { elevation: 2 },
    }),
  },
  featurePressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    textAlign: 'center',
  },
  ctaCard: {
    borderRadius: 28,
    padding: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 20 },
      android: { elevation: 4 },
    }),
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaTextSection: {
    flex: 1,
    gap: 6,
  },
  ctaTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    letterSpacing: -0.3,
  },
  ctaSubtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  ctaIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  recentCard: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    textAlign: 'center',
  },
});
