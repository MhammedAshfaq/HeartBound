import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useAppSelector } from '@store/hooks';
import { theme } from '@utils/theme';

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { isAuthenticated, onboardingComplete } = useAppSelector((state) => state.auth);
  const { isComplete: quizComplete } = useAppSelector((state) => state.quiz);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          })
        );
      } else if (!onboardingComplete) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          })
        );
      } else if (!quizComplete) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Quiz' }],
          })
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          })
        );
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>❤️</Text>
        <Text style={styles.appName}>Relationship Care</Text>
        <Text style={styles.tagline}>Nurture your connection</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: theme.spacing.md,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.primaryLight,
  },
});
