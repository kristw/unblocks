import 'eslint-plugin-only-warn';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintConfigTurbo from 'eslint-config-turbo/flat';
import globals from 'globals';
import { resolve } from 'node:path';

const project = resolve(process.cwd(), "tsconfig.json");

export default tseslint.config(
  {
    ignores: [
      "eslint.config.mjs",
      // Ignore dotfiles
      ".*.js",
      "node_modules/",
      "dist/",
      "coverage/",
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  ...eslintConfigTurbo,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        React: true,
        JSX: true,
      }
    },
    files: ["*.js?(x)", "*.ts?(x)", "*.test.ts?(x)"],
    settings: {
      "import/resolver": {
        typescript: {
          project,
        },
      },
    },
  },
);
