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

    try {
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
    } catch (err: any) {
      toast.error({
        title: t('common.error'),
        message: err?.message || 'Media picking failed',
      });
    }
  }, [onMediaPicked, t, toast]);

  if (mediaUri) {
    return (
      <View className="w-full h-full rounded-2xl overflow-hidden relative" style={{ backgroundColor: c.card }}>
        <Image source={{ uri: mediaUri }} className="w-full h-full" resizeMode="cover" />
        <Pressable
          onPress={() => pickMedia('gallery')}
          className="absolute right-3 top-3 w-10 h-10 rounded-full items-center justify-center shadow-md active:opacity-85"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
          <Ionicons name="camera-reverse" size={20} color="#fff" />
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-row gap-4 w-full h-full">
      <Pressable
        onPress={() => pickMedia('gallery')}
        className="flex-1 rounded-2xl items-center justify-center border-2 border-dashed active:opacity-85"
        style={{ backgroundColor: c.card, borderColor: c.border }}
      >
        <Ionicons name="images-outline" size={28} color={activeColor} />
        <Text style={{ color: c.text }} className="text-sm font-semibold mt-2 text-center">
          {t('memories.gallery')}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => pickMedia('camera')}
        className="flex-1 rounded-2xl items-center justify-center border-2 border-dashed active:opacity-85"
        style={{ backgroundColor: c.card, borderColor: c.border }}
      >
        <Ionicons name="camera-outline" size={28} color={activeColor} />
        <Text style={{ color: c.text }} className="text-sm font-semibold mt-2 text-center">
          {t('memories.camera')}
        </Text>
      </Pressable>
    </View>
  );
}
