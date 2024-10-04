// tabs/Profile/_layout.tsx
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Profile" }} />
    </Stack>
  );
}
