import { COLORS } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../config/supabaseConfig';
import { authStyles } from '../../styles/authStyles';

import KeyboardWrapper from '@/src/components/KeyboardWrapper';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Block Android hardware back button — password reset must be completed
    useEffect(() => {
        const handler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => handler.remove();
    }, []);

    const handleUpdatePassword = async () => {
        if (!password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in both fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            // Sign out to clear the recovery session, then redirect to sign-in
            await supabase.auth.signOut();
            Alert.alert('Success', 'Your password has been updated! Please sign in with your new password.', [
                {
                    text: 'OK',
                    onPress: () => {
                        router.replace('/auth/sign-in');
                    }
                }
            ]);
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={authStyles.globalContainer}>
            <KeyboardWrapper>
                <View style={authStyles.container}>
                    {/* Back button removed — password reset must be completed */}

                    <View style={authStyles.screenHeader}>
                        <Text style={authStyles.screenTitle}>New Password</Text>
                        <Text style={authStyles.screenSubtitle}>Enter your new password below.</Text>
                    </View>

                    <View style={authStyles.inputContainer}>
                        <Lock size={20} color={COLORS.text} opacity={0.5} />
                        <TextInput
                            style={authStyles.input}
                            placeholder="New Password"
                            placeholderTextColor={COLORS.text + '80'}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={authStyles.inputContainer}>
                        <Lock size={20} color={COLORS.text} opacity={0.5} />
                        <TextInput
                            style={authStyles.input}
                            placeholder="Confirm New Password"
                            placeholderTextColor={COLORS.text + '80'}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity
                        style={authStyles.primaryButton}
                        onPress={handleUpdatePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={authStyles.buttonText}>Update Password</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardWrapper>
        </SafeAreaView>
    );
}
