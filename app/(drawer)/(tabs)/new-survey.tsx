import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';

const PRIORITIES = [
  { id: 'low', label: 'Low', icon: 'low-priority' as const, themeKey: 'muted' },
  { id: 'medium', label: 'Medium', icon: 'drag-handle' as const, themeKey: 'text' }, 
  { id: 'high', label: 'High', icon: 'priority-high' as const, themeKey: 'accent' },
  { id: 'critical', label: 'Critical', icon: 'warning' as const, themeKey: 'danger' },
] as const;

export default function NewSurveyScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const primaryText = useThemeColor({}, 'primaryText');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const accent = useThemeColor({}, 'accent');
  const danger = useThemeColor({}, 'danger');
  const themeColors = {
    muted,
    text,
    accent,
    danger,
  };

  const [formData, setFormData] = useState({
    siteName: '',
    clientName: '',
    description: '',
    priority: 'medium',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.siteName.trim()) newErrors.siteName = 'Site name is required';
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      router.push({
        pathname: '/(drawer)/survey-preview',
        params: {
          siteName: formData.siteName,
          clientName: formData.clientName,
          description: formData.description,
          priority: formData.priority,
          date: new Date().toISOString(),
        }
      });
    } else {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
    }
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: background }]}>
        <Text style={[styles.headerTitle, { color: text }]}>New Survey</Text>
        <Pressable
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          onPress={openDrawer}
          hitSlop={12}
        >
          <MaterialIcons name="menu" size={28} color={text} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={styles.card}>
            <Text style={[styles.sectionTitle, { color: text }]}>General Details</Text>
            
            <FormField
              label="Site Name"
              placeholder="e.g. Downtown Plaza"
              icon="place"
              value={formData.siteName}
              onChangeText={(t) => {
                setFormData({ ...formData, siteName: t });
                if (errors.siteName) setErrors({ ...errors, siteName: '' });
              }}
              error={errors.siteName}
            />

            <FormField
              label="Client Name"
              placeholder="e.g. Acme Corp"
              icon="person"
              value={formData.clientName}
              onChangeText={(t) => {
                setFormData({ ...formData, clientName: t });
                if (errors.clientName) setErrors({ ...errors, clientName: '' });
              }}
              error={errors.clientName}
            />

            <FormField
              label="Description"
              placeholder="Brief overview of the survey..."
              icon="description"
              multiline
              numberOfLines={4}
              style={styles.textArea}
              value={formData.description}
              onChangeText={(t) => {
                setFormData({ ...formData, description: t });
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              error={errors.description}
            />
          </Card>

          <Card style={styles.card}>
            <Text style={[styles.sectionTitle, { color: text }]}>Priority Level</Text>
            <View style={styles.priorityGrid}>
              {PRIORITIES.map((p) => {
                const isSelected = formData.priority === p.id;
                const activeColor = themeColors[p.themeKey];
                
                return (
                  <Pressable
                    key={p.id}
                    style={({ pressed }) => [
                      styles.priorityCard,
                      { 
                        backgroundColor: isSelected ? activeColor + '15' : primaryLight,
                        borderColor: isSelected ? activeColor : 'transparent',
                        borderWidth: 2,
                      },
                      pressed && styles.pressed,
                    ]}
                    onPress={() => setFormData({ ...formData, priority: p.id })}
                  >
                    <MaterialIcons
                      name={p.icon}
                      size={24}
                      color={isSelected ? activeColor : text}
                      style={{ marginBottom: 8 }}
                    />
                    <Text
                      style={[
                        styles.priorityLabel,
                        { color: isSelected ? activeColor : text },
                      ]}
                    >
                      {p.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        style={[
          styles.footer,
          { 
            paddingBottom: insets.bottom || 24, 
            backgroundColor: background,
          }
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            { backgroundColor: accent }, // using the vibrant mint green accent for submit
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleNext}
        >
          <Text style={[styles.submitButtonText, { color: '#000000' }]}>Continue to Preview</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#000000" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 24,
    letterSpacing: -0.5,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    gap: 20,
  },
  card: {
    padding: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    marginBottom: 20,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  priorityCard: {
    flexBasis: '48%',
    flexGrow: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  priorityLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  submitButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  submitButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});
