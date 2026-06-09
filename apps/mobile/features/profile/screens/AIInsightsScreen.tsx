import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { colors, shadows } from '@/lib/theme';

export default function AIInsightsScreen() {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const router = useRouter();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(true);

  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => setProcessing(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!processing) return;
    const bounce = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -8, duration: 300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.delay(600),
        ]),
        { iterations: 3 },
      );
    const anim1 = bounce(dot1, 0);
    const anim2 = bounce(dot2, 150);
    const anim3 = bounce(dot3, 300);
    anim1.start();
    anim2.start();
    anim3.start();
    return () => { anim1.stop(); anim2.stop(); anim3.stop(); };
  }, [processing, dot1, dot2, dot3]);

  return (
    <SafeAreaView style={{ backgroundColor: c.background }} className="flex-1">
      <View className="flex-row items-center" style={{ borderBottomWidth: 1, borderBottomColor: c.border, paddingHorizontal: 10, paddingVertical: 12, ...s.sm }}>
        <Pressable onPress={() => router.back()} className="py-2 pr-4">
          <Ionicons name="close" size={24} color={c.text} style={{marginRight:10}}/>
        </Pressable>
        <Text className="text-lg font-bold" style={{ color: c.text }}>AI Insights</Text>
      </View>

      {processing ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="h-16 w-16 items-center justify-center rounded-xl mb-4" style={{ backgroundColor: '#7c3aed20' }}>
            <Ionicons name="sparkles" size={28} color="#7c3aed" />
          </View>
          <Text className="text-base font-bold mb-3" style={{ color: c.text }}>Analyzing your profile...</Text>
          <Text className="text-sm text-center mb-6 leading-5" style={{ color: c.muted }}>
            AI is reviewing your activity patterns and behavior to generate personalized insights.
          </Text>
          <View className="flex-row items-center gap-1.5 h-6">
            <Animated.View style={{ transform: [{ translateY: dot1 }] }}>
              <View className="h-2 w-2 rounded-full" style={{ backgroundColor: c.primary }} />
            </Animated.View>
            <Animated.View style={{ transform: [{ translateY: dot2 }] }}>
              <View className="h-2 w-2 rounded-full" style={{ backgroundColor: c.primary }} />
            </Animated.View>
            <Animated.View style={{ transform: [{ translateY: dot3 }] }}>
              <View className="h-2 w-2 rounded-full" style={{ backgroundColor: c.primary }} />
            </Animated.View>
          </View>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
        >
          <View className="rounded-xl mb-6" style={{ backgroundColor: '#7c3aed', paddingVertical: 10, paddingHorizontal: 10 }}>
            <View className="flex-row items-center gap-3">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-white/20">
                <Ionicons name="sparkles" size={18} color="#fff" />
              </View>
              <Text className="text-lg font-bold text-white">AI Insights</Text>
            </View>
            <Text className="text-sm mt-2 leading-5 text-white/80">
              Based on your activity, here's what stands out about you
            </Text>
          </View>

          {user?.insights?.map((item, idx) => (
            <View key={idx} className="flex-row gap-3 mb-5">
              <View className="h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: item.color + '15' }}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold mb-1" style={{ color: c.text }}>{item.title}</Text>
                <Text className="text-sm leading-5" style={{ color: c.muted }}>
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
