import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';

type DatePickerFieldProps = {
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
};

export function DatePickerField({ value, onChange, error }: DatePickerFieldProps) {
  const [visible, setVisible] = useState(false);
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const card = useThemeColor({}, 'card');
  const cardBorder = useThemeColor({}, 'cardBorder');
  const danger = useThemeColor({}, 'danger');
  const mutedLight = useThemeColor({}, 'mutedLight');
  const primary = useThemeColor({}, 'primary');

  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

  const formatDate = (d: Date) => {
    const day = d.getDate().toString().padStart(2, '0');
    const mon = months[d.getMonth()].slice(0, 3);
    const year = d.getFullYear();
    return `${day} ${mon} ${year}`;
  };

  const handleConfirm = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const safeDay = Math.min(selectedDay, daysInMonth);
    const date = new Date(selectedYear, selectedMonth, safeDay);
    onChange(date);
    setVisible(false);
  };

  const changeMonth = (dir: number) => {
    let m = selectedMonth + dir;
    let y = selectedYear;
    if (m > 11) { m = 0; y += 1; }
    if (m < 0) { m = 11; y -= 1; }
    setSelectedMonth(m);
    const maxDay = getDaysInMonth(m, y);
    if (selectedDay > maxDay) setSelectedDay(maxDay);
    setSelectedYear(y);
  };

  const changeYear = (dir: number) => {
    setSelectedYear(selectedYear + dir);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <MaterialIcons name="event" size={16} color={muted} style={styles.labelIcon} />
        <Text style={[styles.label, { color: muted }]}>Date</Text>
        <Text style={[styles.required, { color: danger }]}>*</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.trigger,
          { backgroundColor: mutedLight, borderColor: error ? danger : cardBorder },
          pressed && styles.pressed,
        ]}
        onPress={() => setVisible(true)}
      >
        {value ? (
          <Text style={[styles.selectedText, { color: text }]}>{formatDate(value)}</Text>
        ) : (
          <Text style={[styles.placeholder, { color: muted }]}>Select date</Text>
        )}
        <MaterialIcons name="calendar-today" size={20} color={muted} />
      </Pressable>

      {error ? (
        <View style={styles.errorRow}>
          <MaterialIcons name="error-outline" size={14} color={danger} />
          <Text style={[styles.error, { color: danger }]}>{error}</Text>
        </View>
      ) : null}

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: card }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.sheetTitle, { color: text }]}>Select Date</Text>

            <View style={styles.pickerRow}>
              <View style={styles.spinner}>
                <Pressable onPress={() => changeYear(1)} hitSlop={12}>
                  <MaterialIcons name="expand-less" size={28} color={primary} />
                </Pressable>
                <Text style={[styles.spinnerValue, { color: text }]}>{selectedYear}</Text>
                <Pressable onPress={() => changeYear(-1)} hitSlop={12}>
                  <MaterialIcons name="expand-more" size={28} color={primary} />
                </Pressable>
              </View>

              <View style={styles.spinner}>
                <Pressable onPress={() => changeMonth(1)} hitSlop={12}>
                  <MaterialIcons name="expand-less" size={28} color={primary} />
                </Pressable>
                <Text style={[styles.spinnerValue, { color: text }]} numberOfLines={1}>
                  {months[selectedMonth]}
                </Text>
                <Pressable onPress={() => changeMonth(-1)} hitSlop={12}>
                  <MaterialIcons name="expand-more" size={28} color={primary} />
                </Pressable>
              </View>

              <View style={styles.spinner}>
                <Pressable
                  onPress={() => setSelectedDay(Math.min(selectedDay + 1, getDaysInMonth(selectedMonth, selectedYear)))}
                  hitSlop={12}
                >
                  <MaterialIcons name="expand-less" size={28} color={primary} />
                </Pressable>
                <Text style={[styles.spinnerValue, { color: text }]}>
                  {selectedDay}
                </Text>
                <Pressable
                  onPress={() => setSelectedDay(Math.max(selectedDay - 1, 1))}
                  hitSlop={12}
                >
                  <MaterialIcons name="expand-more" size={28} color={primary} />
                </Pressable>
              </View>
            </View>

            <View style={styles.sheetActions}>
              <Pressable
                style={({ pressed }) => [styles.sheetBtn, pressed && styles.pressed]}
                onPress={() => setVisible(false)}
              >
                <Text style={[styles.cancelBtn, { color: muted }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.sheetBtn, styles.confirmBtn, { backgroundColor: primary }, pressed && styles.pressed]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  labelRow: { flexDirection: 'row', alignItems: 'center' },
  labelIcon: { marginRight: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  required: { fontSize: 14, fontWeight: '700', marginLeft: 4 },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pressed: { opacity: 0.7 },
  selectedText: { fontSize: 15, fontWeight: '500' },
  placeholder: { fontSize: 15, fontWeight: '400' },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  error: { fontSize: 12, fontWeight: '500' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 32 },
  sheet: { width: '100%', borderRadius: 20, padding: 20, gap: 20 },
  sheetTitle: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  pickerRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 80,
  },
  spinnerValue: { fontSize: 20, fontWeight: '700', minWidth: 80, textAlign: 'center' },
  sheetActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 4 },
  sheetBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  confirmBtn: { alignItems: 'center' },
  cancelBtn: { fontSize: 15, fontWeight: '600' },
  confirmBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
