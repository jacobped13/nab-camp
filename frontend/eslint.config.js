import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginSonarjs from "eslint-plugin-sonarjs";
import pluginUnicorn from "eslint-plugin-unicorn";
import pluginCheckFile from "eslint-plugin-check-file";
import pluginReactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";
import pluginImport from "eslint-plugin-import";
import { defineConfig } from "eslint/config";
import customRules from "./eslint-rules/index.js";

export default defineConfig([
  {
    ignores: [
      "dist/",
      "node_modules/"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "@tanstack/query": pluginQuery,
      "jsx-a11y": pluginJsxA11y,
      sonarjs: pluginSonarjs,
      unicorn: pluginUnicorn,
      "check-file": pluginCheckFile,
      "react-you-might-not-need-an-effect": pluginReactYouMightNotNeedAnEffect,
      import: pluginImport,
      custom: customRules,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      // React rules
      ...pluginReact.configs.flat.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",

      // TanStack Query
      ...pluginQuery.configs.recommended.rules,

      // Accessibility
      ...pluginJsxA11y.configs.recommended.rules,

      // Code Quality
      ...pluginSonarjs.configs.recommended.rules,
      ...pluginUnicorn.configs.recommended.rules,

      // You Might Not Need an Effect
      ...pluginReactYouMightNotNeedAnEffect.configs.recommended.rules,

      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{ts,tsx}": "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/**/": "KEBAB_CASE",
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[object.name='React']",
          message:
            "Do not use the React namespace. Use named imports instead.",
        },
      ],
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "unicorn/prefer-spread": "off",
    },
  },
]);
