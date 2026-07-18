import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
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
    accent: { bg: useThemeColor({}, 'accentLight'), iconColor: useThemeColor({}, 'accent') },
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
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 16,
    minHeight: 100,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
