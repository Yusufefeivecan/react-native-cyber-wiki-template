import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Sadece TABS yapısını çağırıyoruz. Explore sayfası zaten bunun içinde. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}