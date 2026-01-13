import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0A3D62",
          foreground: "#FFFFFF",
          50: "#E8F4F8",
          100: "#D1E9F1",
          200: "#A3D3E3",
          300: "#75BDD5",
          400: "#47A7C7",
          500: "#0A3D62",
          600: "#08314E",
          700: "#06253B",
          800: "#041927",
          900: "#020C14",
        },
        secondary: {
          DEFAULT: "#1B4F72",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#2E5266",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#27AE60",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F39C12",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#E74C3C",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(10, 61, 98, 0.08)",
        medium: "0 4px 16px rgba(10, 61, 98, 0.12)",
        strong: "0 8px 32px rgba(10, 61, 98, 0.16)",
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
}

export default config
