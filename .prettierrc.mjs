/** @type {import("prettier").Config} */
export default {
  arrowParens: "always",
  printWidth: 100,
  singleQuote: false,
  jsxSingleQuote: false,
  bracketSpacing: true,
  semi: true,
  trailingComma: "all",
  tabWidth: 2,
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
