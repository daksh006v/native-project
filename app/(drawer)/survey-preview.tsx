import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { saveSurvey } from '@/utils/storage';

type Priority = 'low' | 'medium' | 'high' | 'critical';

const priorityColors: Record<Priority, { bg: string; text: string; label: string }> = {
  low: { bg: '#10B98120', text: '#10B981', label: 'Low' },
  medium: { bg: '#F59E0B20', text: '#F59E0B', label: 'Medium' },
  high: { bg: '#F9731620', text: '#F97316', label: 'High' },
  critical: { bg: '#EF444420', text: '#EF4444', label: 'Critical' },
};

export default function SurveyPreviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    siteName: string;
    clientName: string;
    description: string;
    priority: string;
    date: string;
  }>();

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const card = useThemeColor({}, 'card');
  const cardBorder = useThemeColor({}, 'cardBorder');
  const danger = useThemeColor({}, 'danger');

  const [saving, setSaving] = useState(false);

  const priority = (params.priority as Priority) || 'low';
  const pColor = priorityColors[priority];
  const surveyDate = params.date ? new Date(params.date) : new Date();

  const handleEdit = () => {
    router.back();
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await saveSurvey({
        siteName: params.siteName || '',
        clientName: params.clientName || '',
        description: params.description || '',
        priority,
        date: surveyDate.toISOString(),
      });

      Alert.alert('Success', 'Survey has been submitted successfully!', [
        {
          text: 'View History',
          onPress: () => router.replace('/(drawer)/history'),
        },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save survey. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const detailRows = [
    { icon: 'place' as const, label: 'Site Name', value: params.siteName },
    { icon: 'person' as const, label: 'Client', value: params.clientName },
    { icon: 'calendar-today' as const, label: 'Date', value: surveyDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }) },
  ];

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: background }]}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          onPress={handleEdit}
          hitSlop={12}
        >
          <MaterialIcons name="arrow-back" size={24} color={text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: text }]}>Survey Preview</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrap, { backgroundColor: primaryLight }]}>
              <MaterialIcons name="assignment" size={28} color={primary} />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={[styles.cardTitle, { color: text }]}>{params.siteName || 'Untitled Survey'}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: pColor.bg }]}>
                <Text style={[styles.priorityText, { color: pColor.text }]}>{pColor.label}</Text>
              </View>
            </View>
          </View>

          {detailRows.map((row, index) => (
            <View key={row.label}>
              {index > 0 || true ? <View style={[styles.divider, { backgroundColor: cardBorder }]} /> : null}
              <View style={styles.detailRow}>
                <MaterialIcons name={row.icon} size={20} color={muted} />
                <View style={styles.detailInfo}>
                  <Text style={[styles.detailLabel, { color: muted }]}>{row.label}</Text>
                  <Text style={[styles.detailValue, { color: text }]}>{row.value || '—'}</Text>
                </View>
              </View>
            </View>
          ))}
        </Card>

        <Card style={styles.descriptionCard}>
          <View style={styles.descriptionHeader}>
            <MaterialIcons name="description" size={20} color={muted} />
            <Text style={[styles.descriptionLabel, { color: muted }]}>Description</Text>
          </View>
          <Text style={[styles.descriptionText, { color: text }]}>
            {params.description || 'No description provided.'}
          </Text>
        </Card>

        <Card style={styles.attachmentsCard}>
          <Text style={[styles.attachmentsTitle, { color: text }]}>Attachments & Data</Text>
          {[
            { icon: 'camera-alt' as const, label: 'Photo', status: 'Not Attached' },
            { icon: 'contacts' as const, label: 'Contact', status: 'Not Linked' },
            { icon: 'location-on' as const, label: 'Location', status: 'Not Captured' },
            { icon: 'notes' as const, label: 'Notes', status: 'No Notes' },
          ].map((item, index) => (
            <View key={item.label}>
              <View style={[styles.divider, { backgroundColor: cardBorder }]} />
              <View style={styles.attachRow}>
                <View style={[styles.attachIcon, { backgroundColor: primaryLight }]}>
                  <MaterialIcons name={item.icon} size={18} color={primary} />
                </View>
                <Text style={[styles.attachLabel, { color: text }]}>{item.label}</Text>
                <Text style={[styles.attachStatus, { color: muted }]}>{item.status}</Text>
              </View>
            </View>
          ))}
        </Card>

        <View style={styles.actionRow}>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: cardBorder },
              pressed && styles.pressed,
            ]}
            onPress={handleEdit}
          >
            <MaterialIcons name="edit" size={20} color={text} />
            <Text style={[styles.actionBtnText, { color: text }]}>Edit</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              styles.submitBtn,
              { backgroundColor: primary },
              pressed && styles.pressed,
            ]}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
                <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>Submit Survey</Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  detailCard: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  descriptionCard: {
    padding: 20,
    gap: 12,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  attachmentsCard: {
    padding: 20,
  },
  attachmentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  attachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  attachIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  attachStatus: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  submitBtn: {
    flex: 2,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.6,
  },
});
