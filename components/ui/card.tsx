import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type CardProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function Card({ style, lightColor, darkColor, ...otherProps }: CardProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'card');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'cardBorder');

  return (
    <View style={[styles.card, { backgroundColor, borderColor }, style]} {...otherProps} />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
});
