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
        background: "var(--background)",
        foreground: "var(--foreground)",
        vault: {
          950: "#050608",
          900: "#090A0E",
          850: "#0E1117",
          800: "#131720",
          700: "#1E2330",
          600: "#2B3245",
        },
        gold: {
          50: "#FFFDF5",
          100: "#FFF9E6",
          200: "#FDF0C0",
          300: "#FAE494",
          400: "#F5D362",
          500: "#E5B842",
          600: "#CA9927",
          700: "#A47417",
          800: "#7F5514",
          900: "#5E3E11",
        },
        cyber: {
          emerald: "#00F0A0",
          ruby: "#FF3366",
          cyan: "#00E5FF",
        },
      },
      animation: {
        ticker: "ticker 35s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
