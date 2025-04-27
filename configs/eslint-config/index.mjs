import 'eslint-plugin-only-warn';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import configPrettier from 'eslint-config-prettier/flat';
import configTurbo from 'eslint-config-turbo/flat';
import globals from 'globals';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { resolve } from 'node:path';

const project = resolve(process.cwd(), "tsconfig.json");

export default tseslint.config(
  {
    ignores: [
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
  pluginPrettierRecommended,
  ...configTurbo,
  {
    files: ["*.js?(x)", "*.ts?(x)", "*.test.ts?(x)"],
    languageOptions: {
      globals: {
        ...globals.node,
        React: true,
        JSX: true,
      }
    },
    settings: {
      "import/resolver": {
        typescript: {
          project,
        },
      },
    },
  },
);
