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
  const accent = useThemeColor({}, 'accent');
  const danger = useThemeColor({}, 'danger');
  const mutedLight = useThemeColor({}, 'mutedLight');
  const muted = useThemeColor({}, 'muted');

  const colors = {
    primary: { bg: primary, textColor: '#FFFFFF' },
    accent: { bg: accent, textColor: '#FFFFFF' },
    danger: { bg: danger, textColor: '#FFFFFF' },
    muted: { bg: mutedLight, textColor: muted },
  };

  const { bg, textColor } = colors[variant];

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
