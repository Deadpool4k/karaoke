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
        neon: {
          magenta: "#ff00ff",
          yellow: "#ffff00",
          pink: "#ff1493",
        },
      },
      boxShadow: {
        "neon-magenta": "0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff",
        "neon-yellow": "0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 40px #ffff00",
        "neon-white": "0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 40px #ffffff",
      },
      animation: {
        "pulse-neon": "pulseNeon 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        pulseNeon: {
          "0%, 100%": {
            opacity: "0.85",
            filter: "drop-shadow(0 0 20px #ff00ff) drop-shadow(0 0 40px #ff00ff)",
          },
          "50%": {
            opacity: "1",
            filter: "drop-shadow(0 0 30px #ff00ff) drop-shadow(0 0 60px #ff00ff) drop-shadow(0 0 80px #ffff00)",
          },
        },
        glow: {
          "0%": { textShadow: "0 0 10px #ff00ff, 0 0 20px #ff00ff" },
          "100%": { textShadow: "0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 60px #ffff00" },
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
