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
        "accent-gradient": "linear-gradient(90deg, #77ACCF 100%, #5764D9 100%, #3756BC 100%)",
        "accent-800": "#FFF1E6",
        "dark" : {
          100: "#000000",
          200: "#0F1117",
          300: "#151821",
          400: "#212734",
          500: "#3F4354",
          "gradient": "linear-gradient(232deg, rgba(23, 28, 35, 0.41) 0%, rgba(19, 22, 28, 0.70) 100%)",
        },
        "light" : {
          900: "#FFFFFF",
          850: "#FDFDFD",
          800: "#F4F6F8",
          700: "#DCE3F1",
          500: "#7B8EC8",
          400: "#858EAD",
        },
        fontFamily: {
          "inter": "var(--font-inter)",
        }
      },
    },
  },
  plugins: [],
};
export default config;
