import { useCallback } from 'react';
import { Pressable, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/useToast';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';

interface MediaPickerProps {
  mediaUri: string | null;
  mediaType: 'image' | 'video' | null;
  onMediaPicked: (uri: string, type: 'image' | 'video') => void;
  accentColor?: string;
}

async function requestCameraPermission() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  return permission.granted;
}

export function MediaPicker({ mediaUri, onMediaPicked, accentColor }: MediaPickerProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const toast = useToast();
  const c = colors(isDark);
  const activeColor = accentColor ?? (isDark ? '#60a5fa' : '#3b82f6');

  const pickMedia = useCallback(async (kind: 'gallery' | 'camera') => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images', 'videos'],
      quality: 0.8,
    };

    let result: ImagePicker.ImagePickerResult;

    if (kind === 'gallery') {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      const granted = await requestCameraPermission();
      if (!granted) {
        toast.error({ title: t('common.error'), message: 'Camera permission required' });
        return;
      }
      result = await ImagePicker.launchCameraAsync(options);
    }

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      onMediaPicked(asset.uri, asset.type === 'video' ? 'video' : 'image');
    }
  }, [onMediaPicked, t, toast]);

  if (mediaUri) {
    return (
      <View className="flex-1">
        <View className="flex-1 rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: c.card }}>
          <Image source={{ uri: mediaUri }} className="w-full h-full" resizeMode="contain" />
        </View>
        <Pressable
          onPress={() => pickMedia('gallery')}
          className="py-3 px-4 rounded-xl flex-row items-center justify-center gap-2 mb-3"
          style={{ backgroundColor: activeColor }}
        >
          <Ionicons name="images-outline" size={20} color="#fff" />
          <Text className="text-white font-semibold text-base">{t('memories.gallery')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center gap-4">
      <Pressable
        onPress={() => pickMedia('gallery')}
        className="py-5 px-6 rounded-xl flex-row items-center justify-center gap-3"
        style={{ backgroundColor: c.card }}
      >
        <Ionicons name="images-outline" size={28} color={activeColor} />
        <Text style={{ color: c.text }} className="text-base font-semibold">
          {t('memories.gallery')}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => pickMedia('camera')}
        className="py-5 px-6 rounded-xl flex-row items-center justify-center gap-3"
        style={{ backgroundColor: c.card }}
      >
        <Ionicons name="camera-outline" size={28} color={activeColor} />
        <Text style={{ color: c.text }} className="text-base font-semibold">
          {t('memories.camera')}
        </Text>
      </Pressable>
    </View>
  );
}
