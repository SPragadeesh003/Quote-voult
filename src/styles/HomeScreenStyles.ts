import { FONTS } from "@/constants/fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerTop: {
        paddingHorizontal: 16,
        paddingTop: 20
    },
    headerGreatings: {
        fontSize: 18,
        fontFamily: FONTS.GOOGLE_SANS_BOLD,
    },
    headerTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    pageTitle: {
        fontSize: 32,
        fontFamily: FONTS.GOOGLE_SANS_BOLD,
    },
});

export default styles;
