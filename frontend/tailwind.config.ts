import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effcf6",
          100: "#dff8ec",
          500: "#16a36a",
          600: "#108857",
          700: "#0b6e47",
          900: "#073d2a"
        }
      },
      boxShadow: {
        soft: "0 12px 40px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
