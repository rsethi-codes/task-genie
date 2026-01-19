import type { Appearance } from "@clerk/types";
import { dark } from "@clerk/themes";

export const clerkAppearance: Appearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#0EA5E9",
    colorBackground: "#020617",
    colorText: "#F8FAFC",
    colorInputBackground: "#0F172A",
    colorInputText: "#F8FAFC",
    borderRadius: "1rem",
    fontFamily: "var(--font-inter)",
  },
  elements: {
    card: {
      backgroundColor: "#0F172A",
      border: "1px solid #1E293B",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    },
    formButtonPrimary: {
      backgroundImage: "linear-gradient(135deg, #0EA5E9, #D946EF)",
      border: "none",
      transition: "all 0.2s ease",
      "&:hover": {
        opacity: "0.9",
        transform: "translateY(-1px)",
      },
      "&:active": {
        transform: "translateY(0px)",
      },
    },
    headerTitle: {
      fontFamily: "var(--font-display)",
      letterSpacing: "-0.02em",
    },
    socialButtonsBlockButton: {
      backgroundColor: "#1E293B",
      border: "1px solid #334155",
      "&:hover": {
        backgroundColor: "#334155",
      },
    },
  },
};