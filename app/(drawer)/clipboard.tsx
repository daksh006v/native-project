import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Alert, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';

export default function ClipboardScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const primaryText = useThemeColor({}, 'primaryText');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const cardBorder = useThemeColor({}, 'cardBorder');
  const card = useThemeColor({}, 'card');
  const danger = useThemeColor({}, 'danger');

  const [pastedText, setPastedText] = useState('');
  const [currentClipboard, setCurrentClipboard] = useState('');

  const checkClipboard = async () => {
    const content = await Clipboard.getStringAsync();
    setCurrentClipboard(content);
  };

  useEffect(() => {
    checkClipboard();
    let subscription: any = null;
    if (Platform.OS !== 'web') {
      subscription = Clipboard.addClipboardListener(() => {
        checkClipboard();
      });
    }
    return () => {
      if (subscription) {
        Clipboard.removeClipboardListener(subscription);
      }
    };
  }, []);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleCopy = async (label: string, value: string) => {
    await Clipboard.setStringAsync(value);
    Alert.alert('Success', `${label} copied to clipboard!`);
  };

  const handlePaste = async () => {
    const content = await Clipboard.getStringAsync();
    if (!content) {
      Alert.alert('Empty', 'There is no text in your clipboard to paste.');
      return;
    }
    setPastedText(content);
  };

  const handleClear = async () => {
    await Clipboard.setStringAsync('');
    setPastedText('');
    setCurrentClipboard('');
    Alert.alert('Cleared', 'Clipboard data has been cleared.');
  };

  const copyItems = [
    { label: 'Survey ID', value: 'SRV-2026-8901', icon: 'tag' as const },
    { label: 'Contact Number', value: '+1 (555) 019-2837', icon: 'phone' as const },
    { label: 'Current Location', value: 'Lat: 37.7749, Lng: -122.4194', icon: 'location-on' as const },
  ];

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: background }]}>
        <Pressable
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          onPress={openDrawer}
          hitSlop={12}
        >
          <MaterialIcons name="menu" size={28} color={text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: text }]}>Clipboard Manager</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: text }]}>Copy to Clipboard</Text>
        <Card style={styles.cardSection}>
          {copyItems.map((item, index) => (
            <View key={item.label}>
              <View style={styles.copyRow}>
                <View style={[styles.iconWrap, { backgroundColor: primaryLight }]}>
                  <MaterialIcons name={item.icon} size={20} color={primary} />
                </View>
                <View style={styles.copyInfo}>
                  <Text style={[styles.copyLabel, { color: muted }]}>{item.label}</Text>
                  <Text style={[styles.copyValue, { color: text }]} numberOfLines={1}>
                    {item.value}
                  </Text>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.copyBtn,
                    { backgroundColor: primary + '15' },
                    pressed && styles.pressed
                  ]}
                  onPress={() => handleCopy(item.label, item.value)}
                >
                  <MaterialIcons name="content-copy" size={20} color={primary} />
                </Pressable>
              </View>
              {index < copyItems.length - 1 && (
                <View style={[styles.divider, { backgroundColor: cardBorder }]} />
              )}
            </View>
          ))}
        </Card>

        <Text style={[styles.sectionTitle, { color: text, marginTop: 24 }]}>Paste from Clipboard</Text>
        <Card style={[styles.cardSection, { gap: 16 }]}>
          <View style={styles.pasteHeader}>
            <Text style={[styles.pasteLabel, { color: muted }]}>Notes</Text>
            <Pressable
              style={({ pressed }) => [
                styles.pasteBtn,
                { backgroundColor: primary },
                pressed && styles.pressed
              ]}
              onPress={handlePaste}
            >
              <MaterialIcons name="content-paste" size={16} color={primaryText} />
              <Text style={[styles.pasteBtnText, { color: primaryText }]}>Paste</Text>
            </Pressable>
          </View>
          
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: background,
                borderColor: cardBorder,
                color: text
              }
            ]}
            placeholder="Pasted content will appear here..."
            placeholderTextColor={muted}
            multiline
            numberOfLines={6}
            value={pastedText}
            onChangeText={setPastedText}
            textAlignVertical="top"
          />
        </Card>

        <View style={styles.clipboardStatus}>
          <Text style={[styles.statusText, { color: muted }]}>
            Current Clipboard: {currentClipboard ? 'Has Content' : 'Empty'}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.clearBtn,
              pressed && styles.pressed
            ]}
            onPress={handleClear}
          >
            <MaterialIcons name="delete-sweep" size={18} color={danger} />
            <Text style={[styles.clearBtnText, { color: danger }]}>Clear Data</Text>
          </Pressable>
        </View>

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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  cardSection: {
    padding: 16,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  copyInfo: {
    flex: 1,
    marginRight: 12,
  },
  copyLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  copyValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  copyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
  pasteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pasteLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  pasteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  pasteBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 120,
    padding: 16,
    fontSize: 15,
  },
  clipboardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.6,
  },
});
