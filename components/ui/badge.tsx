import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

type BadgeProps = {
  label: string;
  variant?: 'primary' | 'accent' | 'danger' | 'muted';
  style?: ViewStyle;
};

export function Badge({ label, variant = 'primary', style }: BadgeProps) {
  const primary = useThemeColor({}, 'primary');
  const primaryText = useThemeColor({}, 'primaryText');
  const accent = useThemeColor({}, 'accent');
  const accentText = useThemeColor({}, 'accentText');
  const danger = useThemeColor({}, 'danger');
  const mutedLight = useThemeColor({}, 'mutedLight');
  const muted = useThemeColor({}, 'muted');

  const BADGE_COLORS = {
    primary: { bg: primary, textColor: primaryText },
    accent: { bg: accent, textColor: accentText },
    danger: { bg: danger, textColor: '#FFFFFF' },
    muted: { bg: mutedLight, textColor: muted },
  };

  const { bg, textColor } = BADGE_COLORS[variant];

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
