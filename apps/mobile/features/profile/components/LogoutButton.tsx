import { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(true);
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

      <ConfirmationModal
        visible={showModal}
        title="Logout"
        message="Are you sure you want to log out?"
        icon="log-out"
        iconColor="#d32f2f"
        options={[
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setShowModal(false),
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              setShowModal(false);
              setLoading(true);
              try {
                await logout();
                router.replace('/(auth)');
              } catch (error) {
                console.error(error);
                setLoading(false);
              }
            },
          },
        ]}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}
