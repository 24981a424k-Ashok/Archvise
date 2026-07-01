import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#141414',
        card: '#1A1A1A',
        cardElevated: '#1F1F1F',
        border: '#2D2D2D',
        borderLight: '#383838',
        primary: '#3B82F6',
        primaryDark: '#1D4ED8',
        primaryLight: '#93C5FD',
        success: '#22C55E',
        successBg: 'rgba(34,197,94,0.12)',
        warning: '#EAB308',
        warningBg: 'rgba(234,179,8,0.12)',
        danger: '#EF4444',
        dangerBg: 'rgba(239,68,68,0.12)',
        purple: '#A855F7',
        orange: '#F97316',
        textPrimary: '#FFFFFF',
        textSecondary: '#9CA3AF',
        textMuted: '#6B7280',
        agentSRE: '#3B82F6',
        agentBackend: '#22C55E',
        agentInfra: '#A855F7',
        agentCloud: '#F97316',
      },
      borderRadius: {
        lg: "12px",  // Cards (12px)
        md: "8px",   // Buttons (8px)
        sm: "4px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
