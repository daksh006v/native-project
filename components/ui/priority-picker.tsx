import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';

type Priority = 'low' | 'medium' | 'high' | 'critical';

type PriorityPickerProps = {
  value: Priority | null;
  onChange: (value: Priority) => void;
  error?: string;
};

const PRIORITIES: { key: Priority; label: string; color: string; bg: string }[] = [
  { key: 'low', label: 'Low', color: '#22C55E', bg: '#F0FDF4' },
  { key: 'medium', label: 'Medium', color: '#F59E0B', bg: '#FFFBEB' },
  { key: 'high', label: 'High', color: '#F97316', bg: '#FFF7ED' },
  { key: 'critical', label: 'Critical', color: '#EF4444', bg: '#FEF2F2' },
];

export function PriorityPicker({ value, onChange, error }: PriorityPickerProps) {
  const [visible, setVisible] = useState(false);
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const card = useThemeColor({}, 'card');
  const cardBorder = useThemeColor({}, 'cardBorder');
  const danger = useThemeColor({}, 'danger');
  const mutedLight = useThemeColor({}, 'mutedLight');

  const selected = PRIORITIES.find((p) => p.key === value);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <MaterialIcons name="flag" size={16} color={muted} style={styles.labelIcon} />
        <Text style={[styles.label, { color: muted }]}>Priority</Text>
        <Text style={[styles.required, { color: danger }]}>*</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: mutedLight,
            borderColor: error ? danger : cardBorder,
          },
          pressed && styles.pressed,
        ]}
        onPress={() => setVisible(true)}
      >
        {selected ? (
          <View style={styles.selectedRow}>
            <View style={[styles.dot, { backgroundColor: selected.color }]} />
            <Text style={[styles.selectedText, { color: text }]}>{selected.label}</Text>
          </View>
        ) : (
          <Text style={[styles.placeholder, { color: muted }]}>Select priority</Text>
        )}
        <MaterialIcons name="expand-more" size={22} color={muted} />
      </Pressable>

      {error ? (
        <View style={styles.errorRow}>
          <MaterialIcons name="error-outline" size={14} color={danger} />
          <Text style={[styles.error, { color: danger }]}>{error}</Text>
        </View>
      ) : null}

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={[styles.sheet, { backgroundColor: card }]}>
            <Text style={[styles.sheetTitle, { color: text }]}>Select Priority</Text>
            {PRIORITIES.map((p) => (
              <Pressable
                key={p.key}
                style={({ pressed }) => [
                  styles.option,
                  { borderBottomColor: cardBorder },
                  p.key === value && { backgroundColor: p.bg },
                  pressed && styles.optionPressed,
                ]}
                onPress={() => {
                  onChange(p.key);
                  setVisible(false);
                }}
              >
                <View style={[styles.dot, { backgroundColor: p.color }]} />
                <Text style={[styles.optionText, { color: text }]}>{p.label}</Text>
                {p.key === value && (
                  <MaterialIcons name="check" size={20} color={p.color} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
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
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pressed: {
    opacity: 0.7,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  selectedText: {
    fontSize: 15,
    fontWeight: '500',
  },
  placeholder: {
    fontSize: 15,
    fontWeight: '400',
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  sheet: {
    width: '100%',
    borderRadius: 20,
    padding: 8,
    gap: 4,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    padding: 12,
    paddingBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
});
