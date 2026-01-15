import { COLORS } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../config/supabaseConfig';
import { authStyles } from '../../styles/authStyles';

import KeyboardWrapper from '@/src/components/KeyboardWrapper';

export default function SignUpScreen() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    async function signUpWithEmail() {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        console.log('[SignUp] Attempting sign up for:', email);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'quickvault://(tabs)/home',
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            Alert.alert('Sign Up Failed', error.message);
        } else {
            console.log('[SignUp] Success:', data);
            router.push({
                pathname: '/auth/email-sent',
                params: {
                    title: 'Account Created',
                    message: 'Please check your email to confirm your account.',
                },
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
                        <Text style={authStyles.screenTitle}>Create Account</Text>
                        <Text style={authStyles.screenSubtitle}>Join QuoteVault and start collecting wisdom</Text>
                    </View>

                    <View style={authStyles.inputContainer}>
                        <User size={20} color={COLORS.text} opacity={0.5} />
                        <TextInput
                            style={authStyles.input}
                            placeholder="Full Name"
                            placeholderTextColor={COLORS.text + '80'}
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

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

                    <View style={authStyles.inputContainer}>
                        <Lock size={20} color={COLORS.text} opacity={0.5} />
                        <TextInput
                            style={authStyles.input}
                            placeholder="Password"
                            placeholderTextColor={COLORS.text + '80'}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                                <EyeOff size={20} color={COLORS.text} opacity={0.5} />
                            ) : (
                                <Eye size={20} color={COLORS.text} opacity={0.5} />
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={authStyles.inputContainer}>
                        <Lock size={20} color={COLORS.text} opacity={0.5} />
                        <TextInput
                            style={authStyles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor={COLORS.text + '80'}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? (
                                <EyeOff size={20} color={COLORS.text} opacity={0.5} />
                            ) : (
                                <Eye size={20} color={COLORS.text} opacity={0.5} />
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={authStyles.primaryButton}
                        onPress={signUpWithEmail}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={authStyles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
                        <Text style={authStyles.linkText}>
                            Already have an account? <Text style={authStyles.linkTextBold}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardWrapper>
        </SafeAreaView>
    );
}
