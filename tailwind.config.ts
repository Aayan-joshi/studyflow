import type { Config } from "tailwindcss";

import tailwindcss_animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

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
          "spaceGrotesk": "var(--font-space-grotesk)",
        },
        borderRadius: {
          "2": "8px",
          "1.5": "6px",
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        boxShadow: {
          "light-100":
              "0px 12px 20px 0px rgba(184, 184, 184, 0.03), 0px 6px 12px 0px rgba(184, 184, 184, 0.02), 0px 2px 4px 0px rgba(184, 184, 184, 0.03)",
          "light-200": "10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
          "light-300": "-10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
          "dark-100": "0px 2px 10px 0px rgba(46, 52, 56, 0.10)",
          "dark-200": "2px 0px 20px 0px rgba(39, 36, 36, 0.04)",
        },
        backgroundImage: {
          "auth-dark": 'url("/images/auth-dark.png")',
          "auth-light": 'url("/images/auth-light.png")',
        },
        screens: {
          xs: "420px",
        },
      },
    },
  },
  plugins: [tailwindcss_animate, typography],
};
export default config;
