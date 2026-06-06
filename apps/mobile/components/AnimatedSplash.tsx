import React, { useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';

interface AnimatedSplashProps {
  onAnimationFinish: (cancelled: boolean) => void;
}

export function AnimatedSplash({ onAnimationFinish }: AnimatedSplashProps) {
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
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.title}>HeartBond</Text>
      <Text style={styles.subtitle}>Grow closer, every single day</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e11d48',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
});
