import { Colors } from "@/constants/Colors";
import { ThemePreference, VisualStyle } from "./VisualStyles.types";

export type ThemeContextType = {
    visualStyle: VisualStyle;
    setVisualStyle: (style: VisualStyle) => void;
    accentColor: string;
    setAccentColor: (color: string) => void;
    themePreference: ThemePreference;
    setThemePreference: (pref: ThemePreference) => void;
    isDarkMode: boolean;
    theme: typeof Colors.light & { accentColor: string };
};