import type { Appearance } from "@clerk/types";

// Define theme colors that match your CSS variables
const clerkTheme = {
  colors: {
    light: {
      primary: "#007AFF",
      primaryHover: "#005FCC",
      background: "#F9FAFB",
      surface: "#FFFFFF",
      text: "#111827",
      textMuted: "#6B7280",
      border: "#E5E7EB",
      inputBg: "#FFFFFF",
      inputBorder: "#D1D5DB",
    },
    dark: {
      primary: "#0A84FF",
      primaryHover: "#007AFF",
      background: "#000000",
      surface: "#1C1C1E",
      text: "#FFFFFF",
      textMuted: "#98989D",
      border: "#3A3A3C",
      inputBg: "#1C1C1E",
      inputBorder: "#48484A",
    },
  },
  fonts: {
    main: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', sans-serif",
  },
  radii: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
  },
  shadows: {
    soft: "0 8px 24px rgba(0,0,0,0.05)",
  },
};

// Helper function to get appearance based on theme
export const getClerkAppearance = (isDark: boolean = false): Appearance => {
  const colors = isDark ? clerkTheme.colors.dark : clerkTheme.colors.light;

  return {
    layout: {
      socialButtonsVariant: "iconButton",
      logoPlacement: "none",
      showOptionalFields: false,
    },
    variables: {
      colorPrimary: colors.primary,
      colorBackground: colors.background,
      colorText: colors.text,
      colorInputBackground: colors.inputBg,
      colorInputText: colors.text,
      borderRadius: clerkTheme.radii.md,
      fontFamily: clerkTheme.fonts.main,
    },
    elements: {
      card: {
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: clerkTheme.shadows.soft,
      },
      formFieldInput: {
        backgroundColor: colors.inputBg,
        border: `1px solid ${colors.inputBorder}`,
        color: colors.text,
        borderRadius: clerkTheme.radii.md,
        transition: "border 0.2s ease, box-shadow 0.2s ease",
      },
      formFieldInput__focus: {
        borderColor: colors.primary,
        boxShadow: `0 0 0 3px ${isDark ? 'rgba(10,132,255,0.15)' : 'rgba(0,122,255,0.15)'}`,
      },
      formButtonPrimary: {
        backgroundColor: colors.primary,
        color: "#fff",
        fontWeight: "600",
        borderRadius: clerkTheme.radii.md,
        transition: "all 0.3s ease",
      },
      formButtonPrimary__hover: {
        backgroundColor: colors.primaryHover,
      },
      footerActionLink: {
        color: colors.primary,
      },
      socialButtonsBlockButton: {
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      },
      socialButtonsBlockButton__hover: {
        backgroundColor: colors.inputBg,
      },
      dividerLine: {
        backgroundColor: colors.border,
      },
      dividerText: {
        color: colors.textMuted,
      },
      formHeaderTitle: {
        color: colors.text,
      },
      formHeaderSubtitle: {
        color: colors.textMuted,
      },
      identityPreviewText: {
        color: colors.text,
      },
      identityPreviewEditButton: {
        color: colors.primary,
      },
    },
  };
};

// Export default light theme appearance
export const clerkAppearance = getClerkAppearance(false);


// * the below code is a modified version of the above code to take the colors from the globals.css file using the getCSSVariable helper function
// import type { Appearance } from "@clerk/types";

// // Helper to get CSS variable value
// const getCSSVariable = (varName: string): string => {
//   if (typeof window === "undefined") {
//     // Fallback for server-side rendering
//     return "#000000";
//   }

//   const element = document.documentElement;
//   const styles = getComputedStyle(element);
//   const value = styles.getPropertyValue(varName).trim();
  
//   if (!value) {
//     console.warn(`CSS variable ${varName} not found in globals.css`);
//     return "#000000";
//   }
  
//   return value;
// };

// // Helper function to get appearance based on theme
// export const getClerkAppearance = (isDark: boolean = false): Appearance => {
//   // Dynamically read all colors from globals.css CSS variables
//   const colors = {
//     primary: getCSSVariable("--color-primary"),
//     primaryHover: getCSSVariable("--color-primary-hover"),
//     background: getCSSVariable("--color-background"),
//     surface: getCSSVariable("--color-surface"),
//     surfaceHover: getCSSVariable("--color-surface-hover"),
//     text: getCSSVariable("--color-text-primary"),
//     textMuted: getCSSVariable("--color-text-secondary"),
//     border: getCSSVariable("--color-border"),
//   };

//   return {
//     layout: {
//       socialButtonsVariant: "iconButton",
//       logoPlacement: "none",
//       showOptionalFields: false,
//     },
//     variables: {
//       colorPrimary: colors.primary,
//       colorBackground: colors.background,
//       colorText: colors.text,
//       colorInputBackground: colors.surface,
//       colorInputText: colors.text,
//       borderRadius: "0.75rem",
//       fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', sans-serif",
//     },
//     elements: {
//       card: {
//         backgroundColor: colors.surface,
//         border: `1px solid ${colors.border}`,
//         boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
//       },
//       formFieldInput: {
//         backgroundColor: colors.surface,
//         border: `1px solid ${colors.border}`,
//         color: colors.text,
//         borderRadius: "0.75rem",
//         transition: "border 0.2s ease, box-shadow 0.2s ease",
//       },
//       formFieldInput__focus: {
//         borderColor: colors.primary,
//         boxShadow: `0 0 0 3px ${isDark ? 'rgba(10,132,255,0.15)' : 'rgba(0,122,255,0.15)'}`,
//       },
//       formButtonPrimary: {
//         backgroundColor: colors.primary,
//         color: "#fff",
//         fontWeight: "600",
//         borderRadius: "0.75rem",
//         transition: "all 0.3s ease",
//       },
//       formButtonPrimary__hover: {
//         backgroundColor: colors.primaryHover,
//       },
//       footerActionLink: {
//         color: colors.primary,
//       },
//       socialButtonsBlockButton: {
//         backgroundColor: colors.surface,
//         border: `1px solid ${colors.border}`,
//         color: colors.text,
//       },
//       socialButtonsBlockButton__hover: {
//         backgroundColor: colors.surfaceHover,
//       },
//       dividerLine: {
//         backgroundColor: colors.border,
//       },
//       dividerText: {
//         color: colors.textMuted,
//       },
//       formHeaderTitle: {
//         color: colors.text,
//       },
//       formHeaderSubtitle: {
//         color: colors.textMuted,
//       },
//       identityPreviewText: {
//         color: colors.text,
//       },
//       identityPreviewEditButton: {
//         color: colors.primary,
//       },
//     },
//   };
// };

// // Export default light theme appearance
// export const clerkAppearance = getClerkAppearance(false);