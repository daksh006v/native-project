import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

type PhotoData = {
  uri: string;
  capturedAt: Date;
};

export default function CameraScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const danger = useThemeColor({}, 'danger');
  const dangerLight = useThemeColor({}, 'dangerLight');
  const card = useThemeColor({}, 'card');
  const cardBorder = useThemeColor({}, 'cardBorder');

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [photo, setPhoto] = useState<PhotoData | null>(null);
  const [loading, setLoading] = useState(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const toggleFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    setLoading(true);
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (result?.uri) {
        setPhoto({ uri: result.uri, capturedAt: new Date() });
      }
    } catch {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setPhoto(null),
        },
      ],
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!permission) {
    return (
      <View style={[styles.centered, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.centered, { backgroundColor: background }]}>
        <View style={[styles.permIcon, { backgroundColor: primaryLight }]}>
          <MaterialIcons name="camera-alt" size={48} color={primary} />
        </View>
        <Text style={[styles.permTitle, { color: text }]}>Camera Access Required</Text>
        <Text style={[styles.permDesc, { color: muted }]}>
          Allow Smart Survey to access your camera to capture field photos for surveys.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.permButton,
            { backgroundColor: primary },
            pressed && styles.pressed,
          ]}
          onPress={requestPermission}
        >
          <MaterialIcons name="camera" size={20} color="#FFFFFF" />
          <Text style={styles.permButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  if (photo) {
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
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
            <Text style={[styles.title, { color: text }]}>Photo Preview</Text>
          </View>
        </View>

        <View style={styles.previewContainer}>
          <Image source={{ uri: photo.uri }} style={styles.previewImage} resizeMode="cover" />
        </View>

        <View style={[styles.captureInfo, { backgroundColor: card, borderTopColor: cardBorder }]}>
          <View style={styles.timeRow}>
            <MaterialIcons name="access-time" size={18} color={muted} />
            <Text style={[styles.timeText, { color: text }]}>
              {formatTime(photo.capturedAt)}
            </Text>
          </View>
          <Text style={[styles.dateText, { color: muted }]}>
            {formatDate(photo.capturedAt)}
          </Text>
        </View>

        <View style={[styles.previewActions, { paddingBottom: insets.bottom + 16, backgroundColor: background }]}>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: primaryLight, borderColor: primary },
              pressed && styles.pressed,
            ]}
            onPress={retakePhoto}
          >
            <MaterialIcons name="refresh" size={22} color={primary} />
            <Text style={[styles.actionBtnText, { color: primary }]}>Retake</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: dangerLight, borderColor: danger },
              pressed && styles.pressed,
            ]}
            onPress={confirmDelete}
          >
            <MaterialIcons name="delete-outline" size={22} color={danger} />
            <Text style={[styles.actionBtnText, { color: danger }]}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <View
        style={[
          styles.cameraHeader,
          { paddingTop: insets.top + 8 },
        ]}
      >
        <Pressable
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          onPress={openDrawer}
          hitSlop={12}
        >
          <MaterialIcons name="menu" size={24} color="#FFFFFF" />
        </Pressable>
        <View style={styles.titleSection}>
          <Text style={styles.cameraTitle}>Camera</Text>
        </View>
      </View>

      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.cameraOverlay}>
          <View style={styles.viewfinder}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
        </View>
      </CameraView>

      <View style={[styles.cameraFooter, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={({ pressed }) => [
            styles.sideBtn,
            { backgroundColor: 'rgba(255,255,255,0.15)' },
            pressed && styles.pressed,
          ]}
          onPress={toggleFacing}
        >
          <MaterialIcons name="flip-camera-ios" size={26} color="#FFFFFF" />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.captureBtn,
            pressed && styles.captureBtnPressed,
          ]}
          onPress={takePicture}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <View style={styles.captureBtnInner} />
          )}
        </Pressable>

        <View style={styles.sideBtnPlaceholder} />
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
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  captureInfo: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '400',
  },
  previewActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinder: {
    width: 260,
    height: 260,
    borderWidth: 0,
  },
  corner: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderColor: '#FFFFFF',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 12,
  },
  cameraFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    paddingTop: 20,
    gap: 32,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sideBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBtnPlaceholder: {
    width: 52,
    height: 52,
  },
  captureBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  captureBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
});
