import NotificationSettingsSheet from '@/src/components/NotificationSettingsSheet';
import { useAuth } from '@/src/context/AuthProvider';
import { useFavoritesContext } from '@/src/context/FavoritesContext';
import { useTheme } from '@/src/context/ThemeContext';
import { ProfileService } from '@/src/services/ProfileService';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Bell, ChevronRight, Edit2, LogOut } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccentColors, COLORS } from '../../constants/Colors';
import ProfileScreenStyles from '../styles/ProfileScreenStyles';

export default function Profile() {
    const { session, signOut } = useAuth();
    const { favoriteIds } = useFavoritesContext();
    const { visualStyle, setVisualStyle, themePreference, setThemePreference, accentColor, setAccentColor, theme } = useTheme();
    const [isNotificationSheetVisible, setIsNotificationSheetVisible] = React.useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [yearJoined, setYearJoined] = useState<string>('2023');
    const [collectionCount, setCollectionCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const colors = theme;

    useEffect(() => {
        if (session?.user) {
            loadProfile();
            const date = new Date(session.user.created_at);
            setYearJoined(date.getFullYear().toString());
        }
    }, [session]);

    const loadProfile = async () => {
        if (!session?.user) return;
        const profile = await ProfileService.getProfile(session.user.id);
        if (profile?.avatar_url) {
            setAvatarUrl(profile.avatar_url);
        }
        const count = await ProfileService.getCollectionCount(session.user.id);
        setCollectionCount(count);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            if (session?.user) {
                ProfileService.getCollectionCount(session.user.id).then(setCollectionCount);
            }
        }, [session])
    );

    const handleAvatarPress = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled && result.assets[0].uri) {
                setUploading(true);
                const publicUrl = await ProfileService.uploadAvatar(session!.user.id, result.assets[0].uri);
                if (publicUrl) {
                    setAvatarUrl(publicUrl);
                    await ProfileService.updateProfile(session!.user.id, { avatar_url: publicUrl });
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Error uploading avatar');
        } finally {
            setUploading(false);
        }
    };

    const stats = [
        { label: 'Favorites', value: favoriteIds.size, route: '/(tabs)/saved?tab=quotes' },
        { label: 'Collections', value: collectionCount, route: '/(tabs)/saved?tab=collections' },
    ];

    const handleStatPress = (route: string) => {
        router.push(route as any);
    };

    const handleSignOut = async () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[ProfileScreenStyles.container, { backgroundColor: colors.background }]}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={ProfileScreenStyles.scrollContent}>

                    {/* Header */}
                    <View style={ProfileScreenStyles.header}>
                        <View style={ProfileScreenStyles.avatarContainer}>
                            {avatarUrl ? (
                                <Image
                                    source={{ uri: avatarUrl }}
                                    style={ProfileScreenStyles.avatar}
                                />
                            ) : (
                                <View style={[ProfileScreenStyles.avatar, ProfileScreenStyles.avatarFallback, { backgroundColor: colors.tint }]}>
                                    <Text style={ProfileScreenStyles.avatarFallbackText}>
                                        {(session?.user?.email?.charAt(0) || 'U').toUpperCase()}
                                    </Text>
                                </View>
                            )}

                            <TouchableOpacity
                                style={[ProfileScreenStyles.editButton, { backgroundColor: colors.cardGreen }]}
                                onPress={handleAvatarPress}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <ActivityIndicator size="small" color={COLORS.WHITE} />
                                ) : (
                                    <Edit2 size={12} color={COLORS.WHITE} />
                                )}
                            </TouchableOpacity>
                        </View>
                        <Text style={[ProfileScreenStyles.name, { color: colors.text }]}>
                            {session?.user?.user_metadata?.full_name || 'User'}
                        </Text>
                        <Text style={ProfileScreenStyles.email}>
                            {session?.user?.email}
                        </Text>
                        <Text style={ProfileScreenStyles.memberSince}>MEMBER SINCE {yearJoined}</Text>
                    </View>

                    <View style={ProfileScreenStyles.statsRow}>
                        {stats.map((stat, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    ProfileScreenStyles.statCard,
                                    { backgroundColor: colors.cardBackground },
                                    visualStyle === 'Custom UI' && ProfileScreenStyles.noShadow
                                ]}
                                onPress={() => handleStatPress(stat.route)}
                            >
                                <Text style={[ProfileScreenStyles.statValue, { color: colors.text }]}>{stat.value}</Text>
                                <Text style={ProfileScreenStyles.statLabel}>{stat.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={ProfileScreenStyles.sectionHeaderContainer}>
                        <Text style={[ProfileScreenStyles.sectionTitle, { color: colors.tint }]}>APPEARANCE</Text>
                    </View>
                    <View style={[
                        ProfileScreenStyles.sectionCard,
                        { backgroundColor: colors.cardBackground },
                        visualStyle === 'Custom UI' && ProfileScreenStyles.noShadow
                    ]}>

                        <View style={ProfileScreenStyles.appearanceItem}>
                            <Text style={[ProfileScreenStyles.preferenceLabel, { color: colors.text }]}>Visual Style</Text>
                            <View style={[ProfileScreenStyles.segmentedControlFull, { backgroundColor: colors.background, }]}>
                                <TouchableOpacity
                                    style={[ProfileScreenStyles.segmentOptionFull, visualStyle === 'Material UI' && [ProfileScreenStyles.segmentActiveFull, { backgroundColor: colors.tint }]]}
                                    onPress={() => setVisualStyle('Material UI')}
                                >
                                    <Text style={[ProfileScreenStyles.segmentTextFull, { color: colors.text }, visualStyle === 'Material UI' && ProfileScreenStyles.segmentActiveTextFull]}>Material UI</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[ProfileScreenStyles.segmentOptionFull, visualStyle === 'Custom UI' && [ProfileScreenStyles.segmentActiveFull, { backgroundColor: colors.tint }]]}
                                    onPress={() => setVisualStyle('Custom UI')}
                                >
                                    <Text style={[ProfileScreenStyles.segmentTextFull, { color: colors.text }, visualStyle === 'Custom UI' && ProfileScreenStyles.segmentActiveTextFull]}>Custom UI</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={ProfileScreenStyles.appearanceItem}>
                            <Text style={[ProfileScreenStyles.preferenceLabel, { color: colors.text }]}>Theme</Text>
                            <View style={[ProfileScreenStyles.segmentedControlFull, { backgroundColor: colors.background }]}>
                                <TouchableOpacity
                                    style={[ProfileScreenStyles.segmentOptionFull, themePreference === 'light' && [ProfileScreenStyles.segmentActiveFull, { backgroundColor: colors.tint }]]}
                                    onPress={() => setThemePreference('light')}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={[ProfileScreenStyles.segmentTextFull, { color: colors.text }, themePreference === 'light' && ProfileScreenStyles.segmentActiveTextFull]}>Light</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[ProfileScreenStyles.segmentOptionFull, themePreference === 'dark' && [ProfileScreenStyles.segmentActiveFull, { backgroundColor: colors.tint }]]}
                                    onPress={() => setThemePreference('dark')}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={[ProfileScreenStyles.segmentTextFull, { color: colors.text }, themePreference === 'dark' && ProfileScreenStyles.segmentActiveTextFull]}>Dark</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[ProfileScreenStyles.segmentOptionFull, themePreference === 'system' && [ProfileScreenStyles.segmentActiveFull, { backgroundColor: colors.tint }]]}
                                    onPress={() => setThemePreference('system')}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={[ProfileScreenStyles.segmentTextFull, { color: colors.text }, themePreference === 'system' && ProfileScreenStyles.segmentActiveTextFull]}>System</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={ProfileScreenStyles.appearanceItem}>
                            <Text style={[ProfileScreenStyles.preferenceLabel, { color: colors.text }]}>Accent Color</Text>
                            <View style={ProfileScreenStyles.colorSwatchesRow}>
                                {Object.entries(AccentColors).map(([name, color]) => (
                                    <TouchableOpacity
                                        key={name}
                                        style={[
                                            ProfileScreenStyles.colorSwatch,
                                            { backgroundColor: color },
                                            accentColor === color && ProfileScreenStyles.colorSwatchActive,
                                        ]}
                                        onPress={() => setAccentColor(color)}
                                    />
                                ))}
                            </View>
                        </View>

                    </View>

                    <View style={ProfileScreenStyles.sectionHeaderContainer}>
                        <Text style={[ProfileScreenStyles.sectionTitle, { color: colors.tint }]}>Settings</Text>
                    </View>
                    <View style={[
                        ProfileScreenStyles.sectionCard,
                        { backgroundColor: colors.cardBackground },
                        visualStyle === 'Custom UI' && ProfileScreenStyles.noShadow
                    ]}>
                        <TouchableOpacity style={ProfileScreenStyles.menuItem} onPress={() => setIsNotificationSheetVisible(true)}>
                            <View style={ProfileScreenStyles.iconLabel}>
                                <Bell size={20} color={colors.text} style={{ marginRight: 16 }} />
                                <Text style={[ProfileScreenStyles.menuText, { color: colors.text }]}>Notification Preferences</Text>
                            </View>
                            <ChevronRight size={20} color={COLORS.GRAY_MEDIUM} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={ProfileScreenStyles.signOutButton} onPress={handleSignOut}>
                        <LogOut size={20} color={COLORS.SUNSET_RED} style={{ marginRight: 8 }} />
                        <Text style={ProfileScreenStyles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </ScrollView>

            )}

            <NotificationSettingsSheet
                isVisible={isNotificationSheetVisible}
                onClose={() => setIsNotificationSheetVisible(false)}
            />
        </SafeAreaView>
    );
};
