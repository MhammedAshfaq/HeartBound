import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useScreenLayout } from '@hooks/useScreenLayout';
import { AppTheme } from '@utils/theme';

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
  const screenLayout = useScreenLayout();
  const styles = useThemedStyles(createStyles);

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
    <SafeAreaView style={screenLayout.safe} edges={['top']}>
      <FlatList
        data={GIFT_IDEAS}
        keyExtractor={(item) => item.id}
        renderItem={renderGift}
        contentContainerStyle={screenLayout.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    giftCard: {
      marginBottom: theme.spacing.sm,
    },
    giftHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    giftEmoji: {
      fontSize: 36,
    },
    categoryBadge: {
      paddingHorizontal: theme.spacing.sm,
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
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    giftDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      lineHeight: 20,
    },
    saveButton: {
      alignSelf: 'flex-start',
    },
  });
