export const COLORS = {
    FERN_GREEN: '#4F7942',
    PALE_GREEN: '#A5D6A7',
    DARK_GREEN_BLACK: '#053105',
    LIGHT_GREEN_WHITE: '#E8F5E9',
    LIGHT_MINT: '#F2F8E9',
    CREAM: '#FDFDF5',
    CREAM_YELLOW: '#FFFDE7',
    MUTED_GREEN: '#8EA68E',
    LIGHT_HIGHLIGHT: '#DCECC7',
    SOFT_BLACK: '#121212',
    DARK_CARD: '#1C1C1E',
    DARK_HIGHLIGHT: '#2C2C2E',
    MUTED_DARK_GREEN: '#2E4C2E',
    MUTED_CARD_GREEN: '#3A633A',
    DARK_GRAY_BG: '#252525',

    SPRING_GREEN: '#8BC34A',
    AUTUMN_ORANGE: '#FF9800',
    SUNSET_RED: '#D32F2F',
    HEART_RED: '#E91E63',
    RED: '#FF0000',
    GOLD: '#FFD700',
    NAVY_BLUE: '#1a2a6c',
    BURNT_RED: '#b21f1f',
    YELLOW_ORANGE: '#fdbb2d',
    NEAR_BLACK: '#1a1a1a',
    CLASSIC_CREAM: '#FDFBF7',
    NOTIFICATION_LIGHT: '#FF231F7C',

    WHITE: '#FFFFFF',
    BLACK: '#000000',
    GRAY_LIGHT: '#E0E0E0',
    GRAY_LIGHTER: '#F5F5F5',
    GRAY_LIGHTEST: '#E5E5E5',
    GRAY_888: '#888888',
    GRAY_666: '#666666',
    GRAY_999: '#999999',
    GRAY_IOS: '#8E8E93',
    GRAY_MEDIUM: '#AAAAAA',
    GRAY_DARK: '#757575',
    TRANSPARENT: 'transparent',

    primary: '#4F7942',
    inputBackground: '#FFFFFF',
    text: '#053105',
    white: '#FFFFFF',
};

const tintColorLight = COLORS.FERN_GREEN;
const tintColorDark = COLORS.PALE_GREEN;

export const Colors = {
    light: {
        text: COLORS.DARK_GREEN_BLACK,
        background: COLORS.CREAM,
        tint: tintColorLight,
        icon: COLORS.FERN_GREEN,
        tabIconDefault: COLORS.MUTED_GREEN,
        tabIconSelected: tintColorLight,
        cardBackground: COLORS.WHITE,
        cardHighlight: COLORS.LIGHT_HIGHLIGHT,
        categoryChip: COLORS.LIGHT_MINT,
        categoryChipSelected: COLORS.LIGHT_HIGHLIGHT,
        quoteOfTheDayBackground: COLORS.LIGHT_HIGHLIGHT,
        cardGreen: COLORS.FERN_GREEN,
        pillSelected: COLORS.WHITE,
        pillTextSelected: COLORS.BLACK,
        pillUnselected: COLORS.GRAY_LIGHT,
        pillTextUnselected: COLORS.GRAY_DARK,
    },
    dark: {
        text: COLORS.LIGHT_GREEN_WHITE,
        background: COLORS.SOFT_BLACK,
        tint: tintColorDark,
        icon: COLORS.PALE_GREEN,
        tabIconDefault: COLORS.FERN_GREEN,
        tabIconSelected: tintColorDark,
        cardBackground: COLORS.DARK_CARD,
        cardHighlight: COLORS.DARK_HIGHLIGHT,
        categoryChip: COLORS.DARK_HIGHLIGHT,
        categoryChipSelected: COLORS.FERN_GREEN,
        quoteOfTheDayBackground: COLORS.MUTED_DARK_GREEN,
        cardGreen: COLORS.MUTED_CARD_GREEN,
        pillSelected: COLORS.WHITE,
        pillTextSelected: COLORS.BLACK,
        pillUnselected: COLORS.DARK_HIGHLIGHT,
        pillTextUnselected: COLORS.GRAY_MEDIUM,
    },
};

export const AccentColors = {
    Nature: COLORS.FERN_GREEN,
    Spring: COLORS.SPRING_GREEN,
    Autumn: COLORS.AUTUMN_ORANGE,
    Sunset: COLORS.SUNSET_RED,
};

export const THEME_PALETTES: Record<string, string[]> = {
    Nature: [
        '#A5D6A7', '#BCAAA4', '#DCEDC8', '#D7CCC8', '#DCE775',
        '#80CBC4', '#81C784', '#AED581', '#4DB6AC', '#FFCCBC'
    ],
    Spring: [
        '#F48FB1', '#81D4FA', '#FFF59D', '#A5D6A7', '#CE93D8',
        '#FFAB91', '#80CBC4', '#90CAF9', '#EF9A9A', '#FFCC80'
    ],
    Autumn: [
        '#FFAB91', '#D7CCC8', '#FFE082', '#FF8A65', '#FFD54F',
        '#FFF176', '#FFB74D', '#FFCCBC', '#FFE0B2', '#FFD180'
    ],
    Sunset: [
        '#F48FB1', '#CE93D8', '#FFAB91', '#B39DDB', '#F8BBD0',
        '#FF80AB', '#9FA8DA', '#F06292', '#E1BEE7', '#FF8A80'
    ]
};

export const BACKGROUND_TINTS = {
    Nature: { light: '#FAFCFA', dark: '#101210' },
    Spring: { light: '#FCFDF9', dark: '#101210' },
    Autumn: { light: '#FDFBF7', dark: '#121110' },
    Sunset: { light: '#FCF8F8', dark: '#121010' },
};

export const CARD_TINTS = {
    Nature: { light: '#F2F6F2', dark: '#1C201C' },
    Spring: { light: '#F5F8F2', dark: '#1D201C' },
    Autumn: { light: '#F8F6F2', dark: '#201E1C' },
    Sunset: { light: '#F8F4F5', dark: '#201C1D' },
};
