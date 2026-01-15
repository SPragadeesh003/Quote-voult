import { FONTS } from "@/constants/fonts";
import { StyleSheet } from "react-native";

export const CollectionDetailsScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 24,
        gap: 16,
    },
    headerRight: {
        flex: 1,
        alignItems: 'flex-end',
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: FONTS.GOOGLE_SANS_SEMI_BOLD,
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
    },
});

export default CollectionDetailsScreenStyles;