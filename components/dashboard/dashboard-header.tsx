import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/ui/avatar';
import { useThemeSetting } from '@/store/theme';

export function DashboardHeader() {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, setTheme } = useThemeSetting();
  const text = useThemeColor({}, 'text');
  const background = useThemeColor({}, 'background'); // use background instead of card for header

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: background,
        },
      ]}
    >
      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: text }]}>SmartSurvey</Text>
      </View>
      
      <View style={styles.rightSection}>
        <Pressable 
          style={({ pressed }) => [styles.avatarBtn, pressed && styles.pressed]}
          onPress={() => router.push('/profile')}
        >
          <Avatar name="Daksh Bajaniya" size={36} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          onPress={toggleTheme}
          hitSlop={8}
        >
          <MaterialIcons name={theme === 'dark' ? 'light-mode' : 'dark-mode'} size={24} color={text} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          onPress={openDrawer}
          hitSlop={12}
        >
          <MaterialIcons name="menu" size={28} color={text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  titleSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBtn: {
    borderRadius: 18,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 24,
    letterSpacing: -0.5,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
