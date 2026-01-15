import { FONTS } from "@/constants/fonts";
import { StyleSheet } from "react-native";

export const CategoryScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 8,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    title: {
        fontSize: 24,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        textTransform: 'capitalize',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 16,
        marginHorizontal: 16,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
    },
    listContent: {
        paddingBottom: 20,
    },
    empty: {
        alignItems: 'center',
        marginTop: 50,
    }
});

export default CategoryScreenStyles;