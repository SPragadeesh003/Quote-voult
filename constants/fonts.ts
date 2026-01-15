export const FONTS = {
    THIN: "Outfit-Thin",
    EXTRA_LIGHT: "Outfit-ExtraLight",
    LIGHT: "Outfit-Light",
    REGULAR: "Outfit-Regular",
    MEDIUM: "Outfit-Medium",
    SEMI_BOLD: "Outfit-SemiBold",
    BOLD: "Outfit-Bold",
    EXTRA_BOLD: "Outfit-ExtraBold",
    BLACK: "Outfit-Black",
 
    OSWALD_EXTRA_LIGHT: "Oswald-ExtraLight",
    OSWALD_LIGHT: "Oswald-Light",
    OSWALD_REGULAR: "Oswald-Regular",
    OSWALD_MEDIUM: "Oswald-Medium",
    OSWALD_SEMI_BOLD: "Oswald-SemiBold",
    OSWALD_BOLD: "Oswald-Bold",

    GOOGLE_SANS_FLEX: "GoogleSansFlex-Variable",
    GOOGLE_SANS_THIN: "GoogleSansFlex-Thin",
    GOOGLE_SANS_EXTRA_LIGHT: "GoogleSansFlex-ExtraLight",
    GOOGLE_SANS_LIGHT: "GoogleSansFlex-Light",
    GOOGLE_SANS_REGULAR: "GoogleSansFlex-Regular",
    GOOGLE_SANS_MEDIUM: "GoogleSansFlex-Medium",
    GOOGLE_SANS_SEMI_BOLD: "GoogleSansFlex-SemiBold",
    GOOGLE_SANS_BOLD: "GoogleSansFlex-Bold",
    GOOGLE_SANS_EXTRA_BOLD: "GoogleSansFlex-ExtraBold",
    GOOGLE_SANS_BLACK: "GoogleSansFlex-Black",

    HANDWRITING: "SueEllenFrancisco-Regular",
} as const;

export const FONT_FILES = {
 
    [FONTS.THIN]: require("../assets/fonts/Outfit/static/Outfit-Thin.ttf"),
    [FONTS.EXTRA_LIGHT]: require("../assets/fonts/Outfit/static/Outfit-ExtraLight.ttf"),
    [FONTS.LIGHT]: require("../assets/fonts/Outfit/static/Outfit-Light.ttf"),
    [FONTS.REGULAR]: require("../assets/fonts/Outfit/static/Outfit-Regular.ttf"),
    [FONTS.MEDIUM]: require("../assets/fonts/Outfit/static/Outfit-Medium.ttf"),
    [FONTS.SEMI_BOLD]: require("../assets/fonts/Outfit/static/Outfit-SemiBold.ttf"),
    [FONTS.BOLD]: require("../assets/fonts/Outfit/static/Outfit-Bold.ttf"),
    [FONTS.EXTRA_BOLD]: require("../assets/fonts/Outfit/static/Outfit-ExtraBold.ttf"),
    [FONTS.BLACK]: require("../assets/fonts/Outfit/static/Outfit-Black.ttf"),

    [FONTS.OSWALD_EXTRA_LIGHT]: require("../assets/fonts/Oswald/static/Oswald-ExtraLight.ttf"),
    [FONTS.OSWALD_LIGHT]: require("../assets/fonts/Oswald/static/Oswald-Light.ttf"),
    [FONTS.OSWALD_REGULAR]: require("../assets/fonts/Oswald/static/Oswald-Regular.ttf"),
    [FONTS.OSWALD_MEDIUM]: require("../assets/fonts/Oswald/static/Oswald-Medium.ttf"),
    [FONTS.OSWALD_SEMI_BOLD]: require("../assets/fonts/Oswald/static/Oswald-SemiBold.ttf"),
    [FONTS.OSWALD_BOLD]: require("../assets/fonts/Oswald/static/Oswald-Bold.ttf"),

    [FONTS.GOOGLE_SANS_FLEX]: require("../assets/fonts/Google_Sans_Flex/GoogleSansFlex-VariableFont_GRAD,ROND,opsz,slnt,wdth,wght.ttf"),

    [FONTS.GOOGLE_SANS_THIN]: require("../assets/fonts/Google_Sans_Flex/static/GoogleSansFlex_36pt-Thin.ttf"),
    [FONTS.GOOGLE_SANS_EXTRA_LIGHT]: require("../assets/fonts/Google_Sans_Flex/static/GoogleSansFlex_36pt-ExtraLight.ttf"),
    [FONTS.GOOGLE_SANS_LIGHT]: require("../assets/fonts/Google_Sans_Flex/static/GoogleSansFlex_36pt-Light.ttf"),
    [FONTS.GOOGLE_SANS_REGULAR]: require("../assets/fonts/Google_Sans_Flex/static/GoogleSansFlex_36pt-Regular.ttf"),
    [FONTS.GOOGLE_SANS_MEDIUM]: require("../assets/fonts/Google_Sans_Flex/static/GoogleSansFlex_36pt-Medium.ttf"),
    [FONTS.GOOGLE_SANS_SEMI_BOLD]: require("../assets/fonts/Google_Sans_Flex/static/GoogleSansFlex_36pt-SemiBold.ttf"),
    [FONTS.GOOGLE_SANS_BOLD]: require("../assets/fonts/Google_Sans_Flex/static/GoogleSansFlex_36pt-Bold.ttf"),
    [FONTS.GOOGLE_SANS_EXTRA_BOLD]: require("../assets/fonts/Google_Sans_Flex/static/GoogleSansFlex_36pt-ExtraBold.ttf"),
    [FONTS.GOOGLE_SANS_BLACK]: require("../assets/fonts/Google_Sans_Flex/static/GoogleSansFlex_36pt-Black.ttf"),

    [FONTS.HANDWRITING]: require("../assets/fonts/Sue_Ellen_Francisco/SueEllenFrancisco-Regular.ttf"),
} as const;