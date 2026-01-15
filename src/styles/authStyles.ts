import { Dimensions, StyleSheet } from 'react-native';

import { COLORS } from '@/constants/Colors';
import { FONTS } from '@/constants/fonts';

const { width, height } = Dimensions.get('window');

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.CREAM,
        paddingHorizontal: 24,
    },
    gradientBackground: {
        flex: 1,
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    globalContainer: {
        flex: 1,
        backgroundColor: COLORS.CREAM,
    },
    headerIconContainer: {
        width: 100,
        height: 100,
        backgroundColor: COLORS.WHITE,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 32,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        color: COLORS.DARK_GREEN_BLACK,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.DARK_GREEN_BLACK,
        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
        opacity: 0.7,
        marginBottom: 40,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBackground,
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 16,
        width: '100%',
    },
    input: {
        flex: 1,
        height: '100%',
        marginLeft: 12,
        color: COLORS.DARK_GREEN_BLACK,
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
    },
    primaryButton: {
        backgroundColor: COLORS.FERN_GREEN,
        borderRadius: 25, // Rounded corners as per screenshot
        height: 56,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderRadius: 25,
        height: 56,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        borderWidth: 1,
        borderColor: COLORS.DARK_GREEN_BLACK,
        opacity: 0.8,
    },
    buttonText: {
        color: COLORS.WHITE,
        fontSize: 18,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    secondaryButtonText: {
        color: COLORS.DARK_GREEN_BLACK,
        fontSize: 18,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    linkText: {
        color: COLORS.DARK_GREEN_BLACK,
        fontSize: 14,
        marginTop: 16,
        textAlign: 'center',
        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
    },
    linkTextBold: {
        color: COLORS.FERN_GREEN,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    backButton: {
        position: 'absolute',
        top: 60, // Adjust based on safe area
        left: 24,
        zIndex: 10,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: COLORS.DARK_GREEN_BLACK,
        opacity: 0.7,
        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
    },
    showComponentText: {
        marginTop: 20,
        color: COLORS.DARK_GREEN_BLACK,
        fontSize: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    successIconContainer: {
        width: 120,
        height: 120,
        backgroundColor: COLORS.LIGHT_MINT,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        alignSelf: 'center'
    },
    screenHeader: {
        marginTop: 100,
        marginBottom: 30,
    },
    screenTitle: {
        fontSize: 28,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        color: COLORS.DARK_GREEN_BLACK,
        marginBottom: 8,
    },
    screenSubtitle: {
        fontSize: 16,
        color: COLORS.DARK_GREEN_BLACK,
        opacity: 0.8,
        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
    },
});
