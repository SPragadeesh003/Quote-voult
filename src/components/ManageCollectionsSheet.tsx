import { supabase } from '@/config/supabaseConfig';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/src/context/AuthProvider';
import { useTheme } from '@/src/context/ThemeContext';
import { Quote } from '@/types/Quote.types';
import { Check, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AnimatedBottomSheetModal from './AnimatedBottomSheetModal';
import { FONTS } from '@/constants/fonts';

interface ManageCollectionsSheetProps {
    isVisible: boolean;
    onClose: () => void;
    quote?: Quote | null;
    quoteIds?: string[];
    onDone?: () => void;
}

export default function ManageCollectionsSheet({ isVisible, onClose, quote, quoteIds, onDone }: ManageCollectionsSheetProps) {
    const { theme, isDarkMode } = useTheme();
    const { session } = useAuth();
    const [collections, setCollections] = useState<any[]>([]);
    const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [showCreateInput, setShowCreateInput] = useState(false);

    // Resolve effective quote IDs from either prop
    const effectiveQuoteIds = quoteIds && quoteIds.length > 0 ? quoteIds : quote ? [quote.id] : [];

    useEffect(() => {
        if (isVisible && effectiveQuoteIds.length > 0 && session?.user) {
            fetchCollectionsAndSelection();
            setShowCreateInput(false);
            setNewCollectionName('');
        }
    }, [isVisible, quote, quoteIds, session]);

    const fetchCollectionsAndSelection = async () => {
        if (!session?.user || effectiveQuoteIds.length === 0) return;
        setLoading(true);
        try {
            const { data: collectionsData, error: collectionsError } = await supabase
                .from('collections')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (collectionsError) throw collectionsError;
            setCollections(collectionsData || []);

            // Fetch which collections already contain ALL the quote(s)
            const { data: itemsData, error: itemsError } = await supabase
                .from('collection_items')
                .select('collection_id, quote_id')
                .in('quote_id', effectiveQuoteIds);

            if (itemsError) throw itemsError;

            if (effectiveQuoteIds.length === 1) {
                // Single quote: simple list of collection IDs
                const ids = itemsData?.map((item: any) => item.collection_id) || [];
                setSelectedCollectionIds(ids);
            } else {
                // Multiple quotes: only mark collections that contain ALL selected quotes
                const collectionQuoteMap: Record<string, Set<string>> = {};
                itemsData?.forEach((item: any) => {
                    if (!collectionQuoteMap[item.collection_id]) {
                        collectionQuoteMap[item.collection_id] = new Set();
                    }
                    collectionQuoteMap[item.collection_id].add(item.quote_id);
                });
                const fullyContainedIds = Object.entries(collectionQuoteMap)
                    .filter(([_, quoteSet]) => effectiveQuoteIds.every(id => quoteSet.has(id)))
                    .map(([collectionId]) => collectionId);
                setSelectedCollectionIds(fullyContainedIds);
            }
        } catch (error) {
            console.error('Error fetching collections for sheet:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCollection = async (collectionId: string) => {
        if (effectiveQuoteIds.length === 0) return;

        const isSelected = selectedCollectionIds.includes(collectionId);
        setSelectedCollectionIds(prev =>
            isSelected ? prev.filter(id => id !== collectionId) : [...prev, collectionId]
        );

        try {
            if (isSelected) {
                // Remove quote(s) from collection
                for (const qId of effectiveQuoteIds) {
                    const { error } = await supabase
                        .from('collection_items')
                        .delete()
                        .eq('collection_id', collectionId)
                        .eq('quote_id', qId);
                    if (error) throw error;
                }
            } else {
                // Add quote(s) to collection (skip duplicates)
                const { data: existingItems } = await supabase
                    .from('collection_items')
                    .select('quote_id')
                    .eq('collection_id', collectionId)
                    .in('quote_id', effectiveQuoteIds);

                const existingSet = new Set(existingItems?.map((i: any) => i.quote_id) || []);
                const newItems = effectiveQuoteIds
                    .filter(qId => !existingSet.has(qId))
                    .map(qId => ({ collection_id: collectionId, quote_id: qId }));

                if (newItems.length > 0) {
                    const { error } = await supabase
                        .from('collection_items')
                        .insert(newItems);
                    if (error) throw error;
                }
            }
        } catch (error) {
            console.error('Error toggling collection:', error);
            setSelectedCollectionIds(prev =>
                isSelected ? [...prev, collectionId] : prev.filter(id => id !== collectionId)
            );
            Alert.alert('Error', 'Failed to update collection.');
        }
    };

    const handleDone = () => {
        onDone?.();
        onClose();
    };

    const createCollection = async () => {
        if (!newCollectionName.trim() || !session?.user || effectiveQuoteIds.length === 0) return;
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

            const quotesToInsert = effectiveQuoteIds.map(qId => ({
                collection_id: collectionData.id,
                quote_id: qId,
            }));

            const { error: itemError } = await supabase
                .from('collection_items')
                .insert(quotesToInsert);

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
            <ScrollView style={{ maxHeight: 450 }} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={[styles.title, { color: theme.text }]}>Save to Collection</Text>

                    {loading ? (
                        <ActivityIndicator size="large" color={theme.tint} style={{ margin: 20 }} />
                    ) : collections.length === 0 ? (
                        <Text style={[styles.emptyText, { color: theme.text }]}>No collections yet.</Text>
                    ) : (
                        <View style={{ marginBottom: 8 }}>
                            {collections.map((item) => {
                                const isSelected = selectedCollectionIds.includes(item.id);
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[styles.collectionRow, { borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}
                                        onPress={() => toggleCollection(item.id)}
                                    >
                                        <View style={[styles.collectionIcon, { backgroundColor: theme.tint }]}>
                                            <Text style={styles.collectionIconText}>{item.name.charAt(0).toUpperCase()}</Text>
                                        </View>
                                        <Text style={[styles.collectionName, { color: theme.text }]}>{item.name}</Text>
                                        {isSelected && (
                                            <View style={[styles.checkBadge, { backgroundColor: theme.tint }]}>
                                                <Check size={14} color={COLORS.WHITE} strokeWidth={3} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    <View style={styles.dividerContainer}>
                        <View style={[styles.dividerLine, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]} />
                        <Text style={[styles.dividerText, { color: COLORS.GRAY_MEDIUM }]}>or</Text>
                        <View style={[styles.dividerLine, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]} />
                    </View>

                    {showCreateInput ? (
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
                                style={[styles.createButton, { backgroundColor: theme.tint, opacity: newCollectionName.trim() ? 1 : 0.5 }]}
                                onPress={createCollection}
                                disabled={creating || !newCollectionName.trim()}
                            >
                                {creating ? <ActivityIndicator color={COLORS.WHITE} /> : <Check size={20} color={COLORS.WHITE} />}
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[styles.createNewButton, { borderColor: theme.tint }]}
                            onPress={() => setShowCreateInput(true)}
                        >
                            <Plus size={20} color={theme.tint} />
                            <Text style={[styles.createNewButtonText, { color: theme.tint }]}>Create New Collection</Text>
                        </TouchableOpacity>
                    )}

                    {selectedCollectionIds.length > 0 && (
                        <TouchableOpacity onPress={handleDone} style={[styles.doneButton, { backgroundColor: theme.tint }]}>
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </AnimatedBottomSheetModal>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        minHeight: 200,
    },
    title: {
        fontSize: 20,
        fontFamily: FONTS.GOOGLE_SANS_BOLD,
        marginBottom: 16,
    },
    emptyText: {
        opacity: 0.6,
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
    },
    collectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 0.5,
    },
    collectionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    collectionIconText: {
        color: COLORS.WHITE,
        fontSize: 14,
        fontFamily: FONTS.GOOGLE_SANS_BOLD,
    },
    collectionName: {
        flex: 1,
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    checkBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 12,
        fontSize: 13,
        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
    },
    createContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    input: {
        padding: 12,
        borderRadius: 12,
        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
    },
    createButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        gap: 8,
    },
    createNewButtonText: {
        fontSize: 15,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
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
    },
});
