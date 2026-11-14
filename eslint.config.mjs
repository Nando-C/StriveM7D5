import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

// ESLint 10 tracks components that are only used in JSX by itself, so no React
// plugin is needed for `no-unused-vars`. eslint-plugin-react is not installed:
// as of November 2026 it does not support ESLint 10.
export default [
  { ignores: ["dist/", "build/"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: globals.browser,
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      // Only these two hooks rules, set by hand: the plugin's recommended
      // preset also turns on React Compiler rules, which are out of scope.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
