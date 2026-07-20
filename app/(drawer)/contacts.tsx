import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Pressable, Alert, ActivityIndicator, FlatList, RefreshControl, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ContactsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const primaryText = useThemeColor({}, 'primaryText');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'cardBorder');

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const requestPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      fetchContacts();
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.getPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        fetchContacts();
      }
    })();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
        sort: Contacts.SortTypes.FirstName,
      });
      setContacts(data);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to fetch contacts.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchContacts();
  }, []);

  const copyToClipboard = async (phone: string | undefined) => {
    if (!phone) return;
    await Clipboard.setStringAsync(phone);
    Alert.alert('Success', 'Contact number copied to clipboard!');
  };

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    const lowerQuery = searchQuery.toLowerCase();
    return contacts.filter(c => 
      (c.name && c.name.toLowerCase().includes(lowerQuery)) ||
      (c.phoneNumbers && c.phoneNumbers.some(p => p.number?.includes(lowerQuery)))
    );
  }, [contacts, searchQuery]);

  if (hasPermission === null) {
    return (
      <View style={[styles.centered, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.centered, { backgroundColor: background }]}>
        <View style={[styles.permIcon, { backgroundColor: primaryLight }]}>
          <MaterialIcons name="contacts" size={48} color={primary} />
        </View>
        <Text style={[styles.permTitle, { color: text }]}>Contacts Access Required</Text>
        <Text style={[styles.permDesc, { color: muted }]}>
          Allow Smart Survey to access your contacts to quickly assign clients to surveys.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.permButton,
            { backgroundColor: primary },
            pressed && styles.pressed,
          ]}
          onPress={requestPermission}
        >
          <MaterialIcons name="contact-phone" size={20} color={primaryText} />
          <Text style={[styles.permButtonText, { color: primaryText }]}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Contacts.Contact }) => {
    const phoneNumber = item.phoneNumbers?.[0]?.number;
    const initial = item.name ? item.name.charAt(0).toUpperCase() : '?';

    return (
      <View style={[styles.contactCard, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.contactLeft}>
          <View style={[styles.avatar, { backgroundColor: primaryLight }]}>
            <Text style={[styles.avatarText, { color: primary }]}>{initial}</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactName, { color: text }]} numberOfLines={1}>
              {item.name || 'Unknown'}
            </Text>
            <Text style={[styles.contactPhone, { color: muted }]}>
              {phoneNumber || 'No Number'}
            </Text>
          </View>
        </View>
        {phoneNumber && (
          <Pressable
            style={({ pressed }) => [
              styles.copyBtn,
              { backgroundColor: primary + '15' },
              pressed && styles.pressed
            ]}
            onPress={() => copyToClipboard(phoneNumber)}
          >
            <MaterialIcons name="content-copy" size={18} color={primary} />
          </Pressable>
        )}
      </View>
    );
  };

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
        <Text style={[styles.headerTitle, { color: text }]}>Contacts</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: border }]}>
          <MaterialIcons name="search" size={22} color={muted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: text }]}
            placeholder="Search contacts..."
            placeholderTextColor={muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={10}>
              <MaterialIcons name="close" size={20} color={muted} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.countContainer}>
        <Text style={[styles.countText, { color: muted }]}>
          {filteredContacts.length} Contact{filteredContacts.length !== 1 && 's'}
        </Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item, index) => (item.name ? `${item.name}-${index}` : index.toString())}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={primary}
              colors={[primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="contacts" size={64} color={border} />
              <Text style={[styles.emptyTitle, { color: text }]}>No Contacts Found</Text>
              <Text style={[styles.emptyDesc, { color: muted }]}>
                {searchQuery ? "We couldn't find anyone matching your search." : "Your contact list is empty."}
              </Text>
            </View>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  countContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    fontWeight: '400',
  },
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  permIcon: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  permDesc: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
  },
  permButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    marginTop: 8,
  },
  permButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.6,
  },
});
