import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#161616",
        paper: "#eef4ef",
        cloud: "#fbfffc",
        moss: "#31584a",
        coral: "#e16a4f",
        citron: "#d7e56f",
        teal: "#1b8a7a",
        steel: "#60737a",
        graphite: "#24302d"
      },
      borderRadius: {
        ui: "8px"
      }
    }
  },
  plugins: []
};

export default config;
