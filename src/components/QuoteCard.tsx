import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/fonts';
import { Heart, Share2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Quote } from '../../types/Quote.types';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import ShareQuoteSheet from './ShareQuoteSheet';
import { useRouter } from 'expo-router';

interface QuoteCardProps {
    quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
    const router = useRouter();
    const { theme } = useTheme();
    const { isFavorite, toggleFavorite } = useFavoritesContext();
    const isLiked = isFavorite(quote.id);

    const [isShareSheetVisible, setIsShareSheetVisible] = React.useState(false);

    const handleToggleFavorite = async () => {
        await toggleFavorite(quote);
    };

    const handleShare = () => {
        setIsShareSheetVisible(true);
    };
    const handleComment = () => { };

    return (
        <>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push({
                    pathname: '/quoteOverlay/view',
                    params: {
                        id: quote.id,
                        text: quote.text,
                        author: quote.author,
                        category: quote.category,
                        is_favorite: String(isLiked),
                    }
                })}
            >
                <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                    <View style={styles.headerRow}>
                        <View style={[styles.categoryChip, { backgroundColor: `${theme.tint}20` }]}>
                            <Text style={[styles.categoryText, { color: theme.tint }]}>
                                {quote.category?.toUpperCase() || 'GENERAL'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <Text style={[styles.quoteText, { color: theme.text }]}>"{quote.text}"</Text>
                        <Text style={[styles.author, { color: theme.text }]}>~ {quote.author || 'Unknown'}</Text>
                    </View>
                    <View style={styles.footerRow}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleToggleFavorite}>
                            <Heart size={24} color={isLiked ? COLORS.HEART_RED : theme.tabIconDefault} fill={isLiked ? COLORS.HEART_RED : 'transparent'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                            <Share2 size={24} color={theme.tabIconDefault} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>

            <ShareQuoteSheet
                isVisible={isShareSheetVisible}
                onClose={() => setIsShareSheetVisible(false)}
                quote={quote}
            />
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        marginHorizontal: 24,
        marginBottom: 16,
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    categoryChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 10,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        letterSpacing: 0.5,
    },
    content: {
        paddingHorizontal: 8,
        marginBottom: 4,
    },
    quoteText: {
        fontSize: 18,
        fontFamily: FONTS.OSWALD_MEDIUM,
        lineHeight: 26,
        marginBottom: 12,
        letterSpacing: 0.3,
    },
    author: {
        fontSize: 14,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        opacity: 0.8,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-end",
        gap: 12,
    },
    actionButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
