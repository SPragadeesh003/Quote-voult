import { COLORS } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, KeyRound } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../config/supabaseConfig';
import { authStyles } from '../../styles/authStyles';

import KeyboardWrapper from '@/src/components/KeyboardWrapper';

export default function VerifyOtpScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    async function verifyOtp() {
        if (!otp || otp.length < 6) {
            Alert.alert('Invalid Code', 'Please enter the 6-digit code sent to your email.');
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'email',
        });

        if (error) {
            Alert.alert('Verification Failed', error.message);
        } else {
            router.replace('/auth/reset-password');
        }
        setLoading(false);
    }

    return (
        <SafeAreaView style={authStyles.globalContainer}>
            <KeyboardWrapper>
                <View style={authStyles.container}>
                    <TouchableOpacity onPress={() => router.back()} style={authStyles.backButton}>
                        <ArrowLeft size={24} color={COLORS.text} />
                    </TouchableOpacity>

                    <View style={authStyles.screenHeader}>
                        <Text style={authStyles.screenTitle}>Enter Code</Text>
                        <Text style={authStyles.screenSubtitle}>
                            We sent a 6-digit code to {email}. Enter it below to verify your identity.
                        </Text>
                    </View>

                    <View style={authStyles.inputContainer}>
                        <KeyRound size={20} color={COLORS.text} opacity={0.5} />
                        <TextInput
                            style={[authStyles.input, { letterSpacing: 5, fontSize: 24 }]}
                            placeholder="000000"
                            placeholderTextColor={COLORS.text + '80'}
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={6}
                            autoFocus
                        />
                    </View>

                    <TouchableOpacity
                        style={authStyles.primaryButton}
                        onPress={verifyOtp}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={authStyles.buttonText}>Verify Code</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardWrapper>
        </SafeAreaView>
    );
}
