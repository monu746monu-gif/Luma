import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#fbf4e8",
        cream: "#fffaf1",
        ink: "#251b14",
        umber: "#5c4030",
        amberSoft: "#e7a83d",
        goldSoft: "#f5d890",
      },
      boxShadow: {
        premium: "0 24px 70px rgba(92, 64, 48, 0.14)",
        card: "0 16px 40px rgba(92, 64, 48, 0.09)",
      },
    },
  },
  plugins: [],
};

export default config;
