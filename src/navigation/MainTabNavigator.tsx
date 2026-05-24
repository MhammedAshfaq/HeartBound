import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '@screens/HomeScreen';
import { NotificationsScreen } from '@screens/NotificationsScreen';
import { GiftsScreen } from '@screens/GiftsScreen';
import { AnalyticsScreen } from '@screens/AnalyticsScreen';
import { ProfileScreen } from '@screens/ProfileScreen';
import { theme } from '@utils/theme';

export type MainTabParamList = {
  HomeTab: undefined;
  NotificationsTab: undefined;
  GiftsTab: undefined;
  AnalyticsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const HomeStack = createNativeStackNavigator();
const NotificationsStack = createNativeStackNavigator();
const GiftsStack = createNativeStackNavigator();
const AnalyticsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

function NotificationsStackScreen() {
  return (
    <NotificationsStack.Navigator screenOptions={{ headerShown: false }}>
      <NotificationsStack.Screen name="NotificationsMain" component={NotificationsScreen} />
    </NotificationsStack.Navigator>
  );
}

function GiftsStackScreen() {
  return (
    <GiftsStack.Navigator screenOptions={{ headerShown: false }}>
      <GiftsStack.Screen name="GiftsMain" component={GiftsScreen} />
    </GiftsStack.Navigator>
  );
}

function AnalyticsStackScreen() {
  return (
    <AnalyticsStack.Navigator screenOptions={{ headerShown: false }}>
      <AnalyticsStack.Screen name="AnalyticsMain" component={AnalyticsScreen} />
    </AnalyticsStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

const TAB_ICONS: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  HomeTab: 'home',
  NotificationsTab: 'notifications',
  GiftsTab: 'gift',
  AnalyticsTab: 'bar-chart',
  ProfileTab: 'person',
};

export const MainTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingBottom: insets.bottom + 12,
          paddingTop: 12,
          height: insets.bottom + 68,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = TAB_ICONS[route.name];
          return (
            <Ionicons
              name={focused ? iconName : (`${iconName}-outline` as any)}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="NotificationsTab" component={NotificationsStackScreen} options={{ tabBarLabel: 'Notifications' }} />
      <Tab.Screen name="GiftsTab" component={GiftsStackScreen} options={{ tabBarLabel: 'Gifts' }} />
      <Tab.Screen name="AnalyticsTab" component={AnalyticsStackScreen} options={{ tabBarLabel: 'Analytics' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};
