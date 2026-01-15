import { COLORS } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { authStyles } from '../../styles/authStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmailSentScreen() {
    const router = useRouter();
    const { title, message } = useLocalSearchParams<{ title: string; message: string }>();

    return (
        <SafeAreaView style={authStyles.globalContainer}>
            <View style={authStyles.container}>

                <TouchableOpacity onPress={() => router.back()} style={authStyles.backButton}>
                    <ArrowLeft size={24} color={COLORS.text} />
                </TouchableOpacity>

                <View style={authStyles.contentContainer}>
                    <View style={authStyles.successIconContainer}>
                        <Check size={48} color={COLORS.primary} />
                    </View>

                    <Text style={authStyles.title}>{title || 'Check Your Email'}</Text>
                    <Text style={authStyles.subtitle}>{message || "We've sent a link to your email."}</Text>

                    <TouchableOpacity
                        style={authStyles.primaryButton}
                        onPress={() => router.dismissAll()}
                    >
                        <Text style={authStyles.buttonText}>Back to Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
