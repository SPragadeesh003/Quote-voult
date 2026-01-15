import { supabase } from '@/config/supabaseConfig';
import QuoteCard from '@/src/components/QuoteCard';
import { useTheme } from '@/src/context/ThemeContext';
import { CategoryScreenStyles } from '@/src/styles/exploreStyles/CategoryScreenStyles';
import { Quote } from '@/types/Quote.types';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import KeyboardWrapper from '@/src/components/KeyboardWrapper';
import { COLORS } from '@/constants/Colors';

export default function CategoryScreen() {
    const { category } = useLocalSearchParams<{ category: string }>();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCategoryQuotes = async () => {
        if (!refreshing) setLoading(true);
        try {
            const { data, error } = await supabase
                .from('quotes')
                .select('*')
                .ilike('category', category || '')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) {
                setQuotes(data);
                if (searchQuery) {
                    const filtered = data.filter(q =>
                        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (q.author && q.author.toLowerCase().includes(searchQuery.toLowerCase()))
                    );
                    setFilteredQuotes(filtered);
                } else {
                    setFilteredQuotes(data);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (category) {
            fetchCategoryQuotes();
            navigation.setOptions({ headerShown: false });
        }
    }, [category]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchCategoryQuotes();
    }, [category, searchQuery]);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text) {
            const filtered = quotes.filter(q =>
                q.text.toLowerCase().includes(text.toLowerCase()) ||
                (q.author && q.author.toLowerCase().includes(text.toLowerCase()))
            );
            setFilteredQuotes(filtered);
        } else {
            setFilteredQuotes(quotes);
        }
    };

    return (
        <SafeAreaView style={[CategoryScreenStyles.container, { backgroundColor: theme.background }]}>
            <KeyboardWrapper>
                <View style={CategoryScreenStyles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={CategoryScreenStyles.backButton}>
                        <ArrowLeft size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[CategoryScreenStyles.title, { color: theme.text }]}>{category}</Text>
                </View>

                <View style={[CategoryScreenStyles.searchContainer, { backgroundColor: theme.cardBackground }]}>
                    <Search size={20} color={COLORS.text} style={CategoryScreenStyles.searchIcon} />
                    <TextInput
                        style={[CategoryScreenStyles.searchInput, { color: theme.text }]}
                        placeholder="Search in this category..."
                        placeholderTextColor={COLORS.text}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>

                {loading && !refreshing ? (
                    <ActivityIndicator size="large" color={theme.tint} style={{ marginTop: 20 }} />
                ) : (
                    <FlashList
                        data={filteredQuotes}
                        renderItem={({ item }) => <QuoteCard quote={item} />}
                        // estimatedItemSize={200}
                        contentContainerStyle={CategoryScreenStyles.listContent}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />}
                        ListEmptyComponent={
                            <View style={CategoryScreenStyles.empty}>
                                <Text style={{ color: theme.text }}>No quotes found for this category.</Text>
                            </View>
                        }
                    />
                )}
            </KeyboardWrapper>
        </SafeAreaView>
    );
}
