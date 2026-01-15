import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { AccentColors, BACKGROUND_TINTS, CARD_TINTS, Colors } from '../../constants/Colors';
import { ThemeContextType } from '@/types/ThemeContext.types';
import { ThemePreference, VisualStyle } from '@/types/VisualStyles.types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemColorScheme = useColorScheme();
    const [visualStyle, setVisualStyle] = useState<VisualStyle>('Material UI');
    const [accentColor, setAccentColor] = useState(AccentColors.Nature);
    const [themePreference, setThemePreference] = useState<ThemePreference>('system');

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const storedStyle = await AsyncStorage.getItem('visualStyle');
                if (storedStyle) setVisualStyle(storedStyle as VisualStyle);

                const storedAccent = await AsyncStorage.getItem('accentColor');
                if (storedAccent) setAccentColor(storedAccent);

                const storedPref = await AsyncStorage.getItem('themePreference');
                if (storedPref) setThemePreference(storedPref as ThemePreference);
            } catch (error) {
                console.error('Failed to load theme preferences:', error);
            }
        };
        loadPreferences();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('visualStyle', visualStyle).catch(e => console.error(e));
    }, [visualStyle]);

    useEffect(() => {
        AsyncStorage.setItem('accentColor', accentColor).catch(e => console.error(e));
    }, [accentColor]);

    useEffect(() => {
        AsyncStorage.setItem('themePreference', themePreference).catch(e => console.error(e));
    }, [themePreference]);

    const isDarkMode =
        themePreference === 'system'
            ? systemColorScheme === 'dark'
            : themePreference === 'dark';

    const baseTheme = isDarkMode ? Colors.dark : Colors.light;

    const themeName = Object.keys(AccentColors).find(key => AccentColors[key as keyof typeof AccentColors] === accentColor) || 'Nature';
    const bgTint = isDarkMode ? BACKGROUND_TINTS[themeName as keyof typeof BACKGROUND_TINTS].dark : BACKGROUND_TINTS[themeName as keyof typeof BACKGROUND_TINTS].light;
    const cardTint = isDarkMode ? CARD_TINTS[themeName as keyof typeof CARD_TINTS].dark : CARD_TINTS[themeName as keyof typeof CARD_TINTS].light;

    const theme = {
        ...baseTheme,
        tint: accentColor,
        tabIconSelected: accentColor,
        icon: accentColor,
        categoryChipSelected: accentColor,
        cardGreen: accentColor,
        quoteOfTheDayBackground: accentColor,
        accentColor: accentColor,
        background: bgTint,
        cardBackground: cardTint,
    };

    return (
        <ThemeContext.Provider
            value={{
                visualStyle,
                setVisualStyle,
                accentColor,
                setAccentColor,
                themePreference,
                setThemePreference,
                isDarkMode,
                theme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
