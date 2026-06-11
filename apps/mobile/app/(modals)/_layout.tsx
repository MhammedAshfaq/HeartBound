import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="add-memory" />
      <Stack.Screen name="edit-memory" options={{ presentation: 'modal' }} />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="ai-insights" />
      <Stack.Screen name="email-verification" />
      <Stack.Screen name="memory-detail" />
      <Stack.Screen name="day-memories" />
      <Stack.Screen name="relationship-status" />
    </Stack>
  );
}
