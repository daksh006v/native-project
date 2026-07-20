import React from 'react';
import { StyleSheet, View, Text, TextInput, type TextInputProps, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export function FormField({ label, error, icon, style, ...props }: FormFieldProps) {
  const text = useThemeColor({}, 'text');
  const background = useThemeColor({}, 'background');
  const cardBorder = useThemeColor({}, 'cardBorder'); // 'transparent' now
  const primaryLight = useThemeColor({}, 'primaryLight');
  const danger = useThemeColor({}, 'danger');
  const muted = useThemeColor({}, 'muted');

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          { 
            backgroundColor: primaryLight, // Using the soft grey/dark surface for inputs
            borderColor: error ? danger : 'transparent',
            borderWidth: error ? 1 : 0,
          },
        ]}
      >
        {icon && (
          <MaterialIcons name={icon} size={20} color={muted} style={styles.icon} />
        )}
        <TextInput
          style={[
            styles.input,
            { color: text },
            icon ? { paddingLeft: 8 } : { paddingLeft: 16 },
            style,
          ]}
          placeholderTextColor={muted}
          {...props}
        />
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    minHeight: 56,
  },
  icon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingRight: 16,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});
