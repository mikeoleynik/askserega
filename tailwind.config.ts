import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#eff3f2",
        surface: "#f9f9f9",
        "surface-alt": "#ededed",
        text: "#282828",
        muted: "#5d5d5d",
        subtle: "#64748b",
        overlay: "#181818",
        accent: "#0d0d0d",
        blueprint: "#1e3a5f",
        "blueprint-lt": "#eef2f7",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
export default config
