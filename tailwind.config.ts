import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111110",
        paper: "#f6f6f4",
        hairline: "#e9e9e6",
        mute: "#6f6f6a",
        clp: {
          blue: "#0057a8",
          navy: "#00294d",
          sky: "#e8f2fa",
          orange: "#f26522",
        },
      },
      borderRadius: {
        card: "28px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.06)",
        lift: "0 18px 50px rgba(0,0,0,0.12)",
      },
      maxWidth: {
        phone: "430px",
      },
    },
  },
  plugins: [],
};

export default config;
