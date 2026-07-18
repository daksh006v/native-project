import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { PriorityPicker } from '@/components/ui/priority-picker';
import { DatePickerField } from '@/components/ui/date-picker-field';

type Priority = 'low' | 'medium' | 'high' | 'critical';

type FormErrors = {
  siteName?: string;
  clientName?: string;
  description?: string;
  priority?: string;
  date?: string;
};

export default function CreateSurveyScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const danger = useThemeColor({}, 'danger');
  const mutedLight = useThemeColor({}, 'mutedLight');
  const cardBorder = useThemeColor({}, 'cardBorder');

  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!siteName.trim()) {
      newErrors.siteName = 'Site name is required';
    } else if (siteName.trim().length < 3) {
      newErrors.siteName = 'Site name must be at least 3 characters';
    }

    if (!clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    } else if (clientName.trim().length < 3) {
      newErrors.clientName = 'Client name must be at least 3 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!priority) newErrors.priority = 'Please select a priority';
    if (!date) newErrors.date = 'Please select a date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  React.useEffect(() => {
    if (submitted) {
      validate();
    }
  }, [siteName, clientName, description, priority, date, submitted]);

  const handleSubmit = () => {
    setSubmitted(true);
    if (!validate()) return;

    Alert.alert(
      'Survey Created',
      `Site: ${siteName}\nClient: ${clientName}\nPriority: ${priority}\nDate: ${date?.toLocaleDateString()}`,
      [{ text: 'OK' }],
    );
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 8, backgroundColor: background },
        ]}
      >
        <Pressable
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          onPress={openDrawer}
          hitSlop={12}
        >
          <MaterialIcons name="menu" size={24} color={text} />
        </Pressable>

        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: text }]}>New Survey</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Fill in the survey details</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.formCard}>
          <FormField
            label="Site Name"
            icon="place"
            placeholder="Enter site name"
            value={siteName}
            onChangeText={setSiteName}
            error={submitted ? errors.siteName : undefined}
            required
            autoCapitalize="words"
          />

          <FormField
            label="Client Name"
            icon="person"
            placeholder="Enter client name"
            value={clientName}
            onChangeText={setClientName}
            error={submitted ? errors.clientName : undefined}
            required
            autoCapitalize="words"
          />

          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <MaterialIcons name="description" size={16} color={muted} style={styles.labelIcon} />
              <Text style={[styles.label, { color: muted }]}>Description</Text>
              <Text style={[styles.required, { color: danger }]}>*</Text>
            </View>
            <View
              style={[
                styles.textAreaWrap,
                {
                  backgroundColor: mutedLight,
                  borderColor: submitted && errors.description ? danger : cardBorder,
                },
              ]}
            >
              <ScrollView
                style={styles.textAreaScroll}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.hiddenText}>{description || ' '}</Text>
                <FormField
                  label=""
                  placeholder="Describe the survey scope and objectives..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={5}
                  style={styles.textAreaInput}
                />
              </ScrollView>
            </View>
            {submitted && errors.description ? (
              <View style={styles.errorRow}>
                <MaterialIcons name="error-outline" size={14} color={danger} />
                <Text style={[styles.error, { color: danger }]}>{errors.description}</Text>
              </View>
            ) : null}
          </View>

          <PriorityPicker
            value={priority}
            onChange={setPriority}
            error={submitted ? errors.priority : undefined}
          />

          <DatePickerField
            value={date}
            onChange={setDate}
            error={submitted ? errors.date : undefined}
          />
        </Card>

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            { backgroundColor: primary },
            pressed && styles.pressed,
          ]}
          onPress={handleSubmit}
        >
          <MaterialIcons name="check-circle" size={22} color="#FFFFFF" />
          <Text style={styles.submitText}>Create Survey</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.6 },
  titleSection: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 13, fontWeight: '500' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, gap: 20 },
  formCard: { gap: 20 },
  fieldContainer: { gap: 8 },
  labelRow: { flexDirection: 'row', alignItems: 'center' },
  labelIcon: { marginRight: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  required: { fontSize: 14, fontWeight: '700', marginLeft: 4 },
  textAreaWrap: { borderWidth: 1, borderRadius: 12, minHeight: 120 },
  textAreaScroll: { minHeight: 120 },
  hiddenText: { fontSize: 15, fontWeight: '500', position: 'absolute', opacity: 0 },
  textAreaInput: { minHeight: 120 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  error: { fontSize: 12, fontWeight: '500' },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  submitText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
