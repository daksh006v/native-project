import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { getSurveys } from '@/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const primaryText = useThemeColor({}, 'primaryText');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const danger = useThemeColor({}, 'danger');

  const [surveyCount, setSurveyCount] = useState(0);

  useEffect(() => {
    getSurveys().then(data => setSurveyCount(data.length)).catch(() => {});
  }, []);

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      `This will permanently delete all ${surveyCount} saved surveys. This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@smart_survey:surveys');
              setSurveyCount(0);
              Alert.alert('Done', 'All survey data has been cleared.');
            } catch {
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ],
    );
  };

  const infoItems = [
    { icon: 'info' as const, label: 'App Name', value: 'SmartSurvey' },
    { icon: 'tag' as const, label: 'Version', value: '1.0.0' },
    { icon: 'code' as const, label: 'Built With', value: 'React Native + Expo' },
    { icon: 'person' as const, label: 'Developer', value: 'Daksh Bajaniya' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: background }]}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <MaterialIcons name="arrow-back" size={24} color={text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: text }]}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: text }]}>About</Text>
          {infoItems.map((item, index) => (
            <View key={item.label}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: primaryLight }]}>
                  <MaterialIcons name={item.icon} size={20} color={primaryText} />
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={[styles.infoLabel, { color: muted }]}>{item.label}</Text>
                  <Text style={[styles.infoValue, { color: text }]}>{item.value}</Text>
                </View>
              </View>
            </View>
          ))}
        </Card>

        {/* Storage */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: text }]}>Storage</Text>
          <View style={styles.storageRow}>
            <View style={[styles.infoIcon, { backgroundColor: primaryLight }]}>
              <MaterialIcons name="folder" size={20} color={primaryText} />
            </View>
            <View style={styles.infoTextWrap}>
              <Text style={[styles.infoLabel, { color: muted }]}>Saved Surveys</Text>
              <Text style={[styles.infoValue, { color: text }]}>{surveyCount} survey{surveyCount !== 1 ? 's' : ''}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Pressable
            style={({ pressed }) => [
              styles.dangerButton,
              { backgroundColor: surveyCount > 0 ? danger + '15' : primaryLight },
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleClearData}
            disabled={surveyCount === 0}
          >
            <MaterialIcons name="delete-forever" size={22} color={surveyCount > 0 ? danger : muted} />
            <Text style={[styles.dangerText, { color: surveyCount > 0 ? danger : muted }]}>
              Clear All Survey Data
            </Text>
          </Pressable>
        </Card>

        {/* Tech Stack */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: text }]}>Expo APIs Used</Text>
          <View style={styles.techGrid}>
            {[
              { name: 'expo-camera', icon: 'camera-alt' as const },
              { name: 'expo-location', icon: 'location-on' as const },
              { name: 'expo-contacts', icon: 'contacts' as const },
              { name: 'expo-clipboard', icon: 'content-paste' as const },
            ].map((tech) => (
              <View key={tech.name} style={[styles.techChip, { backgroundColor: primaryLight }]}>
                <MaterialIcons name={tech.icon} size={16} color={primaryText} />
                <Text style={[styles.techText, { color: primaryText }]}>{tech.name}</Text>
              </View>
            ))}
          </View>
        </Card>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 20,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  card: {
    padding: 24,
    gap: 8,
  },
  cardTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 64,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  storageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextWrap: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  infoValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  dangerText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  techChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  techText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  pressed: {
    opacity: 0.6,
  },
});
