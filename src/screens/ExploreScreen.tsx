import { FONTS } from '@/constants/fonts';
import { useTheme } from '@/src/context/ThemeContext';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../config/supabaseConfig';
import { AccentColors, COLORS, Colors, THEME_PALETTES } from '../../constants/Colors';
import QuoteCard from '../../src/components/QuoteCard';
import { Quote } from '../../types/Quote.types';
import ExploreScreenStyles from '../styles/ExploreScreenStyles';
import KeyboardWrapper from '@/src/components/KeyboardWrapper';
import { CATEGORIES } from '@/utils/Categories';

export default function Explore() {
    const { visualStyle, isDarkMode, accentColor } = useTheme();
    const colors = isDarkMode ? Colors.dark : Colors.light;

    const themeName = Object.keys(AccentColors).find(key => AccentColors[key as keyof typeof AccentColors] === accentColor) || 'Nature';
    const currentPalette = THEME_PALETTES[themeName] || THEME_PALETTES['Nature'];

    const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Quote[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<'All' | 'Category' | 'Author'>('All');

    useEffect(() => {
        const fetchCounts = async () => {
            const { data, error } = await supabase.from('quotes').select('category');
            if (data) {
                const counts: Record<string, number> = {};
                data.forEach(q => {
                    const cat = q.category;
                    if (cat) {
                        counts[cat] = (counts[cat] || 0) + 1;
                    }
                });
                setCategoryCounts(counts);
            }
        };
        fetchCounts();
    }, []);

    const handleSearch = async (text: string, filter: string = selectedFilter) => {
        setSearchQuery(text);
        if (text.length === 0) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            let query = supabase.from('quotes').select('*');

            if (filter === 'All') {
                query = query.or(`text.ilike.%${text}%,author.ilike.%${text}%,category.ilike.%${text}%`);
            } else if (filter === 'Category') {
                query = query.ilike('category', `%${text}%`);
            } else if (filter === 'Author') {
                query = query.ilike('author', `%${text}%`);
            }

            const { data, error } = await query.limit(100);

            if (data) {
                setSearchResults(data);
            }
        } catch (error) {
            console.error('Error searching quotes:', error);
        } finally {
            setSearching(false);
        }
    };
    const toggleFilter = (filter: 'All' | 'Category' | 'Author') => {
        setSelectedFilter(filter);
        if (searchQuery.length > 0) {
            handleSearch(searchQuery, filter);
        }
    };

    return (
        <SafeAreaView style={[ExploreScreenStyles.container, { backgroundColor: colors.background }]}>
            <KeyboardWrapper>
                <View style={ExploreScreenStyles.header}>
                    <Text style={[ExploreScreenStyles.title, { color: colors.text }]}>Explore Categories</Text>
                </View>

                <View style={[ExploreScreenStyles.searchContainer, { backgroundColor: colors.cardBackground }]}>
                    <Feather name="search" size={20} color={COLORS.GRAY_888} style={ExploreScreenStyles.searchIcon} />
                    <TextInput
                        style={[ExploreScreenStyles.searchInput, { color: colors.text }]}
                        placeholder="Search for topics, moods, authors..."
                        placeholderTextColor={COLORS.GRAY_DARK}
                        value={searchQuery}
                        onChangeText={(text) => handleSearch(text)}
                    />
                </View>

                <View style={ExploreScreenStyles.filterContainer}>
                    {(['All', 'Category', 'Author'] as const).map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => toggleFilter(filter)}
                            style={[
                                ExploreScreenStyles.filterChip,
                                { borderColor: colors.text },
                                selectedFilter === filter ? [ExploreScreenStyles.activeFilterChip, { backgroundColor: colors.tint }] : { backgroundColor: colors.cardBackground }
                            ]}
                        >
                            <Text style={[
                                ExploreScreenStyles.filterText,
                                { color: colors.text },
                                selectedFilter === filter && ExploreScreenStyles.activeFilterText
                            ]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={ExploreScreenStyles.sectionHeader}>
                    <Text style={[ExploreScreenStyles.sectionTitle, { color: colors.text }]}>All Topics</Text>
                </View>

                {searchQuery.length > 0 ? (
                    <View style={{ flex: 1 }}>
                        <FlashList
                            data={searchResults}
                            renderItem={({ item }) => <QuoteCard quote={item} />}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            keyboardShouldPersistTaps="handled"
                            ListHeaderComponent={() => {
                                const matchingCategories = CATEGORIES.filter(cat =>
                                    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
                                );
                                const matchingAuthors = Array.from(new Set(
                                    searchResults
                                        .filter(q => q.author && q.author.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .map(q => q.author)
                                ));

                                if (matchingCategories.length === 0 && matchingAuthors.length === 0) return null;

                                return (
                                    <View style={{ marginBottom: 24 }}>
                                        {matchingCategories.length > 0 && (
                                            <>
                                                <View style={ExploreScreenStyles.sectionHeader}>
                                                    <Text style={[ExploreScreenStyles.sectionTitle, { color: colors.text }]}>Matching Categories</Text>
                                                </View>
                                                <View style={ExploreScreenStyles.grid}>
                                                    {matchingCategories.map((cat, index) => {
                                                        const IconLib = cat.library;
                                                        const key = Object.keys(categoryCounts).find(k => k.toLowerCase() === cat.name.toLowerCase());
                                                        const count = key ? categoryCounts[key] : 0;
                                                        const originalIndex = CATEGORIES.findIndex(c => c.name === cat.name);
                                                        const themeColor = currentPalette[originalIndex % currentPalette.length] || currentPalette[0];

                                                        const isMaterial = visualStyle === 'Material UI';
                                                        const customCardBg = isDarkMode ? COLORS.DARK_GRAY_BG : COLORS.WHITE;
                                                        const customTitleColor = isDarkMode ? COLORS.WHITE : COLORS.DARK_CARD;
                                                        const customBorderColor = isDarkMode ? `${COLORS.WHITE}1A` : `${COLORS.BLACK}1A`;

                                                        const cardBg = isMaterial ? themeColor : customCardBg;
                                                        const iconBg = isMaterial ? `${COLORS.BLACK}1A` : `${themeColor}15`;
                                                        const iconColor = isMaterial ? COLORS.DARK_CARD : themeColor;
                                                        const titleColor = isMaterial ? COLORS.DARK_CARD : customTitleColor;
                                                        const countColor = isMaterial ? `${COLORS.BLACK}99` : isDarkMode ? COLORS.GRAY_IOS : COLORS.GRAY_666;
                                                        const borderColor = isMaterial ? 'transparent' : customBorderColor;

                                                        return (
                                                            <Link key={cat.name} href={{ pathname: '/category/[category]', params: { category: cat.name } }} asChild>
                                                                <TouchableOpacity style={ExploreScreenStyles.cardWrapper}>
                                                                    <View style={[ExploreScreenStyles.cardInner, { backgroundColor: cardBg, borderColor: borderColor }]}>
                                                                        <View style={[ExploreScreenStyles.iconContainer, { backgroundColor: iconBg }]}>
                                                                            <IconLib name={cat.icon as any} size={22} color={iconColor} />
                                                                        </View>
                                                                        <View style={ExploreScreenStyles.cardTextContainer}>
                                                                            <Text style={[ExploreScreenStyles.cardTitle, { color: titleColor }]}>{cat.name}</Text>
                                                                            <Text style={[ExploreScreenStyles.cardCount, { color: countColor }]}>{count} Quotes</Text>
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </Link>
                                                        );
                                                    })}
                                                </View>
                                            </>
                                        )}

                                        {matchingAuthors.length > 0 && (
                                            <>
                                                <View style={[ExploreScreenStyles.sectionHeader, { marginTop: matchingCategories.length > 0 ? 24 : 0 }]}>
                                                    <Text style={[ExploreScreenStyles.sectionTitle, { color: colors.text }]}>Matching Authors</Text>
                                                </View>
                                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
                                                    {matchingAuthors.map((author) => (
                                                        <TouchableOpacity
                                                            key={author}
                                                            onPress={() => toggleFilter('Author')}
                                                            style={{
                                                                paddingHorizontal: 16,
                                                                paddingVertical: 12,
                                                                backgroundColor: colors.cardBackground,
                                                                borderRadius: 16,
                                                                borderWidth: 1,
                                                                borderColor: colors.text
                                                            }}
                                                        >
                                                            <Text style={{ color: colors.text, fontFamily: FONTS.GOOGLE_SANS_MEDIUM }}>{author}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </>
                                        )}

                                        <View style={[ExploreScreenStyles.sectionHeader, { marginTop: 24 }]}>
                                            <Text style={[ExploreScreenStyles.sectionTitle, { color: colors.text }]}>Matching Quotes</Text>
                                        </View>
                                    </View>
                                );
                            }}
                        />
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={ExploreScreenStyles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={ExploreScreenStyles.grid}>
                            {CATEGORIES.map((cat, index) => {
                                const IconLib = cat.library;
                                const key = Object.keys(categoryCounts).find(k => k.toLowerCase() === cat.name.toLowerCase());
                                const count = key ? categoryCounts[key] : 0;

                                const themeColor = currentPalette[index % currentPalette.length];

                                const isMaterial = visualStyle === 'Material UI';
                                const customCardBg = isDarkMode ? COLORS.DARK_GRAY_BG : COLORS.WHITE;
                                const customTitleColor = isDarkMode ? COLORS.WHITE : COLORS.DARK_CARD;
                                const customBorderColor = isDarkMode ? `${COLORS.WHITE}1A` : `${COLORS.BLACK}1A`;

                                const cardBg = isMaterial ? themeColor : customCardBg;
                                const iconBg = isMaterial ? `${COLORS.BLACK}1A` : `${themeColor}15`;
                                const iconColor = isMaterial ? COLORS.DARK_CARD : themeColor;
                                const titleColor = isMaterial ? COLORS.DARK_CARD : customTitleColor;
                                const countColor = isMaterial ? `${COLORS.BLACK}99` : isDarkMode ? COLORS.GRAY_IOS : COLORS.GRAY_666;
                                const borderColor = isMaterial ? 'transparent' : customBorderColor;

                                return (
                                    <Link key={index} href={{ pathname: '/category/[category]', params: { category: cat.name } }} asChild>
                                        <TouchableOpacity style={ExploreScreenStyles.cardWrapper}>
                                            <View style={[ExploreScreenStyles.cardInner, { backgroundColor: cardBg, borderColor: borderColor }]}>
                                                <View style={[ExploreScreenStyles.iconContainer, { backgroundColor: iconBg }]}>
                                                    <IconLib name={cat.icon as any} size={22} color={iconColor} />
                                                </View>
                                                <View style={ExploreScreenStyles.cardTextContainer}>
                                                    <Text style={[ExploreScreenStyles.cardTitle, { color: titleColor }]}>{cat.name}</Text>
                                                    <Text style={[ExploreScreenStyles.cardCount, { color: countColor }]}>{count} Quotes</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Link>
                                );
                            })}
                        </View>
                        <View style={{ height: 40 }} />
                    </ScrollView>
                )}
            </KeyboardWrapper>
        </SafeAreaView>
    );
}
