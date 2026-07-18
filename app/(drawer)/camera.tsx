import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const PHOTO_DIR = `${FileSystem.documentDirectory}surveys/`;

type CapturedPhoto = {
  uri: string;
  savedAt: Date;
  fileName: string;
};

async function ensureDir() {
  const dirInfo = await FileSystem.getInfoAsync(PHOTO_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTO_DIR, { intermediates: true });
  }
}

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
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturing, setCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const toggleFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current || capturing || !cameraReady) return;
    setCapturing(true);
    try {
      const result = await cameraRef.current.takePictureAsync();
      if (result?.uri) {
        await ensureDir();
        const timestamp = Date.now();
        const fileName = `survey_${timestamp}.jpg`;
        const dest = `${PHOTO_DIR}${fileName}`;
        await FileSystem.copyAsync({ from: result.uri, to: dest });
        const photo: CapturedPhoto = {
          uri: dest,
          savedAt: new Date(),
          fileName,
        };
        setPhotos((prev) => [photo, ...prev]);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 1500);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to capture photo. Please try again.');
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
      `${photos.length} photo${photos.length > 1 ? 's' : ''} saved to app storage.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  };

  const handleDelete = () => {
    if (previewIndex === null) return;
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            const photoToDelete = photos[previewIndex];
            try {
              await FileSystem.deleteAsync(photoToDelete.uri);
            } catch (e) {
              console.log('Error deleting file', e);
            }
            const newPhotos = [...photos];
            newPhotos.splice(previewIndex, 1);
            setPhotos(newPhotos);
            if (newPhotos.length === 0) {
              setPreviewIndex(null);
            } else if (previewIndex >= newPhotos.length) {
              setPreviewIndex(newPhotos.length - 1);
            }
          }
        }
      ]
    );
  };

  const handleRetake = async () => {
    if (previewIndex === null) return;
    const photoToDelete = photos[previewIndex];
    try {
      await FileSystem.deleteAsync(photoToDelete.uri);
    } catch (e) {
      console.log('Error deleting file', e);
    }
    const newPhotos = [...photos];
    newPhotos.splice(previewIndex, 1);
    setPhotos(newPhotos);
    setPreviewIndex(null);
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
            <Text style={styles.photoCount}>
              {photos.length} photo{photos.length > 1 ? 's' : ''} captured
            </Text>
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
          <Text style={styles.savedToastText}>Photo captured</Text>
        </View>
      )}

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={() => setCameraReady(true)}
      >
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
          <Pressable style={styles.thumbnailWrap} onPress={() => setPreviewIndex(0)}>
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
            (capturing || !cameraReady) && styles.captureBtnDisabled,
            pressed && styles.captureBtnPressed,
          ]}
          onPress={takePicture}
          disabled={capturing || !cameraReady}
        >
          {!cameraReady ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : capturing ? (
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

      {/* Preview Modal */}
      {previewIndex !== null && photos[previewIndex] && (
        <Modal visible={true} transparent={false} animationType="slide">
          <View style={[styles.previewContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.previewHeader}>
              <Pressable onPress={() => setPreviewIndex(null)} style={styles.previewHeaderBtn}>
                <MaterialIcons name="close" size={28} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.captureTimeText}>
                {photos[previewIndex].savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                  ' - ' +
                  photos[previewIndex].savedAt.toLocaleDateString()}
              </Text>
              <View style={styles.previewHeaderBtn} />
            </View>

            <Image 
              source={{ uri: photos[previewIndex].uri }} 
              style={styles.previewImage} 
              resizeMode="contain" 
            />

            <View style={styles.previewFooter}>
              <Pressable style={styles.previewBtn} onPress={handleRetake}>
                <MaterialIcons name="replay" size={24} color="#FFFFFF" />
                <Text style={styles.previewBtnText}>Retake</Text>
              </Pressable>

              {photos.length > 1 && (
                <View style={styles.navRow}>
                  <Pressable 
                    onPress={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                    style={({ pressed }) => [styles.navBtn, pressed && styles.pressed, previewIndex === 0 && { opacity: 0.3 }]}
                    disabled={previewIndex === 0}
                  >
                    <MaterialIcons name="chevron-left" size={36} color="#FFFFFF" />
                  </Pressable>
                  <Text style={styles.navText}>
                    {photos.length - previewIndex} of {photos.length}
                  </Text>
                  <Pressable 
                    onPress={() => setPreviewIndex(Math.min(photos.length - 1, previewIndex + 1))}
                    style={({ pressed }) => [styles.navBtn, pressed && styles.pressed, previewIndex === photos.length - 1 && { opacity: 0.3 }]}
                    disabled={previewIndex === photos.length - 1}
                  >
                    <MaterialIcons name="chevron-right" size={36} color="#FFFFFF" />
                  </Pressable>
                </View>
              )}

              <Pressable style={styles.previewBtn} onPress={handleDelete}>
                <MaterialIcons name="delete" size={24} color="#EF4444" />
                <Text style={[styles.previewBtnText, { color: '#EF4444' }]}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
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
    alignSelf: 'center',
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
  thumbnailWrap: {
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
  previewContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  previewHeaderBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureTimeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  previewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  previewBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  previewBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navBtn: {
    padding: 4,
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
