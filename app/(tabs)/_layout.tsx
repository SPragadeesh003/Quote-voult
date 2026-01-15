import { Tabs } from 'expo-router';
import { Bookmark, Home, Search, User } from 'lucide-react-native';
import React from 'react';
import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/fonts';
import { useTheme } from '../../src/context/ThemeContext';

export default function TabLayout() {
    const { theme, isDarkMode } = useTheme();
    const colors = theme;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.tint,
                tabBarInactiveTintColor: isDarkMode ? COLORS.GRAY_999 : colors.tabIconDefault,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 68,
                    paddingBottom: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
                }
            }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => <Search size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Saved',
                    tabBarIcon: ({ color }) => <Bookmark size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <User size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
