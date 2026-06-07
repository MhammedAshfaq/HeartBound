import { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
              router.replace('/(auth)');
            } catch (error) {
              console.error(error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="px-4 mt-6">
      <Pressable
        onPress={handleLogout}
        disabled={loading}
        className="flex-row items-center justify-center gap-2 rounded-2xl py-3.5 border"
        style={{
          borderColor: '#FFCDD2',
          backgroundColor: '#FFF0F0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Ionicons name="log-out-outline" size={20} color="#d32f2f" />
        <Text style={{ color: '#d32f2f' }} className="font-bold text-base">
          {loading ? 'Logging out...' : 'Logout'}
        </Text>
      </Pressable>
    </View>
  );
}
