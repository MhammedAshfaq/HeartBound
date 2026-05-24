import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { theme } from '@utils/theme';

interface GiftIdea {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
}

const GIFT_IDEAS: GiftIdea[] = [
  {
    id: '1',
    title: 'Personalized Photo Album',
    description: 'Create a beautiful album of your memories together',
    emoji: '📸',
    category: 'Romantic',
  },
  {
    id: '2',
    title: 'Couple\'s Spa Day',
    description: 'Book a relaxing spa experience for both of you',
    emoji: '💆',
    category: 'Experience',
  },
  {
    id: '3',
    title: 'Handwritten Love Letter',
    description: 'Express your feelings in a heartfelt letter',
    emoji: '💌',
    category: 'Romantic',
  },
  {
    id: '4',
    title: 'Custom Playlist',
    description: 'Curate songs that remind you of your relationship',
    emoji: '🎵',
    category: 'Creative',
  },
  {
    id: '5',
    title: 'Cooking Class Together',
    description: 'Learn to make your favorite cuisine as a couple',
    emoji: '👨‍🍳',
    category: 'Experience',
  },
  {
    id: '6',
    title: 'Surprise Date Night',
    description: 'Plan an unexpected evening out',
    emoji: '🌹',
    category: 'Romantic',
  },
];

export const GiftsScreen: React.FC = () => {
  const renderGift = ({ item }: { item: GiftIdea }) => (
    <Card style={styles.giftCard}>
      <View style={styles.giftHeader}>
        <Text style={styles.giftEmoji}>{item.emoji}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      <Text style={styles.giftTitle}>{item.title}</Text>
      <Text style={styles.giftDescription}>{item.description}</Text>
      <Button
        title="Save Idea"
        onPress={() => {}}
        variant="outline"
        style={styles.saveButton}
      />
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gift Ideas</Text>
        <Text style={styles.subtitle}>
          Thoughtful suggestions to make your partner smile
        </Text>
      </View>

      <FlatList
        data={GIFT_IDEAS}
        keyExtractor={(item) => item.id}
        renderItem={renderGift}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  list: {
    padding: theme.spacing.md,
  },
  giftCard: {
    marginBottom: theme.spacing.md,
  },
  giftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  giftEmoji: {
    fontSize: 40,
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.full,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  giftTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  giftDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  saveButton: {
    alignSelf: 'flex-start',
  },
});
