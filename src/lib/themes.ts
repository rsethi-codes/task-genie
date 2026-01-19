export interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  border: string;

  success: string;
  warning: string;
  error: string;
  info: string;

  aiGradientStart: string;
  aiGradientEnd: string;
  aiGlow: string;

  glassOpacity: number;
  glassBlur: number;

  animationSpeed: "slow" | "normal" | "fast";
  reduceMotion: boolean;
}

export const themes: Record<string, ThemeConfig> = {
  cyberpunk: {
    name: "Cyberpunk",
    primary: "#0EA5E9", // Sky 500
    secondary: "#D946EF", // Fuchsia 500
    background: "#020617", // Slate 950
    surface: "#0F172A", // Slate 900
    surfaceHover: "#1E293B", // Slate 800
    text: "#F8FAFC", // Slate 50
    textSecondary: "#94A3B8", // Slate 400
    border: "#1E293B", // Slate 800

    success: "#10B981", // Emerald 500
    warning: "#F59E0B", // Amber 500
    error: "#EF4444", // Red 500
    info: "#3B82F6", // Blue 500

    aiGradientStart: "#0EA5E9",
    aiGradientEnd: "#D946EF",
    aiGlow: "rgba(14, 165, 233, 0.3)",

    glassOpacity: 0.1,
    glassBlur: 12,

    animationSpeed: "normal",
    reduceMotion: false,
  },
  forest: {
    name: "Forest",
    primary: "#10B981", // Emerald 500
    secondary: "#84CC16", // Lime 500
    background: "#064E3B", // Emerald 950
    surface: "#065F46", // Emerald 900
    surfaceHover: "#047857", // Emerald 800
    text: "#ECFDF5", // Emerald 50
    textSecondary: "#A7F3D0", // Emerald 200
    border: "#065F46",

    success: "#34D399",
    warning: "#FBBF24",
    error: "#F87171",
    info: "#60A5FA",

    aiGradientStart: "#10B981",
    aiGradientEnd: "#84CC16",
    aiGlow: "rgba(16, 185, 129, 0.3)",

    glassOpacity: 0.1,
    glassBlur: 16,

    animationSpeed: "slow",
    reduceMotion: false,
  },
  sunset: {
    name: "Sunset",
    primary: "#F97316", // Orange 500
    secondary: "#EC4899", // Pink 500
    background: "#450A0A", // Red 950
    surface: "#7F1D1D", // Red 900
    surfaceHover: "#991B1B", // Red 800
    text: "#FEF2F2", // Red 50
    textSecondary: "#FECACA", // Red 200
    border: "#7F1D1D",

    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",

    aiGradientStart: "#F97316",
    aiGradientEnd: "#EC4899",
    aiGlow: "rgba(249, 115, 22, 0.3)",

    glassOpacity: 0.15,
    glassBlur: 10,

    animationSpeed: "normal",
    reduceMotion: false,
  },
  midnight: {
    name: "Midnight",
    primary: "#6366F1", // Indigo 500
    secondary: "#4338CA", // Indigo 700
    background: "#030712", // Gray 950
    surface: "#111827", // Gray 900
    surfaceHover: "#1F2937", // Gray 800
    text: "#F9FAFB", // Gray 50
    textSecondary: "#9CA3AF", // Gray 400
    border: "#1F2937",

    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",

    aiGradientStart: "#6366F1",
    aiGradientEnd: "#A855F7",
    aiGlow: "rgba(99, 102, 241, 0.3)",

    glassOpacity: 0.1,
    glassBlur: 20,

    animationSpeed: "slow",
    reduceMotion: false,
  },
  monochrome: {
    name: "Monochrome",
    primary: "#FFFFFF",
    secondary: "#71717A",
    background: "#000000",
    surface: "#18181B",
    surfaceHover: "#27272A",
    text: "#FFFFFF",
    textSecondary: "#A1A1AA",
    border: "#27272A",

    success: "#FFFFFF",
    warning: "#FFFFFF",
    error: "#FFFFFF",
    info: "#FFFFFF",

    aiGradientStart: "#FFFFFF",
    aiGradientEnd: "#71717A",
    aiGlow: "rgba(255, 255, 255, 0.2)",

    glassOpacity: 0.05,
    glassBlur: 25,

    animationSpeed: "fast",
    reduceMotion: false,
  },
};
