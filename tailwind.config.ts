import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      images: {
        remote: "https://tablechairetc.auinno.site/wp-content/uploads/",
      },
    },
  },
  plugins: [],
};
export default config;
