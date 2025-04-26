import { resolve } from "node:path";
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import configPrettier from 'eslint-config-prettier/flat';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import pluginImport from 'eslint-plugin-import';

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use a library
 * that utilizes React.
 */

export default tseslint.config(
  {
    ignores: [
      "tsup.config.ts",
      "eslint.config.mjs",
      // Ignore dotfiles
      ".*.js",
      "**/*.css",
      "node_modules/",
      "dist/",
      "coverage/",
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  configPrettier,
  {
    ...pluginImport.flatConfigs.recommended,
    settings: {
      "import/resolver": {
        typescript: {
          project,
        },
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ...pluginReact.configs.flat.recommended,
    ...pluginReact.configs.flat['jsx-runtime'], // Add this if you are using React 17+
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  pluginReactHooks.configs['recommended-latest'],
  {
    plugins: {
      "simple-import-sort": pluginSimpleImportSort,
    },
    files: ["*.js?(x)", "*.ts?(x)", "*.test.ts?(x)"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    // settings: {
    //   "import/resolver": {
    //     typescript: {
    //       project,
    //     },
    //   },
    // },
    // add rules configurations here
    rules: {
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-empty-function": "off",
      // Turn this one off to use the same rule from @typescript-eslint which is more TS specific.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/ban-ts-comment": "off",
      "import/no-duplicates": ["error"],
      "no-useless-rename": ["error"],
      "object-shorthand": ["error", "always"],
      "simple-import-sort/imports": [
        "error",
        {
          "groups": [
            // `react` first, `next` second, then packages starting with a character
            ["^react$", "^next", "^[a-z]"],
            // Packages starting with `@xxx`
            ["^@[A-Za-z]"],
            // Packages starting with `@`
            ["^@"],
            // Packages starting with `~`
            ["^~"],
            // Imports starting with `../`
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Imports starting with `./`
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports
            ["^.+\\.s?css$"],
            // Side effect imports
            ["^\\u0000"]
          ]
        }
      ]
    },
  }
);

// module.exports = {
//   settings: {
//     "react": {
//       fragment: "Fragment",
//       version: "detect",
//     },
//   },
// };
