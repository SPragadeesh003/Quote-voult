import { supabase } from '@/config/supabaseConfig';
import ManageCollectionsSheet from '@/src/components/ManageCollectionsSheet';
import SavedQuoteItem from '@/src/components/SavedQuoteItem';
import { useTheme } from '@/src/context/ThemeContext';
import CollectionDetailScreenStyle from '@/src/styles/savedStyles/CollectionDetailsScreenStyles';
import { Quote } from '@/types/Quote.types';
import { FlashList } from '@shopify/flash-list';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CollectionDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { theme } = useTheme();
    const router = useRouter();
    const [collectionName, setCollectionName] = useState('');
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [manageQuote, setManageQuote] = useState<Quote | null>(null);
    const [isManageSheetVisible, setIsManageSheetVisible] = useState(false);

    const fetchCollectionDetails = async () => {
        try {
            if (!refreshing) setLoading(true);
            const { data: collectionData, error: collectionError } = await supabase
                .from('collections')
                .select('name')
                .eq('id', id)
                .single();

            if (collectionError) throw collectionError;
            setCollectionName(collectionData.name);

            const { data: itemsData, error: itemsError } = await supabase
                .from('collection_items')
                .select(`
                    quote_id,
                    quote:quotes (*)
                `)
                .eq('collection_id', id);

            if (itemsError) throw itemsError;

            if (itemsData) {
                const fetchedQuotes = itemsData.map((item: any) => item.quote).filter(Boolean) as Quote[];
                setQuotes(fetchedQuotes);
            }

        } catch (error) {
            console.error('Error fetching collection details:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (id) {
                fetchCollectionDetails();
            }
        }, [id])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchCollectionDetails();
    }, [id]);

    const handleRemoveQuote = async (quoteId: string) => {
        try {
            const { error } = await supabase
                .from('collection_items')
                .delete()
                .eq('collection_id', id)
                .eq('quote_id', quoteId);

            if (error) throw error;
            setQuotes(prev => prev.filter(q => q.id !== quoteId));
        } catch (error) {
            console.error('Error removing quote from collection:', error);
            Alert.alert('Error', 'Failed to remove quote.');
        }
    };

    const handleDeleteCollection = () => {
        Alert.alert(
            'Delete Collection',
            'Are you sure? Quotes will remain in your favorites.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const { error } = await supabase.from('collections').delete().eq('id', id);
                        if (!error) router.back();
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[CollectionDetailScreenStyle.container, { backgroundColor: theme.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={CollectionDetailScreenStyle.header}>
                <TouchableOpacity onPress={() => router.back()} style={CollectionDetailScreenStyle.backButton}>
                    <ArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[CollectionDetailScreenStyle.title, { color: theme.text }]}>{collectionName || 'Collection'}</Text>
                <TouchableOpacity onPress={handleDeleteCollection} style={CollectionDetailScreenStyle.headerRight}>
                    <MoreVertical size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            {loading && !refreshing ? (
                <ActivityIndicator size="large" color={theme.tint} style={{ marginTop: 40 }} />
            ) : (
                <FlashList
                    data={quotes}
                    renderItem={({ item }) => (
                        <SavedQuoteItem
                            item={item}
                            onRemove={handleRemoveQuote}
                            removeFromCollectionOnly={true}
                            onManageCollections={(q) => {
                                setManageQuote(q);
                                setIsManageSheetVisible(true);
                            }}
                        />
                    )}
                    contentContainerStyle={CollectionDetailScreenStyle.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />}
                    ListEmptyComponent={
                        <View style={CollectionDetailScreenStyle.emptyState}>
                            <Text style={{ color: theme.text, opacity: 0.6 }}>No quotes in this collection yet.</Text>
                        </View>
                    }
                />
            )}

            <ManageCollectionsSheet
                isVisible={isManageSheetVisible}
                onClose={() => setIsManageSheetVisible(false)}
                quote={manageQuote}
            />
        </SafeAreaView>
    );
}
