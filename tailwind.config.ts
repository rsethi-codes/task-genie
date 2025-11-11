// import type { Config } from "tailwindcss";

// const config: Config = {
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   darkMode: 'class', // Enable class-based dark mode
//   theme: {
//     extend: {
//       colors: {
//         // Light mode colors
//         light: {
//           background: '#FFFFFF',
//           surface: '#F8F9FA',
//           'surface-hover': '#F1F3F5',
//           border: '#E9ECEF',
//           text: {
//             primary: '#212529',
//             secondary: '#495057',
//             tertiary: '#868E96',
//           },
//           primary: '#4C6EF5',
//           'primary-hover': '#4263EB',
//           success: '#51CF66',
//           warning: '#FCC419',
//           danger: '#FF6B6B',
//         },
//         // Dark mode colors
//         dark: {
//           background: '#0F1419',
//           surface: '#1A1F26',
//           'surface-hover': '#242930',
//           border: '#2F3640',
//           text: {
//             primary: '#E8EAED',
//             secondary: '#B8BABF',
//             tertiary: '#8B8D91',
//           },
//           primary: '#6B8AFF',
//           'primary-hover': '#5A7AFF',
//           success: '#69DB7C',
//           warning: '#FFD43B',
//           danger: '#FF8787',
//         },
//         // Productivity theme (energetic, focused)
//         productivity: {
//           background: '#FFF9F5',
//           surface: '#FFF3E9',
//           'surface-hover': '#FFEDD5',
//           border: '#FFE4CC',
//           text: {
//             primary: '#1A1A1A',
//             secondary: '#4A4A4A',
//             tertiary: '#7A7A7A',
//           },
//           primary: '#F76B15',
//           'primary-hover': '#E55E0D',
//           success: '#14B8A6',
//           warning: '#F59E0B',
//           danger: '#EF4444',
//         },
//         // Calm theme (peaceful, zen)
//         calm: {
//           background: '#F5F9FA',
//           surface: '#E8F4F8',
//           'surface-hover': '#D9EDF4',
//           border: '#C4E1EA',
//           text: {
//             primary: '#1E3A4A',
//             secondary: '#456573',
//             tertiary: '#6B8898',
//           },
//           primary: '#0891B2',
//           'primary-hover': '#0E7490',
//           success: '#059669',
//           warning: '#D97706',
//           danger: '#DC2626',
//         },
//       },
//     },
//   },
//   plugins: [],
// };

// export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Add this if using src directory
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Map to CSS variables
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-hover': 'rgb(var(--surface-hover) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        'text-tertiary': 'rgb(var(--text-tertiary) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-hover': 'rgb(var(--primary-hover) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};

export default config;