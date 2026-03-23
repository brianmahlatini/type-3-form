import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b1220"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(0,0,0,.45)",
      },
    },
  },
  plugins: [],
} satisfies Config;

