import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/fonts';
import { Heart, Share2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Quote } from '../../types/Quote.types';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import ShareQuoteSheet from './ShareQuoteSheet';

interface QuoteOfTheDayProps {
    quote: Quote | null;
}

export default function QuoteOfTheDay({ quote }: QuoteOfTheDayProps) {
    const { theme } = useTheme();

    const { isFavorite, toggleFavorite } = useFavoritesContext();
    const isLiked = quote ? isFavorite(quote.id) : false;

    const handleToggleFavorite = async () => {
        if (quote) {
            await toggleFavorite(quote);
        }
    };

    const [isShareSheetVisible, setIsShareSheetVisible] = React.useState(false);

    if (!quote) return null;

    return (
        <View style={styles.container}>
            <View
                style={[styles.card, { backgroundColor: theme.quoteOfTheDayBackground }]}
            >
                <View style={styles.header}>
                    <View style={[styles.badge, { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
                        <Text style={[styles.badgeText, { color: 'rgba(255,255,255,0.8)' }]}>QUOTE OF THE DAY</Text>
                    </View>
                </View>

                <Text style={[styles.quoteText, { color: COLORS.WHITE }]}>
                    "{quote.text}"
                </Text>

                <View style={styles.authorContainer}>
                    <View style={[styles.separator, { backgroundColor: 'rgba(255,255,255,0.4)' }]} />
                    <Text style={[styles.authorName, { color: COLORS.WHITE }]}>{quote.author.toUpperCase()}</Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={handleToggleFavorite} style={[styles.shareButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Heart size={20} color={COLORS.WHITE} fill={isLiked ? COLORS.WHITE : 'transparent'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.shareButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]} onPress={() => setIsShareSheetVisible(true)}>
                        <Share2 size={20} color={COLORS.WHITE} />
                    </TouchableOpacity>
                </View>
            </View>

            <ShareQuoteSheet
                isVisible={isShareSheetVisible}
                onClose={() => setIsShareSheetVisible(false)}
                quote={quote}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    card: {
        borderRadius: 24,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    badgeText: {
        fontSize: 10,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        letterSpacing: 1,
    },
    quoteText: {
        fontSize: 24,
        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
        marginBottom: 24,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    separator: {
        width: 16,
        height: 2,
        marginRight: 10,
    },
    authorName: {
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        fontSize: 12,
        letterSpacing: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 16,
    },
    shareButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
