// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#1f2937", // gray-800
            a: {
              color: "#16a34a",
              "&:hover": { color: "#15803d" },
              textDecoration: "underline",
            },
            strong: { color: "#000" },
            code: {
              backgroundColor: "#f3f4f6",
              color: "#d946ef",
              padding: "2px 4px",
              borderRadius: "4px",
            },
            "ul > li::marker": { color: "#16a34a" },
            h1: { color: "#000" },
            h2: { color: "#000" },
            h3: { color: "#000" },
          },
        },
        dark: {
          css: {
            color: "#f3f4f6", // gray-100
            a: {
              color: "#4ade80", // green-400
              "&:hover": { color: "#22c55e" }, // green-500
            },
            strong: { color: "#fff" },
            code: {
              backgroundColor: "#1f2937", // gray-800
              color: "#f472b6", // rose-400
            },
            "ul > li::marker": { color: "#4ade80" },
            h1: { color: "#fff" },
            h2: { color: "#fff" },
            h3: { color: "#fff" },
          },
        },
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("@tailwindcss/typography")],
};
