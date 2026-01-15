import { COLORS } from "@/constants/Colors";
import { FONTS } from "@/constants/fonts";
import { StyleSheet } from "react-native";

export const SavedScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    title: {
        fontSize: 28,
        fontFamily: FONTS.GOOGLE_SANS_SEMI_BOLD,
    },
    cancelText: {
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 24,
        borderRadius: 25,
        padding: 4,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 22,
    },
    activeTab: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        fontSize: 14,
    },
    content: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 100,
    },
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
        bottom: -20,
        right: -20,
        opacity: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
    },
    collectionCard: {
        flex: 1,
        margin: 6,
        padding: 16,
        borderRadius: 20,
        gap: 24,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    collectionIconPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 'auto',
    },
    collectionInitial: {
        color: COLORS.WHITE,
        fontSize: 20,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    collectionName: {
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        marginBottom: 4,
    },
    collectionCount: {
        fontSize: 12,
    },
    createCollectionCard: {
        height: 80,
        margin: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        flexDirection: 'row',
        gap: 10,
    },
    createCollectionText: {
        fontWeight: '600',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
    },
    nextButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    modalContent: {
        gap: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    input: {
        padding: 16,
        borderRadius: 16,
        fontSize: 16,
    },
    createButton: {
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    createButtonText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default SavedScreenStyles;