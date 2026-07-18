import React from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  required?: boolean;
};

export function FormField({ label, error, icon, required, ...inputProps }: FormFieldProps) {
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const cardBorder = useThemeColor({}, 'cardBorder');
  const danger = useThemeColor({}, 'danger');
  const mutedLight = useThemeColor({}, 'mutedLight');

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        {icon && <MaterialIcons name={icon} size={16} color={muted} style={styles.labelIcon} />}
        <Text style={[styles.label, { color: muted }]}>{label}</Text>
        {required && <Text style={[styles.required, { color: danger }]}>*</Text>}
      </View>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: mutedLight,
            color: text,
            borderColor: error ? danger : cardBorder,
          },
        ]}
        placeholderTextColor={muted}
        {...inputProps}
      />

      {error ? (
        <View style={styles.errorRow}>
          <MaterialIcons name="error-outline" size={14} color={danger} />
          <Text style={[styles.error, { color: danger }]}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  required: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '500',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  error: {
    fontSize: 12,
    fontWeight: '500',
  },
});
