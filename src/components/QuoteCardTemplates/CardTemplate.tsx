import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/fonts';
import { Quote } from '@/types/Quote.types';
import { TemplateProps } from '@/types/ShareTemplate.types';
import { CATEGORY_IMAGES } from '@/utils/CategoryImage';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

const getCategoryImage = (category: string) => {
    const key = Object.keys(CATEGORY_IMAGES).find(k => k.toLowerCase() === category?.toLowerCase());
    return { uri: CATEGORY_IMAGES[key || 'Default'] };
};

export const ClassicTemplate = ({ quote, fontSizeScale = 1 }: TemplateProps) => (
    <View style={[styles.container, styles.classicContainer]}>
        <View style={styles.contentContainer}>
            <Text style={styles.symbol}>❝</Text>
            <Text style={[styles.classicText, { fontSize: 20 * fontSizeScale, lineHeight: 28 * fontSizeScale }]}>{quote.text}</Text>
            <View style={styles.divider} />
            <Text style={styles.classicAuthor}>- {quote.author.toUpperCase()} -</Text>
        </View>
        <Text style={styles.watermark}>QuickVault</Text>
    </View>
);

export const ModernTemplate = ({ quote, fontSizeScale = 1 }: TemplateProps) => (
    <LinearGradient
        colors={[COLORS.NAVY_BLUE, COLORS.BURNT_RED, COLORS.YELLOW_ORANGE]}
        style={[styles.container, styles.modernContainer]}
    >
        <View style={styles.glassCard}>
            <Text style={[styles.modernText, { fontSize: 22 * fontSizeScale, lineHeight: 32 * fontSizeScale }]}>"{quote.text}"</Text>
            <Text style={styles.modernAuthor}>{quote.author}</Text>
        </View>
        <Text style={[styles.watermark, { color: `${COLORS.WHITE}99` }]}>QuickVault</Text>
    </LinearGradient>
);

export const BoldTemplate = ({ quote, fontSizeScale = 1 }: TemplateProps) => (
    <View style={[styles.container, styles.boldContainer]}>
        <View style={styles.boldContentWrapper}>
            <Text style={[styles.boldText, { fontSize: 28 * fontSizeScale, lineHeight: 34 * fontSizeScale }]}>{quote.text.toUpperCase()}</Text>
            <Text style={styles.boldAuthor}>{quote.author}</Text>
        </View>
        <View style={styles.boldAccent} />
        <Text style={[styles.watermark, { color: COLORS.BLACK }]}>QuickVault</Text>
    </View>
);

export const ImageTemplate = ({ quote, fontSizeScale = 1 }: TemplateProps) => (
    <ImageBackground
        source={getCategoryImage(quote.category)}
        style={[styles.container, styles.imageContainer]}
        imageStyle={{ borderRadius: 0 }}
    >
        <View style={styles.darkOverlay} />
        <View style={styles.imageContent}>
            <Text style={[styles.imageText, { fontSize: 24 * fontSizeScale, lineHeight: 34 * fontSizeScale }]}>"{quote.text}"</Text>
            <View style={styles.imageLine} />
            <Text style={styles.imageAuthor}>{quote.author}</Text>
        </View>
        <Text style={[styles.watermark, { color: `${COLORS.WHITE}CC` }]}>QuickVault</Text>
    </ImageBackground>
);

const styles = StyleSheet.create({
    container: {
        width: 320,
        minHeight: 320,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.WHITE,
    },
    contentContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    watermark: {
        position: 'absolute',
        bottom: 12,
        fontSize: 10,
        color: COLORS.GRAY_MEDIUM,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        letterSpacing: 1,
        zIndex: 10,
    },
    classicContainer: {
        backgroundColor: COLORS.CLASSIC_CREAM,
        borderWidth: 8,
        borderColor: COLORS.NEAR_BLACK,
    },
    symbol: {
        fontSize: 60,
        color: COLORS.NEAR_BLACK,
        fontFamily: 'serif',
        marginBottom: 8,
        opacity: 0.2,
    },
    classicText: {
        fontSize: 20,
        fontFamily: 'serif',
        color: COLORS.NEAR_BLACK,
        textAlign: 'center',
        lineHeight: 28,
        fontStyle: 'italic',
    },
    divider: {
        width: 40,
        height: 1,
        backgroundColor: COLORS.NEAR_BLACK,
        marginVertical: 16,
    },
    classicAuthor: {
        fontSize: 12,
        fontFamily: FONTS.GOOGLE_SANS_BOLD,
        color: COLORS.NEAR_BLACK,
        letterSpacing: 2,
    },

    modernContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    glassCard: {
        backgroundColor: `${COLORS.WHITE}26`,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        borderWidth: 1,
        borderColor: `${COLORS.WHITE}33`,
        alignItems: 'center',
        marginBottom: 20,
    },
    modernText: {
        fontSize: 22,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        color: COLORS.WHITE,
        textAlign: 'center',
        lineHeight: 32,
        marginBottom: 16,
        textShadowColor: `${COLORS.BLACK}4D`,
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    modernAuthor: {
        fontSize: 14,
        fontFamily: FONTS.GOOGLE_SANS_BOLD,
        color: COLORS.WHITE,
        letterSpacing: 1,
    },

    boldContainer: {
        backgroundColor: COLORS.GOLD,
        alignItems: 'flex-start',
    },
    boldContentWrapper: {
        width: '100%',
        marginBottom: 20,
        zIndex: 5,
    },
    boldText: {
        fontSize: 28,
        fontFamily: FONTS.OSWALD_BOLD,
        color: COLORS.BLACK,
        textAlign: 'left',
        width: '100%',
        lineHeight: 34,
        marginBottom: 16,
    },
    boldAuthor: {
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_BOLD,
        color: COLORS.BLACK,
        alignSelf: 'flex-start',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.BLACK,
        paddingBottom: 2,
    },
    boldAccent: {
        position: 'absolute',
        top: 24,
        right: 24,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.BLACK,
        zIndex: 1,
    },

    imageContainer: {
        overflow: 'hidden',
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: `${COLORS.BLACK}66`,
    },
    imageContent: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    imageText: {
        fontSize: 24,
        fontFamily: FONTS.GOOGLE_SANS_BOLD,
        color: COLORS.WHITE,
        textAlign: 'center',
        lineHeight: 34,
        marginBottom: 20,
        textShadowColor: `${COLORS.BLACK}80`,
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    imageLine: {
        width: 60,
        height: 3,
        backgroundColor: COLORS.WHITE,
        marginBottom: 16,
        borderRadius: 2,
    },
    imageAuthor: {
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        color: COLORS.WHITE,
        letterSpacing: 1,
        textTransform: 'uppercase',
    }
});
