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
import * as MediaLibrary from 'expo-media-library';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

type CapturedPhoto = {
  uri: string;
  savedAt: Date;
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

  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturing, setCapturing] = useState(false);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const toggleFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (result?.uri) {
        if (!mediaPermission?.granted) {
          const { granted } = await requestMediaPermission();
          if (granted) {
            await MediaLibrary.saveToLibraryAsync(result.uri);
          }
        } else {
          await MediaLibrary.saveToLibraryAsync(result.uri);
        }
        const photo: CapturedPhoto = { uri: result.uri, savedAt: new Date() };
        setPhotos((prev) => [photo, ...prev]);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 1500);
      }
    } catch {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setCapturing(false);
    }
  };

  const doneCapturing = () => {
    if (photos.length === 0) {
      navigation.goBack();
      return;
    }
    Alert.alert(
      'Finish Capturing',
      `You captured ${photos.length} photo${photos.length > 1 ? 's' : ''}. All photos have been saved to your gallery.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  };

  const lastPhoto = photos.length > 0 ? photos[0] : null;

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

  return (
    <View style={styles.cameraContainer}>
      <View style={[styles.cameraHeader, { paddingTop: insets.top + 8 }]}>
        <Pressable
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          onPress={openDrawer}
          hitSlop={12}
        >
          <MaterialIcons name="menu" size={24} color="#FFFFFF" />
        </Pressable>
        <View style={styles.titleSection}>
          <Text style={styles.cameraTitle}>Camera</Text>
          {photos.length > 0 && (
            <Text style={styles.photoCount}>{photos.length} photo{photos.length > 1 ? 's' : ''} saved</Text>
          )}
        </View>
        <Pressable
          style={({ pressed }) => [styles.doneBtn, pressed && styles.pressed]}
          onPress={doneCapturing}
        >
          <Text style={styles.doneBtnText}>Done</Text>
        </Pressable>
      </View>

      {showSaved && (
        <View style={[styles.savedToast, { top: insets.top + 60 }]}>
          <MaterialIcons name="check-circle" size={18} color="#FFFFFF" />
          <Text style={styles.savedToastText}>Saved to gallery</Text>
        </View>
      )}

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
        {lastPhoto ? (
          <Pressable style={styles.thumbnailBtn} onPress={() => {}}>
            <Image source={{ uri: lastPhoto.uri }} style={styles.thumbnail} />
            <View style={[styles.thumbnailBadge, { backgroundColor: primary }]}>
              <Text style={styles.thumbnailBadgeText}>{photos.length}</Text>
            </View>
          </Pressable>
        ) : (
          <View style={styles.sideBtnPlaceholder} />
        )}

        <Pressable
          style={({ pressed }) => [
            styles.captureBtn,
            capturing && styles.captureBtnDisabled,
            pressed && styles.captureBtnPressed,
          ]}
          onPress={takePicture}
          disabled={capturing}
        >
          {capturing ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <View style={styles.captureBtnInner} />
          )}
        </Pressable>

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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  cameraTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  photoCount: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  doneBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  savedToast: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -90 }],
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(34,197,94,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  savedToastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 20,
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
  thumbnailBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
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
  captureBtnDisabled: {
    borderColor: 'rgba(255,255,255,0.5)',
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
