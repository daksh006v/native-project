import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function LocationScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');

  const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const fetchLocation = async () => {
    if (!status?.granted) return;
    setLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to fetch location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status?.granted) {
      fetchLocation();
    }
  }, [status]);

  const copyToClipboard = async () => {
    if (!location) return;
    const locString = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
    await Clipboard.setStringAsync(locString);
    Alert.alert('Success', 'Location copied to clipboard!');
  };

  if (!status) {
    return (
      <View style={[styles.centered, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  if (!status.granted) {
    return (
      <View style={[styles.centered, { backgroundColor: background }]}>
        <View style={[styles.permIcon, { backgroundColor: primaryLight }]}>
          <MaterialIcons name="location-on" size={48} color={primary} />
        </View>
        <Text style={[styles.permTitle, { color: text }]}>Location Access Required</Text>
        <Text style={[styles.permDesc, { color: muted }]}>
          Allow Smart Survey to access your location to geotag your field surveys.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.permButton,
            { backgroundColor: primary },
            pressed && styles.pressed,
          ]}
          onPress={requestPermission}
        >
          <MaterialIcons name="my-location" size={20} color="#FFFFFF" />
          <Text style={styles.permButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: background }]}>
        <Pressable
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          onPress={openDrawer}
          hitSlop={12}
        >
          <MaterialIcons name="menu" size={28} color={text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: text }]}>My Location</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <ActivityIndicator size="large" color={primary} style={styles.loader} />
            <Text style={[styles.loadingText, { color: muted }]}>Fetching accurate location...</Text>
          </View>
        ) : location ? (
          <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <View style={[styles.iconWrap, { backgroundColor: primaryLight }]}>
              <MaterialIcons name="my-location" size={32} color={primary} />
            </View>
            
            <View style={styles.dataRow}>
              <Text style={[styles.label, { color: muted }]}>Latitude</Text>
              <Text style={[styles.value, { color: text }]}>{location.coords.latitude.toFixed(6)}</Text>
            </View>
            
            <View style={[styles.divider, { backgroundColor: border }]} />
            
            <View style={styles.dataRow}>
              <Text style={[styles.label, { color: muted }]}>Longitude</Text>
              <Text style={[styles.value, { color: text }]}>{location.coords.longitude.toFixed(6)}</Text>
            </View>
            
            <View style={[styles.divider, { backgroundColor: border }]} />
            
            <View style={styles.dataRow}>
              <Text style={[styles.label, { color: muted }]}>Accuracy</Text>
              <Text style={[styles.value, { color: text }]}>± {location.coords.accuracy?.toFixed(2) || 'Unknown'} meters</Text>
            </View>

            <View style={styles.actionRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionBtn,
                  { backgroundColor: primaryLight },
                  pressed && styles.pressed
                ]}
                onPress={fetchLocation}
              >
                <MaterialIcons name="refresh" size={20} color={primary} />
                <Text style={[styles.actionBtnText, { color: primary }]}>Refresh</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.actionBtn,
                  { backgroundColor: primary },
                  pressed && styles.pressed
                ]}
                onPress={copyToClipboard}
              >
                <MaterialIcons name="content-copy" size={20} color="#FFFFFF" />
                <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>Copy</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loader: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '500',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dataRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    width: '100%',
    height: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '600',
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.6,
  },
});
