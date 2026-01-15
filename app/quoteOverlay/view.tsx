import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/fonts';
import ShareQuoteSheet from '@/src/components/ShareQuoteSheet';
import { useFavoritesContext } from '@/src/context/FavoritesContext';
import { useTheme } from '@/src/context/ThemeContext';
import { Quote } from '@/types/Quote.types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Heart, Share2, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function QuoteView() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { theme } = useTheme();
    const { isFavorite, toggleFavorite } = useFavoritesContext();

    // Parse params back to Quote object
    const quote: Quote = {
        id: params.id as string,
        text: params.text as string,
        author: params.author as string,
        category: params.category as string,
        is_favorite: params.is_favorite === 'true',
        user_id: params.user_id as string,
        created_at: params.created_at as string,
        background_image: params.background_image as string,
    };

    const isLiked = isFavorite(quote.id);
    const [isVisible, setIsVisible] = useState(false);
    const [shareSheetVisible, setShareSheetVisible] = useState(false);

    useEffect(() => {
        // slight delay for animation effect if needed, but 'fade' transistion handles it
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        router.back();
    };

    const handleShare = () => {
        setShareSheetVisible(true);
    };

    const handleToggleFavorite = () => {
        toggleFavorite(quote);
    };

    return (
        <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.85)' }]}>
            <TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1} />

            <View style={[styles.contentContainer, { backgroundColor: theme.cardBackground }]}>
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                    <X size={24} color={theme.text} />
                </TouchableOpacity>

                <View style={styles.quoteBody}>
                    <View style={[styles.categoryBadge, { backgroundColor: theme.tint + '20' }]}>
                        <Text style={[styles.categoryText, { color: theme.tint }]}>
                            {quote.category?.toUpperCase() || 'GENERAL'}
                        </Text>
                    </View>

                    <Text style={[styles.quoteText, { color: theme.text }]}>
                        "{quote.text}"
                    </Text>

                    <Text style={[styles.authorText, { color: theme.text }]}>
                        — {quote.author || 'Unknown'}
                    </Text>
                </View>

                {/* Actions */}
                <View style={[styles.actionRow, { borderTopColor: theme.text }]}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleToggleFavorite}>
                        <Heart
                            size={28}
                            color={isLiked ? COLORS.HEART_RED : theme.text}
                            fill={isLiked ? COLORS.HEART_RED : 'transparent'}
                        />
                        <Text style={[styles.actionLabel, { color: theme.text }]}>
                            {isLiked ? 'Liked' : 'Like'}
                        </Text>
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: theme.text }]} />

                    <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                        <Share2 size={28} color={theme.text} />
                        <Text style={[styles.actionLabel, { color: theme.text }]}>
                            Share
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ShareQuoteSheet
                isVisible={shareSheetVisible}
                onClose={() => setShareSheetVisible(false)}
                quote={quote}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    contentContainer: {
        width: '100%',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.30,
        shadowRadius: 10,
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 4,
        zIndex: 10,
    },
    quoteBody: {
        alignItems: 'center',
        paddingVertical: 20,
        width: '100%',
    },
    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 16,
    },
    categoryText: {
        fontSize: 12,
        fontFamily: FONTS.GOOGLE_SANS_BOLD,
        letterSpacing: 1,
    },
    quoteText: {
        fontSize: 26,
        fontFamily: FONTS.OSWALD_MEDIUM,
        textAlign: 'center',
        lineHeight: 36,
        marginBottom: 20,
    },
    authorText: {
        fontSize: 18,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        opacity: 0.8,
    },
    actionRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 20,
        marginTop: 10,
        borderTopWidth: 1,
    },
    actionButton: {
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    actionLabel: {
        fontSize: 14,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    divider: {
        width: 1,
        height: 30,
    }
});
