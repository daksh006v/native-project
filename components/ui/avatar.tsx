import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

type AvatarProps = {
  name: string;
  size?: number;
};

export function Avatar({ name, size = 48 }: AvatarProps) {
  const primary = useThemeColor({}, 'primary');
  const primaryLight = useThemeColor({}, 'primaryLight');

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: primary,
        },
      ]}
    >
      <Text style={[styles.initials, { color: primaryLight, fontSize: size * 0.38 }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
  },
});
