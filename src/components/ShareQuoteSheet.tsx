import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/fonts';
import { Quote } from '@/types/Quote.types';
import { Download, Minus, Plus, Share2, Type } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { useTheme } from '../context/ThemeContext';
import ShareService from '../services/ShareService';
import AnimatedBottomSheetModal from './AnimatedBottomSheetModal';
import { BoldTemplate, ClassicTemplate, ImageTemplate, ModernTemplate } from './QuoteCardTemplates/CardTemplate';

interface ShareQuoteSheetProps {
    isVisible: boolean;
    onClose: () => void;
    quote: Quote | null;
}

type TemplateType = 'Classic' | 'Modern' | 'Bold' | 'Image';

export default function ShareQuoteSheet({ isVisible, onClose, quote }: ShareQuoteSheetProps) {
    const { theme } = useTheme();
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('Modern');
    const [fontSizeScale, setFontSizeScale] = useState(1);
    const viewShotRef = useRef<ViewShot>(null);

    if (!quote) return null;

    const renderTemplate = () => {
        switch (selectedTemplate) {
            case 'Classic': return <ClassicTemplate quote={quote} fontSizeScale={fontSizeScale} />;
            case 'Modern': return <ModernTemplate quote={quote} fontSizeScale={fontSizeScale} />;
            case 'Bold': return <BoldTemplate quote={quote} fontSizeScale={fontSizeScale} />;
            case 'Image': return <ImageTemplate quote={quote} fontSizeScale={fontSizeScale} />;
            default: return <ModernTemplate quote={quote} fontSizeScale={fontSizeScale} />;
        }
    };

    const handleShareText = async () => {
        await ShareService.shareText(quote);
        onClose();
    };

    const handleSaveImage = async () => {
        if (viewShotRef.current?.capture) {
            try {
                const uri = await viewShotRef.current.capture();
                await ShareService.saveImage(uri);
                onClose();
            } catch (error) {
                console.error("Capture failed", error);
            }
        }
    };

    const handleShareImage = async () => {
        if (viewShotRef.current?.capture) {
            try {
                const uri = await viewShotRef.current.capture();
                await ShareService.shareImage(uri);
                onClose();
            } catch (error) {
                console.error("Capture failed", error);
            }
        }
    };

    return (
        <AnimatedBottomSheetModal isVisible={isVisible} onClose={onClose}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.text }]}>Share Quote</Text>
                <View style={styles.previewContainer}>
                    <ViewShot
                        ref={viewShotRef}
                        options={{ format: 'png', quality: 1.0 }}
                        style={styles.viewShotWrapper}
                    >
                        {renderTemplate()}
                    </ViewShot>
                </View>
                <Text style={[styles.sectionLabel, { color: theme.text }]}>Choose Style</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateSelector}>
                    {(['Classic', 'Modern', 'Bold', 'Image'] as TemplateType[]).map((template) => (
                        <TouchableOpacity
                            key={template}
                            style={[
                                styles.templateOption,
                                selectedTemplate === template && [styles.templateOptionActive, { borderColor: theme.tint }]
                            ]}
                            onPress={() => setSelectedTemplate(template)}
                        >
                            <Text style={[
                                styles.templateText,
                                { color: theme.text },
                                selectedTemplate === template && { color: theme.tint, fontFamily: FONTS.GOOGLE_SANS_BOLD }
                            ]}>
                                {template}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <Text style={[styles.sectionLabel, { color: theme.text }]}>Text Size</Text>
                <View style={styles.sizeControlContainer}>
                    <TouchableOpacity
                        onPress={() => setFontSizeScale(prev => Math.max(0.7, prev - 0.1))}
                        style={[styles.sizeButton, { backgroundColor: theme.cardBackground, borderColor: 'rgba(150,150,150,0.2)' }]}
                    >
                        <Minus size={20} color={theme.text} />
                    </TouchableOpacity>

                    <Text style={[styles.sizeValue, { color: theme.text }]}>
                        {Math.round(fontSizeScale * 100)}%
                    </Text>

                    <TouchableOpacity
                        onPress={() => setFontSizeScale(prev => Math.min(1.5, prev + 0.1))}
                        style={[styles.sizeButton, { backgroundColor: theme.cardBackground, borderColor: 'rgba(150,150,150,0.2)' }]}
                    >
                        <Plus size={20} color={theme.text} />
                    </TouchableOpacity>
                </View>
                <View style={styles.actionsGrid}>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.cardBackground, borderColor: theme.tint }]} onPress={handleShareText}>
                        <Type size={20} color={theme.text} />
                        <Text style={[styles.actionLabel, { color: theme.text }]}>Share Text</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.cardBackground, borderColor: theme.tint }]} onPress={handleSaveImage}>
                        <Download size={20} color={theme.text} />
                        <Text style={[styles.actionLabel, { color: theme.text }]}>Save Image</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.tint, borderColor: theme.tint }]} onPress={handleShareImage}>
                        <Share2 size={20} color={COLORS.WHITE} />
                        <Text style={[styles.actionLabel, { color: COLORS.WHITE }]}>Share Image</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AnimatedBottomSheetModal>
    );
}

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontFamily: FONTS.GOOGLE_SANS_BOLD,
        marginBottom: 20,
    },
    previewContainer: {
        marginBottom: 24,
        shadowColor: COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    viewShotWrapper: {
        overflow: 'hidden',
        borderRadius: 12,
    },
    sectionLabel: {
        fontSize: 14,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        marginBottom: 12,
        alignSelf: 'flex-start',
        marginLeft: 4,
        opacity: 0.7,
    },
    templateSelector: {
        flexDirection: 'row',
        marginBottom: 30,
        width: '100%',
    },
    templateOption: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(150,150,150,0.2)',
        marginRight: 10,
    },
    templateOptionActive: {
        borderWidth: 2,
        backgroundColor: 'rgba(150,150,150,0.05)',
    },
    templateText: {
        fontSize: 14,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    actionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 8,
    },
    actionLabel: {
        fontSize: 12,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    sizeControlContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 20,
    },
    sizeButton: {
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    sizeValue: {
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_BOLD,
        minWidth: 50,
        textAlign: 'center',
    }
});
