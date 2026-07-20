import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';

type Priority = 'low' | 'medium' | 'high' | 'critical';

type PriorityPickerProps = {
  value: Priority | null;
  onChange: (value: Priority) => void;
  error?: string;
};

const PRIORITIES: { key: Priority; label: string; color: string; bg: string }[] = [
  { key: 'low', label: 'Low', color: '#16A34A', bg: '#DCFCE7' },
  { key: 'medium', label: 'Medium', color: '#D97706', bg: '#FEF3C7' },
  { key: 'high', label: 'High', color: '#EA580C', bg: '#FFEDD5' },
  { key: 'critical', label: 'Critical', color: '#DC2626', bg: '#FEE2E2' },
];

export function PriorityPicker({ value, onChange, error }: PriorityPickerProps) {
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const danger = useThemeColor({}, 'danger');
  const cardBorder = useThemeColor({}, 'cardBorder');
  const card = useThemeColor({}, 'card');

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <MaterialIcons name="flag" size={16} color={muted} style={styles.labelIcon} />
        <Text style={[styles.label, { color: muted }]}>PRIORITY</Text>
        <Text style={[styles.required, { color: danger }]}>*</Text>
      </View>

      <View style={[styles.pickerRow, error && { borderColor: danger, borderWidth: 1, borderRadius: 12, padding: 2 }]}>
        {PRIORITIES.map((p) => {
          const isSelected = p.key === value;
          return (
            <Pressable
              key={p.key}
              onPress={() => onChange(p.key)}
              style={({ pressed }) => [
                styles.option,
                { backgroundColor: isSelected ? p.bg : card, borderColor: isSelected ? p.color : cardBorder },
                pressed && styles.pressed,
                Platform.OS === 'ios' && isSelected && { shadowColor: p.color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 }
              ]}
            >
              <Text style={[styles.optionText, { color: isSelected ? p.color : muted, fontWeight: isSelected ? '700' : '500' }]}>
                {p.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

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
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  required: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  option: {
    flex: 1,
    minWidth: '48%', // Allows 2x2 grid on small screens, or 4 in a row on wide
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 15,
  },
  pressed: {
    opacity: 0.7,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  error: {
    fontSize: 12,
    fontWeight: '600',
  },
});
