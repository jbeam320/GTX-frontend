import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-dark": "var(--bg-dark)",
        "bg-light": "var(--bg-light)",
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",

        "border-dark": "var(--border-dark)",

        "color-light": "var(--color-light)",
        "color-black": "var(--color-black)",
        "color-primary": "var(--color-primary)",
        "color-disabled": "var(--color-disabled)",
        "color-success": "var(--color-success)",

        "green-stroke": "var(--green-stroke)",
        "red-stroke": "var(--red-stroke)",
        "green-fill": "var(--green-fill)",
        "red-fill": "var(--red-fill)",
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
