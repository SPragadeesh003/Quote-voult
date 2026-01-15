import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/fonts';
import { useTheme } from '@/src/context/ThemeContext';
import { useFavorites } from '@/src/hooks/useFavorites';
import { Quote } from '@/types/Quote.types';
import { Bookmark, Check, Library, Quote as QuoteIcon, Share2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ShareQuoteSheet from './ShareQuoteSheet';

interface SavedQuoteItemProps {
    item: Quote;
    onRemove: (id: string) => void;
    isSelectionMode?: boolean;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    onManageCollections?: (quote: Quote) => void;
    removeFromCollectionOnly?: boolean;
}

export default function SavedQuoteItem({
    item,
    onRemove,
    isSelectionMode = false,
    isSelected = false,
    onSelect,
    onManageCollections,
    removeFromCollectionOnly = false,
}: SavedQuoteItemProps) {
    const { toggleFavorite } = useFavorites();
    const { theme } = useTheme();

    const [isShareSheetVisible, setIsShareSheetVisible] = React.useState(false);

    const handleRemove = async () => {
        if (isSelectionMode) return;
        if (!removeFromCollectionOnly) {
            await toggleFavorite(item);
        }
        onRemove(item.id);
    };

    const handlePress = () => {
        if (isSelectionMode && onSelect) {
            onSelect(item.id);
        }
    };

    return (
        <>
            <TouchableOpacity
                activeOpacity={isSelectionMode ? 0.8 : 1}
                onPress={handlePress}
                style={[styles.card, { backgroundColor: theme.tint }, isSelected && styles.selectedCard]}
            >
                <View style={styles.watermarkContainer}>
                    <QuoteIcon size={120} color="rgba(255,255,255,0.1)" fill="rgba(255,255,255,0.1)" />
                </View>

                {isSelectionMode && (
                    <View style={[styles.checkbox, isSelected && { backgroundColor: COLORS.WHITE, borderColor: COLORS.WHITE }]}>
                        {isSelected && <Check size={14} color={theme.tint} strokeWidth={4} />}
                    </View>
                )}

                <View style={styles.cardHeader}>
                    <Text style={styles.categoryLabel}>{item.category?.toUpperCase() || 'GENERAL'}</Text>
                </View>

                <Text style={styles.quoteText}>"{item.text}"</Text>

                <View style={styles.cardFooter}>
                    <Text style={styles.authorName}>- {item.author}</Text>
                    {!isSelectionMode && (
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity onPress={() => setIsShareSheetVisible(true)} style={styles.actionButton}>
                                <Share2 size={22} color={COLORS.WHITE} />
                            </TouchableOpacity>
                            {onManageCollections && (
                                <TouchableOpacity onPress={() => onManageCollections(item)} style={styles.actionButton}>
                                    <Library size={22} color={COLORS.WHITE} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={handleRemove} style={styles.actionButton}>
                                <Bookmark size={22} color={COLORS.WHITE} fill={COLORS.WHITE} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            <ShareQuoteSheet
                isVisible={isShareSheetVisible}
                onClose={() => setIsShareSheetVisible(false)}
                quote={item}
            />
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginVertical: 8,
        borderRadius: 24,
        padding: 24,
        minHeight: 180,
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
    },
    selectedCard: {
        borderWidth: 3,
        borderColor: COLORS.WHITE,
    },
    checkbox: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    watermarkContainer: {
        position: 'absolute',
        top: -10,
        right: -10,
        opacity: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    categoryLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    quoteText: {
        color: COLORS.WHITE,
        fontSize: 22,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        lineHeight: 30,
        marginBottom: 24,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    authorName: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        flex: 1,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    actionButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
