import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import Colors from '@/constants/Colors';

function TabBarIcon({ name, color }: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={24} name={name} color={color} />;
}

export default function TabLayout() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors[isDark ? 'dark' : 'light'].background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[isDark ? 'dark' : 'light'].tint,
          tabBarInactiveTintColor: Colors[isDark ? 'dark' : 'light'].tabIconDefault,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors[isDark ? 'dark' : 'light'].background,
            borderTopColor: Colors[isDark ? 'dark' : 'light'].border,
            paddingBottom: 0,
            height: Platform.OS === 'ios' ? 54 : 60,
          },
          tabBarItemStyle: {
            paddingVertical: 0,
          },
          tabBarLabelStyle: {
            paddingBottom: 0,
            marginBottom: 0,
          },
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="action"
        options={{
          title: t('tabs.action'),
          tabBarIcon: ({ color }) => <TabBarIcon name="bolt" color={color} />,
        }}
      />
      <Tabs.Screen
        name="memories"
        options={{
          title: t('tabs.memories'),
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: t('tabs.notification'),
          tabBarIcon: ({ color }) => <TabBarIcon name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      </Tabs>
    </SafeAreaView>
  );
}
