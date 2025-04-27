import { resolve } from 'node:path';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import configTurbo from 'eslint-config-turbo/flat';
import globals from 'globals';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginImport from 'eslint-plugin-import';

const project = resolve(process.cwd(), 'tsconfig.json');

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      'tsup.config.ts',
      'eslint.config.mjs',
      '.*.js',        // dotfiles
      '**/*.css',
      'node_modules/',
      'dist/',
      'coverage/',
    ],
  },

  // Core configs
  js.configs.recommended,
  tseslint.configs.recommended,
  ...configTurbo,
  pluginPrettierRecommended,

  // Import plugin
  {
    ...pluginImport.flatConfigs.recommended,
    settings: {
      'import/resolver': {
        typescript: {
          project,
        },
      },
    },
  },

  // React + JSX support
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx}', "**/*.test.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,  // automatically handles tsconfig.json
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        React: true,
        JSX: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'simple-import-sort': pluginSimpleImportSort,
    },
    rules: {
      // React rules (merged properly)
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReact.configs.flat['jsx-runtime'].rules,
      ...pluginReactHooks.configs['recommended-latest'].rules,
      // TypeScript
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-unused-vars': 'off',

      // Import
      'import/no-duplicates': 'error',

      // Code style
      'no-useless-rename': 'error',
      'object-shorthand': ['error', 'always'],

      // Simple Import Sort
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react$', '^next', '^[a-z]'],  // react, next, then normal packages
            ['^@[A-Za-z]'],                  // @xxx
            ['^@'],                          // @
            ['^~'],                          // ~
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // ../
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // ./
            ['^.+\\.s?css$'],                // styles
            ['^\\u0000'],                    // side effect imports
          ],
        },
      ],
    },
  }
);
