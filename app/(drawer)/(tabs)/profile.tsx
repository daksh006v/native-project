import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const INFO_ITEMS = [
  { label: 'Student ID', value: 'CS-2025-29', icon: 'badge' as const },
  { label: 'Department', value: 'Computer Science', icon: 'school' as const },
  { label: 'Semester', value: '3rd Semester', icon: 'calendar-today' as const },
];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const primaryText = useThemeColor({}, 'text'); // using text for icons on primaryLight
  const cardColor = useThemeColor({}, 'card');
  const accent = useThemeColor({}, 'accent');

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: background }]}>
        <Text style={[styles.headerTitle, { color: text }]}>Profile</Text>
        <Pressable
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          onPress={openDrawer}
          hitSlop={12}
        >
          <MaterialIcons name="menu" size={28} color={text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.profileCard}>
          <Avatar name="Daksh Bajaniya" size={88} />
          <Text style={[styles.profileName, { color: text }]}>Daksh Bajaniya</Text>
          <Text style={[styles.profileEmail, { color: muted }]}>daksh.bajaniya@university.edu</Text>
          <View style={styles.roleWrap}>
            <Badge label="Field Researcher" variant="primary" />
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={[styles.infoSectionTitle, { color: text }]}>Student Information</Text>
          {INFO_ITEMS.map((item, index) => (
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

        <Pressable
          style={({ pressed }) => [
            styles.actionBanner,
            { backgroundColor: accent },
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => router.push('/new-survey')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#000' }]}>
            <MaterialIcons name="add" size={24} color="#FFF" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={[styles.actionTitle, { color: '#000' }]}>Start a New Survey</Text>
            <Text style={[styles.actionSubtitle, { color: 'rgba(0,0,0,0.6)' }]}>Begin field data collection</Text>
          </View>
        </Pressable>
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
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 24,
    letterSpacing: -0.5,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  profileCard: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    marginTop: 12,
  },
  profileEmail: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  roleWrap: {
    marginTop: 8,
  },
  infoCard: {
    padding: 24,
    gap: 8,
  },
  infoSectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    marginBottom: 12,
  },
  infoRow: {
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
    fontSize: 12,
  },
  infoValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 64,
  },
  actionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 28,
    gap: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextWrap: {
    flex: 1,
    gap: 4,
  },
  actionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  actionSubtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  pressed: {
    opacity: 0.6,
  },
});
