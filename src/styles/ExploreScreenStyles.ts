import { FONTS } from "@/constants/fonts";
import { StyleSheet } from "react-native";

export const ExploreScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        marginBottom: 24,
        marginTop: 24,
    },
    title: {
        fontSize: 30,
        fontFamily: FONTS.GOOGLE_SANS_BOLD,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    activeFilterChip: {
        borderWidth: 0,
    },
    filterText: {
        fontSize: 14,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    activeFilterText: {
        color: '#FFF',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_REGULAR
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONTS.GOOGLE_SANS_SEMI_BOLD,
    },
    scrollContent: {
        paddingBottom: 0,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 8,
    },
    cardWrapper: {
        width: '48%',
        marginBottom: 8,
    },
    cardInner: {
        width: '100%',
        minHeight: 140,
        borderRadius: 28,
        padding: 16,
        alignItems: "flex-start",
        justifyContent: 'space-between',
        borderWidth: 1,
        gap: 8,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTextContainer: {
        alignItems: 'flex-start',
        width: '100%',
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: FONTS.GOOGLE_SANS_SEMI_BOLD,
        marginBottom: 4,
        textAlign: 'left',
    },
    cardCount: {
        fontSize: 12,
        textAlign: 'left',
        fontFamily: FONTS.GOOGLE_SANS_REGULAR
    },
});

export default ExploreScreenStyles;