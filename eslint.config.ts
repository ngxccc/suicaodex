import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintReact from "@eslint-react/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import globals from "globals";

const eslintConfig = defineConfig([
  eslintJs.configs.recommended,
  tseslint.configs.recommendedTypeChecked, // Check cả type
  tseslint.configs.stylisticTypeChecked, // Check type để quyết định phong cách
  nextVitals,
  nextTs,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "dist/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),

  // Đặt ở cuối để tự động tắt các rule xung đột và bật rule prettier
  eslintReact.configs["recommended-type-checked"],
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports", // Bắt buộc dùng import type
          fixStyle: "separate-type-imports", // Tự động fix thành: import type { Metadata } ...
        },
      ],

      "react/react-in-jsx-scope": "off", // Next.js không cần import React
      "react/prop-types": "off", // Dùng TS nên không cần Prop-types
    },
  },

  eslintConfigPrettier,
]);

export default eslintConfig;
