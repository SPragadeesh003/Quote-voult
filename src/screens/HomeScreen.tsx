import { WidgetService } from '@/src/services/WidgetService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../config/supabaseConfig';
import QuoteCard from '../../src/components/QuoteCard';
import QuoteOfTheDay from '../../src/components/QuoteOfTheDay';
import { useAuth } from '../../src/context/AuthProvider';
import { Quote } from '../../types/Quote.types';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/HomeScreenStyles';

export default function HomeScreen() {
    const { session } = useAuth();
    const { theme, isDarkMode } = useTheme();

    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [quoteOfTheDay, setQuoteOfTheDay] = useState<Quote | null>(null);

    const fetchQuotes = async () => {
        try {
            setLoading(true);

            const { count, error: countError } = await supabase
                .from('quotes')
                .select('*', { count: 'exact', head: true });

            if (countError || count === null) {
                console.error('Error fetching count:', countError);
                return;
            }

            const limit = 15;
            const maxOffset = Math.max(0, count - limit);
            const randomOffset = Math.floor(Math.random() * (maxOffset + 1));

            const { data, error } = await supabase
                .from('quotes')
                .select('*')
                .range(randomOffset, randomOffset + limit - 1);

            if (error) {
                console.error('Error fetching quotes:', error);
                return;
            }

            if (data) {
                const shuffled = [...data].sort(() => Math.random() - 0.5);
                setQuotes(shuffled);
            }

        } catch (e) {
            console.error('Exception fetching quotes:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        console.log('HomeScreen mounted. Session:', session?.user?.id);
        fetchQuotes();
        fetchDailyPick();
    }, []);

    const fetchDailyPick = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const cachedData = await AsyncStorage.getItem('daily_quote_cache');

            if (cachedData) {
                const { date, quote } = JSON.parse(cachedData);
                if (date === today) {
                    console.log('Using cached daily quote');
                    setQuoteOfTheDay(quote);
                    WidgetService.updateDailyQuote(quote.text, quote.author);
                    return;
                }
            }
            const { count } = await supabase.from('quotes').select('*', { count: 'exact', head: true });

            const randomIndex = Math.floor(Math.random() * (count || 1));
            const { data } = await supabase
                .from('quotes')
                .select('*')
                .range(randomIndex, randomIndex)
                .single();

            if (data) {
                setQuoteOfTheDay(data);
                WidgetService.updateDailyQuote(data.text, data.author);

                await AsyncStorage.setItem('daily_quote_cache', JSON.stringify({
                    date: today,
                    quote: data
                }));
            }
        } catch (e) {
            console.error('Error fetching daily pick:', e);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchQuotes();
        fetchDailyPick();
    }, []);



    const renderHeader = () => (
        <View>
            <View style={styles.headerTop}>
                <Text style={[styles.headerGreatings, { color: theme.text }]}>
                    {(() => {
                        const hour = new Date().getHours();
                        if (hour < 12) return 'Good morning';
                        if (hour < 17) return 'Good afternoon';
                        if (hour < 21) return 'Good evening';
                        return 'Good night';
                    })()},
                </Text>
                <Text style={[styles.headerGreatings, { color: theme.text, fontSize: 32 }]}>
                    {session?.user?.user_metadata?.full_name}
                </Text>
            </View>

            <View style={{ height: 20 }} />

            <QuoteOfTheDay quote={quoteOfTheDay} />

            <View style={styles.headerTitleRow}>
                <Text style={[styles.pageTitle, { color: theme.text }]}>For You</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={theme.tint} />
                </View>
            ) : (
                <FlashList
                    data={quotes}
                    renderItem={({ item }) => <QuoteCard quote={item} />}
                    ListHeaderComponent={renderHeader()}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}