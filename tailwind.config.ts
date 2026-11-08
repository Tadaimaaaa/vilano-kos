import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Primary Brand (Warm Earthy Coffee)
        primary: {
          DEFAULT: "#5D4037", // Deep Warm Brown
          50: "#FAF7F2",      // Softest Cream
          100: "#F5EDE4",     // Warm Cream
          200: "#E8D8C8",     // Sand
          300: "#D4BCA7",     // Latte
          400: "#A98467",     // Caramel
          500: "#8D6E63",     // Medium Brown
          600: "#6D4C41",     // Saddle Brown
          700: "#5D4037",     // Deep Warm Brown
          800: "#4E342E",     // Dark Roast
          900: "#3E2723",     // Espresso
          foreground: "#FAF7F2",
        },

        // Kos: Coklat Dominan - Aksen Krem
        kos: {
          DEFAULT: "#5D4037", // Coklat Elegan
          dark: "#3E2723",    // Coklat Tua
          accent: "#F5EDE4",  // Krem Lembut
          border: "#8D6E63",
          surface: "#4E342E", // Coklat Pekat
          text: "#FAF7F2",    // Teks Krem
        },

        // Kontrakan: Krem Dominan - Aksen Coklat
        kontrakan: {
          DEFAULT: "#F5EDE4", // Krem Hangat
          light: "#FAF7F2",   // Krem Muda
          accent: "#5D4037",  // Coklat
          border: "#D4BCA7",  // Border Krem Gelap
          surface: "#E8D8C8", // Krem Medium
          text: "#4E342E",    // Teks Coklat
        },

        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#2D241E",
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 18px -3px rgba(93, 64, 55, 0.08), 0 8px 16px -2px rgba(93, 64, 55, 0.04)",
        card: "0 4px 20px rgba(93, 64, 55, 0.07)",
        hover: "0 14px 32px rgba(93, 64, 55, 0.15)",
        glow: "0 0 25px rgba(212, 188, 167, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
