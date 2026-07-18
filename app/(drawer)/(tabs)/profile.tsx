import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const card = useThemeColor({}, 'card');
  const cardBorder = useThemeColor({}, 'cardBorder');

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const stats = [
    { label: 'Surveys', value: '24', icon: 'assignment' as const },
    { label: 'Photos', value: '58', icon: 'camera-alt' as const },
    { label: 'Sites', value: '12', icon: 'place' as const },
  ];

  const menuItems = [
    { label: 'Edit Profile', icon: 'edit' as const },
    { label: 'Notifications', icon: 'notifications' as const },
    { label: 'Data Export', icon: 'file-download' as const },
    { label: 'Help & Support', icon: 'help' as const },
    { label: 'About App', icon: 'info' as const },
  ];

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: background }]}>
        <Pressable
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          onPress={openDrawer}
          hitSlop={12}
        >
          <MaterialIcons name="menu" size={28} color={text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: text }]}>Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.profileCard}>
          <Avatar name="Daksh Bajaniya" size={80} />
          <Text style={[styles.profileName, { color: text }]}>Daksh Bajaniya</Text>
          <Text style={[styles.profileEmail, { color: muted }]}>daksh.bajaniya@university.edu</Text>
          <View style={[styles.roleBadge, { backgroundColor: primaryLight }]}>
            <Text style={[styles.roleText, { color: primary }]}>Field Researcher</Text>
          </View>
        </Card>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <Card key={stat.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: primaryLight }]}>
                <MaterialIcons name={stat.icon} size={20} color={primary} />
              </View>
              <Text style={[styles.statValue, { color: text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: muted }]}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <View key={item.label}>
              {index > 0 && <View style={[styles.divider, { backgroundColor: cardBorder }]} />}
              <Pressable
                style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}
              >
                <View style={[styles.menuIcon, { backgroundColor: primaryLight }]}>
                  <MaterialIcons name={item.icon} size={20} color={primary} />
                </View>
                <Text style={[styles.menuLabel, { color: text }]}>{item.label}</Text>
                <MaterialIcons name="chevron-right" size={22} color={muted} />
              </Pressable>
            </View>
          ))}
        </Card>

        <Text style={[styles.versionText, { color: muted }]}>Smart Survey v1.0.0</Text>
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
  menuButton: {
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
  profileCard: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: '400',
  },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 4,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  menuCard: {
    padding: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 14,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginHorizontal: 12,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
  },
  pressed: {
    opacity: 0.6,
  },
});
