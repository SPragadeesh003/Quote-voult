import { COLORS } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../config/supabaseConfig';
import { authStyles } from '../../styles/authStyles';

import KeyboardWrapper from '@/src/components/KeyboardWrapper';

export default function SignInScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        console.log('[SignIn] Attempting sign in for:', email);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert('Sign In Failed', error.message);
        } else {
            console.log('[SignIn] Success:', data);
            router.replace('/(tabs)/home');
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
                        <Text style={authStyles.screenTitle}>Welcome Back</Text>
                        <Text style={authStyles.screenSubtitle}>Sign in to continue discovering quotes</Text>
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

                    <TouchableOpacity
                        style={authStyles.forgotPasswordContainer}
                        onPress={() => router.push('/auth/forgot-password')}
                    >
                        <Text style={authStyles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={authStyles.primaryButton}
                        onPress={signInWithEmail}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={authStyles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/auth/sign-up')}>
                        <Text style={authStyles.linkText}>
                            Don't have an account? <Text style={authStyles.linkTextBold}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardWrapper>
        </SafeAreaView>
    );
}
