import { COLORS } from '@/constants/Colors';
import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.CREAM,
                },
                headerTintColor: COLORS.text,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.CREAM },
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="sign-in" options={{ headerShown: false }} />
            <Stack.Screen name="sign-up" options={{ headerShown: false }} />
            <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
            <Stack.Screen name="email-sent" options={{ headerShown: false }} />
            <Stack.Screen name="reset-password" options={{ headerShown: false }} />
            <Stack.Screen name="verify-otp" options={{ headerShown: false }} />
        </Stack>
    );
}
