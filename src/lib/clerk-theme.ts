// import type { Appearance } from "@clerk/types";

// export const clerkAppearance: Appearance = {
//   layout: {
//     socialButtonsVariant: "iconButton",
//     logoPlacement: "none",
//     showOptionalFields: false,
//     helpPageUrl: "mailto:support@aitodo.app",
//   },
//   variables: {
//     colorPrimary: "#E8A476", // same as your accent
//     colorBackground: "#151515",
//     colorText: "#F7ECE5",
//     colorInputBackground: "#1F1F1F",
//     colorInputText: "#F7ECE5",
//     borderRadius: "1rem",
//     fontFamily: "'Inter', sans-serif",
//   },
//   elements: {
//     card: {
//       boxShadow: "0 0 20px rgba(232,164,118,0.3)",
//       backdropFilter: "blur(10px)",
//       background:
//         "linear-gradient(135deg, rgba(21,21,21,0.9), rgba(47,47,47,0.7))",
//       border: "1px solid rgba(232,164,118,0.2)",
//       animation: "fadeIn 0.6s ease-in-out",
//     },
//     headerTitle: {
//       fontSize: "1.8rem",
//       fontWeight: "700",
//       background: "linear-gradient(90deg, #E8A476 0%, #F7ECE5 100%)",
//       WebkitBackgroundClip: "text",
//       WebkitTextFillColor: "transparent",
//     },
//     headerSubtitle: {
//       color: "#7B7B7B",
//       fontSize: "1rem",
//     },
//     formFieldInput: {
//       backgroundColor: "#1F1F1F",
//       border: "1px solid #3A3A3A",
//       color: "#F7ECE5",
//       borderRadius: "12px",
//       transition: "border 0.3s ease",
//     },
//     formFieldInput__focus: {
//       borderColor: "#E8A476",
//     },
//     footerActionLink: {
//       color: "#E8A476",
//       transition: "color 0.3s ease",
//     },
//     footerActionLink__hover: {
//       color: "#F7ECE5",
//     },
//     socialButtonsIconButton: {
//       backgroundColor: "#1F1F1F",
//       borderRadius: "50%",
//       border: "1px solid rgba(232,164,118,0.3)",
//       transition: "all 0.3s ease",
//     },
//     socialButtonsIconButton__hover: {
//       transform: "scale(1.1)",
//       backgroundColor: "#E8A476",
//       borderColor: "#F7ECE5",
//     },
//   },
// };

// export const clerkAppearance = {
//   elements: {
//     formButtonPrimary:
//       "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors",
//     formFieldInput:
//       "border-input bg-background text-foreground rounded-md border px-3 py-2",
//     formFieldLabel: "text-foreground text-sm font-medium",
//     socialButtonsBlockButton:
//       "border-input bg-background text-foreground hover:bg-accent rounded-md border px-3 py-2",
//     socialButtonsBlockButtonText: "text-foreground font-medium",
//     dividerLine: "bg-border",
//     dividerText: "text-muted-foreground",
//   },
//   layout: {
//     logoImageUrl: undefined,
//     socialButtonsPlacement: "bottom",
//     socialButtonsVariant: "blockButton",
//   },
// };

import type { Appearance } from "@clerk/types";

export const clerkAppearance: Appearance = {
  layout: {
    socialButtonsVariant: "iconButton",
    logoPlacement: "none",
    showOptionalFields: false,
  },
  variables: {
    colorPrimary: "#E8A476",
    colorBackground: "#151515",
    colorText: "#F7ECE5",
    colorInputBackground: "#1F1F1F",
    colorInputText: "#F7ECE5",
    borderRadius: "1rem",
    fontFamily: "'Inter', sans-serif",
  },
  elements: {
    card: {
      boxShadow: "0 0 40px rgba(232,164,118,0.4)",
      backdropFilter: "blur(10px)",
      background:
        "linear-gradient(135deg, rgba(21,21,21,0.95), rgba(47,47,47,0.8))",
      border: "1px solid rgba(232,164,118,0.3)",
    },
    headerTitle: {
      fontSize: "1.8rem",
      fontWeight: "700",
      background: "linear-gradient(90deg, #E8A476 0%, #F7ECE5 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    headerSubtitle: {
      color: "#7B7B7B",
      fontSize: "1rem",
    },
    formFieldInput: {
      backgroundColor: "#1F1F1F",
      border: "1px solid #3A3A3A",
      color: "#F7ECE5",
      borderRadius: "12px",
      transition: "border 0.3s ease",
    },
    formFieldInput__focus: {
      borderColor: "#E8A476",
      boxShadow: "0 0 0 2px rgba(232,164,118,0.2)",
    },
    formButtonPrimary: {
      backgroundColor: "#E8A476",
      color: "#000",
      fontWeight: "600",
      transition: "all 0.3s ease",
    },
    formButtonPrimary__hover: {
      backgroundColor: "#f1b589",
      transform: "translateY(-2px)",
    },
    footerActionLink: {
      color: "#E8A476",
      transition: "color 0.3s ease",
    },
    footerActionLink__hover: {
      color: "#F7ECE5",
    },
    socialButtonsIconButton: {
      backgroundColor: "#1F1F1F",
      border: "1px solid rgba(232,164,118,0.3)",
      transition: "all 0.3s ease",
    },
    socialButtonsIconButton__hover: {
      transform: "scale(1.1)",
      backgroundColor: "#E8A476",
      borderColor: "#F7ECE5",
    },
    dividerLine: {
      backgroundColor: "rgba(232,164,118,0.2)",
    },
    dividerText: {
      color: "#7B7B7B",
    },
  },
};
