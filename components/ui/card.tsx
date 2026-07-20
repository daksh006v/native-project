import React from 'react';
import { StyleSheet, View, type ViewProps, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type CardProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function Card({ style, lightColor, darkColor, ...otherProps }: CardProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'card');

  return (
    <View style={[styles.card, { backgroundColor }, style]} {...otherProps} />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 24,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
});
