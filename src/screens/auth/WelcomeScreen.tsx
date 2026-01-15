import { COLORS } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BookOpen, Eye } from 'lucide-react-native';
import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authStyles } from '../../styles/authStyles';
import { FONTS } from '@/constants/fonts';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={authStyles.globalContainer}>
            <StatusBar barStyle="dark-content" />
            <LinearGradient
                colors={[COLORS.LIGHT_HIGHLIGHT, COLORS.CREAM_YELLOW]} 
                style={authStyles.gradientBackground}
            />

            <SafeAreaView style={authStyles.container}>
                <View style={authStyles.contentContainer}>
                    
                    <View style={authStyles.headerIconContainer}>
                        <BookOpen size={48} color={COLORS.primary} />
                    </View>

                    <Text style={authStyles.title}>QuoteVault</Text>

                    <TouchableOpacity
                        style={authStyles.primaryButton}
                        onPress={() => router.push('/auth/sign-up')}
                    >
                        <Text style={authStyles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={authStyles.secondaryButton}
                        onPress={() => router.push('/auth/sign-in')}
                    >
                        <Text style={authStyles.secondaryButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ paddingBottom: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: COLORS.DARK_GREEN_BLACK, opacity: 0.5, fontFamily: FONTS.GOOGLE_SANS_REGULAR }}>Made By S.Pragadeesh</Text>
                </View>

            </SafeAreaView>
        </View>
    );
}
