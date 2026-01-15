import { COLORS } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../config/supabaseConfig';
import { authStyles } from '../../styles/authStyles';

import KeyboardWrapper from '@/src/components/KeyboardWrapper';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
            Alert.alert('Success', 'Your password has been updated!', [
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
                    <TouchableOpacity onPress={() => router.back()} style={authStyles.backButton}>
                        <ArrowLeft size={24} color={COLORS.text} />
                    </TouchableOpacity>

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
