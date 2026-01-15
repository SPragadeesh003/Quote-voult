import { COLORS } from "@/constants/Colors";
import { FONTS } from "@/constants/fonts";
import { StyleSheet } from "react-native";

export const ProfileScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: COLORS.LIGHT_GREEN_WHITE,
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.WHITE,
    },
    name: {
        fontSize: 24,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: COLORS.GRAY_DARK,
        marginBottom: 8,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    memberSince: {
        fontSize: 10,
        color: COLORS.GRAY_MEDIUM,
        letterSpacing: 1,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 5,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontFamily: FONTS.GOOGLE_SANS_BOLD,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.GRAY_DARK,
        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
    },
    sectionHeaderContainer: {
        marginBottom: 16,
        marginLeft: 4,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: FONTS.GOOGLE_SANS_SEMI_BOLD,
        textTransform: 'uppercase',
    },
    sectionCard: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
    },
    appearanceItem: {
        marginBottom: 20,
    },
    preferenceLabel: {
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_SEMI_BOLD,
        marginBottom: 12,
    },
    segmentedControlFull: {
        flexDirection: 'row',
        borderRadius: 24,
        padding: 4,
        height: 48,
        width: '100%',
    },
    segmentOptionFull: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 26,
    },
    segmentActiveFull: {
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 1,
    },
    segmentTextFull: {
        fontSize: 14,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    segmentActiveTextFull: {
        color: COLORS.WHITE,
        fontFamily: FONTS.GOOGLE_SANS_SEMI_BOLD,
    },
    colorSwatchesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    colorSwatch: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorSwatchActive: {
        borderColor: COLORS.SOFT_BLACK,
        borderWidth: 5,
    },
    rowSeparator: {
        height: 1,
        backgroundColor: COLORS.GRAY_LIGHT,
        marginVertical: 12,
    },
    iconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    menuText: {
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_SEMI_BOLD,
    },
    signOutButton: {
        backgroundColor: COLORS.GRAY_LIGHT,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 20,
    },
    signOutText: {
        color: COLORS.SUNSET_RED,
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_SEMI_BOLD,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: COLORS.GRAY_MEDIUM,
        marginBottom: 20,
    },
    noShadow: {
        shadowColor: 'transparent',
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        borderWidth: 1,
        borderColor: 'rgba(150, 150, 150, 0.1)',
        borderRadius: 24,
    },
    avatarFallback: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarFallbackText: {
        color: '#FFF',
        fontSize: 40,
        fontWeight: 'bold',
    },
});

export default ProfileScreenStyles;