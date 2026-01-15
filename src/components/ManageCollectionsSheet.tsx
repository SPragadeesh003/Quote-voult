import { supabase } from '@/config/supabaseConfig';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/src/context/AuthProvider';
import { useTheme } from '@/src/context/ThemeContext';
import { Quote } from '@/types/Quote.types';
import { Check, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AnimatedBottomSheetModal from './AnimatedBottomSheetModal';
import { FONTS } from '@/constants/fonts';

interface ManageCollectionsSheetProps {
    isVisible: boolean;
    onClose: () => void;
    quote: Quote | null;
}

export default function ManageCollectionsSheet({ isVisible, onClose, quote }: ManageCollectionsSheetProps) {
    const { theme, isDarkMode } = useTheme();
    const { session } = useAuth();
    const [collections, setCollections] = useState<any[]>([]);
    const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [showCreateInput, setShowCreateInput] = useState(false);

    useEffect(() => {
        if (isVisible && quote && session?.user) {
            fetchCollectionsAndSelection();
        }
    }, [isVisible, quote, session]);

    const fetchCollectionsAndSelection = async () => {
        if (!session?.user || !quote) return;
        setLoading(true);
        try {
            const { data: collectionsData, error: collectionsError } = await supabase
                .from('collections')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (collectionsError) throw collectionsError;
            setCollections(collectionsData || []);

            const { data: itemsData, error: itemsError } = await supabase
                .from('collection_items')
                .select('collection_id')
                .eq('quote_id', quote.id);

            if (itemsError) throw itemsError;

            const ids = itemsData?.map((item: any) => item.collection_id) || [];
            setSelectedCollectionIds(ids);

        } catch (error) {
            console.error('Error fetching collections for sheet:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCollection = async (collectionId: string) => {
        if (!quote) return;

        const isSelected = selectedCollectionIds.includes(collectionId);
        setSelectedCollectionIds(prev =>
            isSelected ? prev.filter(id => id !== collectionId) : [...prev, collectionId]
        );

        try {
            if (isSelected) {
                const { error } = await supabase
                    .from('collection_items')
                    .delete()
                    .eq('collection_id', collectionId)
                    .eq('quote_id', quote.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('collection_items')
                    .insert({ collection_id: collectionId, quote_id: quote.id });
                if (error) throw error;
            }
        } catch (error) {
            console.error('Error toggling collection:', error);
            setSelectedCollectionIds(prev =>
                isSelected ? [...prev, collectionId] : prev.filter(id => id !== collectionId)
            );
            Alert.alert('Error', 'Failed to update collection.');
        }
    };

    const createCollection = async () => {
        if (!newCollectionName.trim() || !session?.user || !quote) return;
        setCreating(true);
        try {
            const { data: collectionData, error: collectionError } = await supabase
                .from('collections')
                .insert({
                    name: newCollectionName.trim(),
                    user_id: session.user.id
                })
                .select()
                .single();

            if (collectionError) throw collectionError;

            const { error: itemError } = await supabase
                .from('collection_items')
                .insert({ collection_id: collectionData.id, quote_id: quote.id });

            if (itemError) throw itemError;

            setNewCollectionName('');
            setShowCreateInput(false);
            fetchCollectionsAndSelection();

        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setCreating(false);
        }
    };

    return (
        <AnimatedBottomSheetModal isVisible={isVisible} onClose={onClose}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>Save to Collection</Text>
                    <TouchableOpacity onPress={() => setShowCreateInput(!showCreateInput)}>
                        <Plus size={24} color={theme.tint} />
                    </TouchableOpacity>
                </View>

                {showCreateInput && (
                    <View style={styles.createContainer}>
                        <TextInput
                            style={[styles.input, { color: theme.text, backgroundColor: isDarkMode ? COLORS.DARK_CARD : COLORS.GRAY_LIGHT, flex: 1 }]}
                            placeholder="New Collection Name"
                            placeholderTextColor={COLORS.GRAY_MEDIUM}
                            value={newCollectionName}
                            onChangeText={setNewCollectionName}
                            autoFocus
                        />
                        <TouchableOpacity
                            style={[styles.createButton, { backgroundColor: theme.tint }]}
                            onPress={createCollection}
                            disabled={creating}
                        >
                            {creating ? <ActivityIndicator color={COLORS.WHITE} /> : <Check size={20} color={COLORS.WHITE} />}
                        </TouchableOpacity>
                    </View>
                )}

                {loading ? (
                    <ActivityIndicator size="large" color={theme.tint} style={{ margin: 20 }} />
                ) : (
                    <FlatList
                        data={collections}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListEmptyComponent={
                            !loading && <Text style={{ color: theme.text, opacity: 0.6, textAlign: 'center', marginTop: 20 }}>No collections found.</Text>
                        }
                        renderItem={({ item }) => {
                            const isSelected = selectedCollectionIds.includes(item.id);
                            return (
                                <TouchableOpacity
                                    style={[styles.item, { borderBottomColor: theme.text }]}
                                    onPress={() => toggleCollection(item.id)}
                                >
                                    <View style={[styles.checkbox, { borderColor: theme.text, backgroundColor: isSelected ? theme.tint : 'transparent', borderWidth: isSelected ? 0 : 2 }]}>
                                        {isSelected && <Check size={14} color={COLORS.WHITE} strokeWidth={3} />}
                                    </View>
                                    <Text style={[styles.itemText, { color: theme.text }]}>{item.name}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                )}

                {selectedCollectionIds.length > 0 && (
                    <TouchableOpacity onPress={onClose} style={[styles.doneButton, { backgroundColor: theme.tint }]}>
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                )}

            </View>
        </AnimatedBottomSheetModal>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20,
        minHeight: 200,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    createContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    input: {
        padding: 12,
        borderRadius: 12,
    },
    createButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 0.5,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
    },
    doneButton: {
        marginTop: 20,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneButtonText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    }
});
