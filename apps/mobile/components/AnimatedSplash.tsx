import { useEffect, useRef } from 'react';
import { Text, Animated, Image } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { Images } from '@/constants/Images';

interface AnimatedSplashProps {
  onAnimationFinish: (cancelled: boolean) => void;
}

export function AnimatedSplash({ onAnimationFinish }: AnimatedSplashProps) {
  const { t } = useTranslation();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onAnimationFinish(false));
    }, 1000);
    return () => clearTimeout(timer);
  }, [opacity, onAnimationFinish]);

  return (
    <Animated.View
      className="flex-1 items-center justify-center"
      style={{ opacity, backgroundColor: '#e11d48' }}
    >
      <Image
        source={Images.logo}
        className="h-24 w-24 mb-4"
        resizeMode="contain"
      />
      <Text className="text-white text-3xl font-bold">{t('auth.appTitle')}</Text>
      <Text className="text-white/80 text-base mt-2">{t('auth.appSubtitle')}</Text>
    </Animated.View>
  );
}
