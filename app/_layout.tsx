import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';

import { COLORS } from '@/constants/Colors';
import { FONT_FILES } from '@/constants/fonts';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/src/context/AuthProvider';
import { FavoritesProvider } from '@/src/context/FavoritesContext';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { ActivityIndicator, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const isAllowedAuthPage = inAuthGroup && (
      segments[1] === 'reset-password' ||
      segments[1] === 'verify-otp' ||
      segments[1] === 'email-sent'
    );

    if (!session && !inAuthGroup) {
      router.replace('/auth');
    } else if (session && inAuthGroup && !isAllowedAuthPage) {
      router.replace('/(tabs)/home');
    }
  }, [session, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.WHITE }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="quoteOverlay/view" options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} />
      </Stack>
      <StatusBar style="auto" />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts(FONT_FILES);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <AuthProvider>
          <ThemeProvider>
            <FavoritesProvider>
              <RootLayoutNav />
            </FavoritesProvider>
          </ThemeProvider>
        </AuthProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
