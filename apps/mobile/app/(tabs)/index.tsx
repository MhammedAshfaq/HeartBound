import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing } from '@/lib/theme';
import StatCard from '@/components/home/StatCard';
import QuickActions from '@/components/home/QuickActions';
import MoodSelector from '@/components/home/MoodSelector';
import UpcomingList from '@/components/home/UpcomingList';

const MESSAGES = [
  "Small actions build strong relationships 💛",
  "You're doing great — keep going 👏",
  "Love is in the little things 🌸",
  "Every moment counts — make it special ✨",
  "Your effort makes a difference 💪",
];

const relationshipScoreAccent = '#2563eb';
const dayStreakAccent = '#16a34a';

type MoodType = 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'stressed';

export default function HomeScreen() {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const { user } = useAuth();

  const [greetingIndex, setGreetingIndex] = useState(0);
  const [streak] = useState(5);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [completedToday] = useState(false);
  const [moodY, setMoodY] = useState(0);

  const scrollRef = useRef<ScrollView>(null);
  const messageOpacity = useRef(new Animated.Value(1)).current;

  
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(messageOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(messageOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
      setGreetingIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [messageOpacity]);

  const handleMoodSelect = useCallback((mood: MoodType) => {
    setSelectedMood(mood);
  }, []);

  return (
    <View style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: c.text }]}>Good Morning!</Text>
            <Animated.Text style={[styles.dynamicMessage, { color: c.muted, opacity: messageOpacity }]}>
              {MESSAGES[greetingIndex]}
            </Animated.Text>
          </View>
          <Image
            // source={user?.avatar ? { uri: user.avatar } : Images.avatarPlaceholder}
            source={{uri:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"}}
            style={[styles.avatar, { borderColor: c.border }]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            value="75%"
            label="Relationship Score"
            subtitle="Strong connection 💛"
            accentColor={relationshipScoreAccent}
          />
          <StatCard
            value={streak}
            label="Day Streak"
            subtitle={completedToday ? 'Completed today ✅' : 'Keep it going!'}
            accentColor={dayStreakAccent}
          />
        </View>

        <QuickActions />

        <View onLayout={(e) => setMoodY(e.nativeEvent.layout.y)}>
          <MoodSelector
            selectedMood={selectedMood}
            onMoodSelect={handleMoodSelect}
          />
        </View>

        <UpcomingList />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  dynamicMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor: '#e5e5e5',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
});
