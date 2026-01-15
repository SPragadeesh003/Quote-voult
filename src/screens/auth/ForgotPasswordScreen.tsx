import { COLORS } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../config/supabaseConfig';
import { authStyles } from '../../styles/authStyles';

import KeyboardWrapper from '@/src/components/KeyboardWrapper';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    async function sendResetLink() {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: false,
            }
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            router.push({
                pathname: '/auth/verify-otp',
                params: { email },
            });
        }
        setLoading(false);
    }

    return (
        <SafeAreaView style={authStyles.globalContainer}>
            <KeyboardWrapper>
                <View style={authStyles.container}>
                    {/* Back Button */}
                    <TouchableOpacity onPress={() => router.back()} style={authStyles.backButton}>
                        <ArrowLeft size={24} color={COLORS.text} />
                    </TouchableOpacity>

                    <View style={authStyles.screenHeader}>
                        <Text style={authStyles.screenTitle}>Reset Password</Text>
                        <Text style={authStyles.screenSubtitle}>Enter your email address and we'll send you a link to reset your password.</Text>
                    </View>

                    {/* Inputs */}
                    <View style={authStyles.inputContainer}>
                        <Mail size={20} color={COLORS.text} opacity={0.5} />
                        <TextInput
                            style={authStyles.input}
                            placeholder="Email"
                            placeholderTextColor={COLORS.text + '80'}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>
                    <TouchableOpacity
                        style={authStyles.primaryButton}
                        onPress={sendResetLink}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={authStyles.buttonText}>Send Reset Link</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardWrapper>
        </SafeAreaView>
    );
}
