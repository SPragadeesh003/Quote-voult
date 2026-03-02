import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/fonts';
import { useAuth } from '@/src/context/AuthProvider';
import { useTheme } from '@/src/context/ThemeContext';
import { FlashList } from '@shopify/flash-list';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Check, Plus } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    const [isBatchCollectionSheetVisible, setIsBatchCollectionSheetVisible] = useState(false);

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
        setIsBatchCollectionSheetVisible(true);
    };

    const handleRenameCollection = async () => {
        if (!newCollectionName.trim() || !session?.user || !editingCollectionId) return;
        setCreating(true);
        try {
            const { error } = await supabase
                .from('collections')
                .update({ name: newCollectionName.trim() })
                .eq('id', editingCollectionId);

            if (error) throw error;
            Alert.alert('Success', 'Collection renamed.');
            setIsModalVisible(false);
            setNewCollectionName('');
            setEditingCollectionId(null);
            fetchCollections();
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to rename collection');
        } finally {
            setCreating(false);
        }
    };

    const handleBatchCollectionDone = () => {
        setIsSelectionMode(false);
        setSelectedQuoteIds([]);
        fetchCollections();
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
                                extraData={[selectedQuoteIds, isSelectionMode]}
                                // estimatedItemSize={200}
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
                                    <Text style={{ color: theme.text, fontFamily: FONTS.GOOGLE_SANS_MEDIUM, fontSize: 15 }}>{selectedQuoteIds.length} Selected</Text>
                                    <TouchableOpacity
                                        style={[SavedScreenStyles.nextButton, { backgroundColor: theme.tint, opacity: selectedQuoteIds.length > 0 ? 1 : 0.5 }]}
                                        onPress={() => openNameModal()}
                                        disabled={selectedQuoteIds.length === 0}
                                    >
                                        <Text style={{ color: COLORS.WHITE, fontFamily: FONTS.GOOGLE_SANS_BOLD, fontSize: 15 }}>Next</Text>
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
                                <View style={SavedScreenStyles.emptyState}>
                                    <Text style={{ color: theme.text, opacity: 0.6, fontFamily: FONTS.GOOGLE_SANS_MEDIUM }}>No collections yet. Tap + to create one.</Text>
                                </View>
                            }
                        />
                    )}
                </View>
            )}

            <AnimatedBottomSheetModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} children={
                <ScrollView style={{ maxHeight: 450 }} showsVerticalScrollIndicator={false} bounces={false}>
                    <View style={SavedScreenStyles.modalContent}>
                        <Text style={[SavedScreenStyles.modalTitle, { color: theme.text }]}>Rename Collection</Text>
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
                            onPress={handleRenameCollection}
                            disabled={creating}
                        >
                            {creating ? (
                                <ActivityIndicator color={COLORS.WHITE} />
                            ) : (
                                <Text style={SavedScreenStyles.createButtonText}>Update Collection</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            } />

            <ManageCollectionsSheet
                isVisible={isManageSheetVisible}
                onClose={() => setIsManageSheetVisible(false)}
                quote={manageQuote}
            />

            <ManageCollectionsSheet
                isVisible={isBatchCollectionSheetVisible}
                onClose={() => setIsBatchCollectionSheetVisible(false)}
                quoteIds={selectedQuoteIds}
                onDone={handleBatchCollectionDone}
            />
        </SafeAreaView>
    );
};
