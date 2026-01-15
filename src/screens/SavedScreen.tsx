import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/fonts';
import { useAuth } from '@/src/context/AuthProvider';
import { useTheme } from '@/src/context/ThemeContext';
import { FlashList } from '@shopify/flash-list';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../config/supabaseConfig';
import AnimatedBottomSheetModal from '../../src/components/AnimatedBottomSheetModal';
import ManageCollectionsSheet from '../../src/components/ManageCollectionsSheet';
import SavedQuoteItem from '../../src/components/SavedQuoteItem';
import { Quote } from '../../types/Quote.types';
import SavedScreenStyles from '../styles/SavedScreenStyles';



export default function Saved() {
    const { session } = useAuth();
    const { theme, isDarkMode } = useTheme();
    const { tab } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState<'quotes' | 'collections'>('quotes');
    const [favorites, setFavorites] = useState<Quote[]>([]);
    const [myCollections, setMyCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedQuoteIds, setSelectedQuoteIds] = useState<string[]>([]);

    const [manageQuote, setManageQuote] = useState<Quote | null>(null);
    const [isManageSheetVisible, setIsManageSheetVisible] = useState(false);
    const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [creating, setCreating] = useState(false);

    const fetchFavorites = async () => {
        if (!session?.user) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('favorites')
                .select(`id, quote:quotes (*)`)
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) {
                const quotes = data.map((item: any) => item.quote).filter(Boolean) as Quote[];
                setFavorites(quotes);
            }
        } catch (error) {
            console.log('Error fetching favorites:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchCollections = async () => {
        if (!session?.user) return;
        try {
            const { data, error } = await supabase
                .from('collections')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setMyCollections(data);
        } catch (e) {
            console.log('Error fetching collections:', e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (tab === 'questions' || tab === 'quotes') {
                setActiveTab('quotes');
            } else if (tab === 'collections') {
                setActiveTab('collections');
            }

            fetchFavorites();
            fetchCollections();
        }, [session, tab])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchFavorites();
        fetchCollections();
    };

    const toggleSelection = (id: string) => {
        setSelectedQuoteIds(prev =>
            prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
        );
    };

    const startCreationFlow = () => {
        setIsSelectionMode(true);
        setActiveTab('quotes');
    };

    const cancelSelection = () => {
        setIsSelectionMode(false);
        setSelectedQuoteIds([]);
    };

    const openNameModal = (collectionId?: string, currentName?: string) => {
        if (collectionId && currentName) {
            setEditingCollectionId(collectionId);
            setNewCollectionName(currentName);
            setIsModalVisible(true);
            return;
        }

        if (selectedQuoteIds.length === 0) {
            Alert.alert('Empty Selection', 'Please select at least one quote.');
            return;
        }
        setEditingCollectionId(null);
        setNewCollectionName('');
        setIsModalVisible(true);
    };

    const handleCreateOrUpdateCollection = async () => {
        if (!newCollectionName.trim() || !session?.user) return;
        setCreating(true);

        try {
            if (editingCollectionId) {
                // UPDATE (Rename)
                const { error } = await supabase
                    .from('collections')
                    .update({ name: newCollectionName.trim() })
                    .eq('id', editingCollectionId);

                if (error) throw error;
                Alert.alert('Success', 'Collection renamed.');
            } else {
                const { data: collectionData, error: collectionError } = await supabase
                    .from('collections')
                    .insert({
                        name: newCollectionName.trim(),
                        user_id: session.user.id
                    })
                    .select()
                    .single();

                if (collectionError) throw collectionError;
                const quotesToInsert = selectedQuoteIds.map(quoteId => ({
                    collection_id: collectionData.id,
                    quote_id: quoteId
                }));

                const { error: itemsError } = await supabase
                    .from('collection_items')
                    .insert(quotesToInsert);

                if (itemsError) throw itemsError;
                Alert.alert('Success', 'Collection created successfully!');
            }
            setIsModalVisible(false);
            setNewCollectionName('');
            setEditingCollectionId(null);
            setIsSelectionMode(false);
            setSelectedQuoteIds([]);
            fetchCollections();
            if (!editingCollectionId) setActiveTab('collections');

        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to save collection');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteCollection = (collectionId: string) => {
        Alert.alert(
            'Delete Collection',
            'Are you sure you want to delete this collection? Quotes inside will remain in your Favorites.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const { error } = await supabase
                            .from('collections')
                            .delete()
                            .eq('id', collectionId);
                        if (error) Alert.alert('Error', error.message);
                        else fetchCollections();
                    }
                }
            ]
        );
    };

    const openManageSheet = (quote: Quote) => {
        setManageQuote(quote);
        setIsManageSheetVisible(true);
    };

    const renderCollectionItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[SavedScreenStyles.collectionCard, { backgroundColor: theme.cardBackground }]}
            onPress={() => router.push(`/collection/${item.id}`)}
            onLongPress={() => {
                Alert.alert(
                    item.name,
                    'Manage Collection',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Rename', onPress: () => openNameModal(item.id, item.name) },
                        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteCollection(item.id) }
                    ]
                )
            }}
        >
            <View style={[SavedScreenStyles.collectionIconPlaceholder, { backgroundColor: theme.tint }]}>
                <Text style={SavedScreenStyles.collectionInitial}>{item.name.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={[SavedScreenStyles.collectionName, { color: theme.text }]}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[SavedScreenStyles.container, { backgroundColor: theme.background }]}>
            <View style={SavedScreenStyles.header}>
                <Text style={[SavedScreenStyles.title, { color: theme.text }]}>Favorites</Text>
                {isSelectionMode ? (
                    <TouchableOpacity onPress={cancelSelection}>
                        <Text style={[SavedScreenStyles.cancelText, { color: theme.tint }]}>Cancel</Text>
                    </TouchableOpacity>
                ) : (
                    activeTab === 'collections' && (
                        <TouchableOpacity onPress={startCreationFlow}>
                            <Plus size={24} color={theme.text} />
                        </TouchableOpacity>
                    )
                )}
            </View>

            <View style={[SavedScreenStyles.tabContainer, { backgroundColor: isDarkMode ? COLORS.DARK_HIGHLIGHT : COLORS.GRAY_LIGHTEST }]}>
                <TouchableOpacity
                    style={[SavedScreenStyles.tab, activeTab === 'quotes' && SavedScreenStyles.activeTab]}
                    onPress={() => setActiveTab('quotes')}
                >
                    <Text style={[SavedScreenStyles.tabText, { color: activeTab === 'quotes' && !isDarkMode ? COLORS.BLACK : (activeTab === 'quotes' ? theme.text : COLORS.GRAY_888) }]}>All Quotes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[SavedScreenStyles.tab, activeTab === 'collections' && SavedScreenStyles.activeTab]}
                    onPress={() => setActiveTab('collections')}
                >
                    <Text style={[SavedScreenStyles.tabText, { color: activeTab === 'collections' && !isDarkMode ? COLORS.BLACK : (activeTab === 'collections' ? theme.text : COLORS.GRAY_888) }]}>Collections</Text>
                </TouchableOpacity>
            </View>

            {loading && !refreshing ? (
                <ActivityIndicator size="large" color={theme.tint} style={{ marginTop: 40 }} />
            ) : (
                <View style={SavedScreenStyles.content}>
                    {activeTab === 'quotes' ? (
                        <>
                            <FlashList
                                data={favorites}
                                renderItem={({ item }) => (
                                    <SavedQuoteItem
                                        item={item}
                                        onRemove={(id) => setFavorites(prev => prev.filter(q => q.id !== id))}
                                        isSelectionMode={isSelectionMode}
                                        isSelected={selectedQuoteIds.includes(item.id)}
                                        onSelect={toggleSelection}
                                        onManageCollections={openManageSheet}
                                    />
                                )}
                                contentContainerStyle={SavedScreenStyles.listContent}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                                ListEmptyComponent={
                                    <View style={SavedScreenStyles.emptyState}>
                                        <Text style={{ color: theme.text, opacity: 0.6 }}>No favorites yet</Text>
                                    </View>
                                }
                            />
                            {isSelectionMode && (
                                <View style={[SavedScreenStyles.bottomBar, { backgroundColor: theme.cardBackground, borderTopColor: theme.text }]}>
                                    <Text style={{ color: theme.text }}>{selectedQuoteIds.length} Selected</Text>
                                    <TouchableOpacity
                                        style={[SavedScreenStyles.nextButton, { backgroundColor: theme.tint, opacity: selectedQuoteIds.length > 0 ? 1 : 0.5 }]}
                                        onPress={() => openNameModal()}
                                        disabled={selectedQuoteIds.length === 0}
                                    >
                                        <Text style={{ color: COLORS.WHITE, fontWeight: 'bold' }}>Next</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    ) : (
                        <FlashList
                            data={myCollections}
                            renderItem={renderCollectionItem}
                            numColumns={2}
                            contentContainerStyle={SavedScreenStyles.listContent}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            ListEmptyComponent={
                                myCollections.length === 0 ? null : (
                                    <View style={SavedScreenStyles.emptyState}>
                                        <Text style={{ color: theme.text, opacity: 0.6, fontFamily: FONTS.GOOGLE_SANS_MEDIUM }}>No collections directly created yet.</Text>
                                    </View>
                                )
                            }
                        />
                    )}
                </View>
            )}

            <AnimatedBottomSheetModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} children={
                <View style={SavedScreenStyles.modalContent}>
                    <Text style={[SavedScreenStyles.modalTitle, { color: theme.text }]}>Name your collection</Text>
                    <TextInput
                        style={[SavedScreenStyles.input, { color: theme.text, backgroundColor: isDarkMode ? COLORS.DARK_CARD : COLORS.GRAY_LIGHTER }]}
                        placeholder="Collection Name"
                        placeholderTextColor={COLORS.GRAY_999}
                        value={newCollectionName}
                        onChangeText={setNewCollectionName}
                        autoFocus
                    />
                    <TouchableOpacity
                        style={[SavedScreenStyles.createButton, { backgroundColor: theme.tint }]}
                        onPress={handleCreateOrUpdateCollection}
                        disabled={creating}
                    >
                        {creating ? (
                            <ActivityIndicator color={COLORS.WHITE} />
                        ) : (
                            <Text style={SavedScreenStyles.createButtonText}>{editingCollectionId ? 'Update' : 'Create'} Collection</Text>
                        )}
                    </TouchableOpacity>
                </View>
            } />

            <ManageCollectionsSheet
                isVisible={isManageSheetVisible}
                onClose={() => setIsManageSheetVisible(false)}
                quote={manageQuote}
            />
        </SafeAreaView>
    );
};
