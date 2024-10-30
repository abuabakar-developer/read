import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Extending the theme with custom properties
      clipPath: {
        'custom-triangle': 'polygon(50% 0%, 100% 100%, 0% 100%)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'], // Default sans-serif font
        poppins: ['Poppins', 'sans-serif'], // Additional Poppins font
        cinzel: ['"Cinzel Decorative"', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
