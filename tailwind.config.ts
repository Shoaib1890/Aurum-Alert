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
        bullion: {
          gold: "#D4AF37",
          "gold-dark": "#AA820A",
          silver: "#94A3B8",
          emerald: "#059669",
        },
      },
    },
  },
  plugins: [],
};
export default config;
