/**
 * Design Tokens
 * Centralized design system tokens for consistent spacing, typography, colors, and elevation
 */

// Typography Scale
export const typography = {
  fontFamily: {
    sans: "var(--font-inter)",
    display: "var(--font-display)",
    mono: "var(--font-mono)",
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
    "7xl": "4.5rem", // 72px
    "8xl": "6rem", // 96px
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    black: "900",
  },
  lineHeight: {
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
} as const;

// Spacing Scale (based on 4px base unit)
export const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
  40: "10rem", // 160px
} as const;

// Elevation/Shadow System
export const elevation = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  glow: "0 0 20px var(--ai-glow)",
} as const;

// Animation Durations
export const animation = {
  fast: "150ms",
  normal: "300ms",
  slow: "500ms",
  slower: "750ms",
  slowest: "1000ms",
} as const;

// Animation Easing Functions
export const easing = {
  linear: "linear",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.25, 0.1, 0.25, 1)",
} as const;

// Priority Colors (Fixed - High = Warning/Amber, Low = Info/Blue)
export const priorityColors = {
  high: {
    bg: "bg-warning",
    text: "text-warning",
    border: "border-warning",
    light: "bg-warning/10",
    borderLight: "border-warning/20",
  },
  medium: {
    bg: "bg-warning",
    text: "text-warning",
    border: "border-warning",
    light: "bg-warning/10",
    borderLight: "border-warning/20",
  },
  low: {
    bg: "bg-info",
    text: "text-info",
    border: "border-info",
    light: "bg-info/10",
    borderLight: "border-info/20",
  },
} as const;

// Status Colors
export const statusColors = {
  todo: {
    bg: "bg-surface",
    text: "text-text-secondary",
    border: "border-border",
  },
  "in-progress": {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
  },
  done: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
  },
  cancelled: {
    bg: "bg-error/10",
    text: "text-error",
    border: "border-error/20",
  },
} as const;
