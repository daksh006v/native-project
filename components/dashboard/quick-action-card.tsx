import React from 'react';
import { StyleSheet, Text, Pressable, View, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';

type QuickActionCardProps = {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  variant?: 'primary' | 'accent' | 'danger' | 'muted';
};

export function QuickActionCard({
  title,
  icon,
  onPress,
  variant = 'primary',
}: QuickActionCardProps) {
  const colors = {
    primary: { bg: useThemeColor({}, 'primaryLight'), iconColor: useThemeColor({}, 'primary') },
    accent: { bg: useThemeColor({}, 'primaryLight'), iconColor: useThemeColor({}, 'accent') },
    danger: { bg: useThemeColor({}, 'dangerLight'), iconColor: useThemeColor({}, 'danger') },
    muted: { bg: useThemeColor({}, 'mutedLight'), iconColor: useThemeColor({}, 'muted') },
  };

  const { bg, iconColor } = colors[variant];
  const text = useThemeColor({}, 'text');

  return (
    <Pressable
      style={({ pressed }) => [styles.card, { backgroundColor: bg }, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
        <MaterialIcons name={icon} size={22} color={iconColor} />
      </View>
      <Text style={[styles.title, { color: text }]} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    minHeight: 110,
    ...Platform.select({
      ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'left',
  },
});
