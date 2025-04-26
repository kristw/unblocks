const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use a library
 * that utilizes React.
 *
 */

module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    // This enables eslint-plugin-prettier and eslint-config-prettier
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:react-hooks/recommended",
    // To enable "@dword-design/import-alias/prefer-alias" rule
    "plugin:@dword-design/import-alias/recommended"
  ],
  plugins: [
    "@typescript-eslint",
    "simple-import-sort",
  ],
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "react": {
      fragment: "Fragment",
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js", "**/*.css"],
  // add rules configurations here
  rules: {
    "@typescript-eslint/consistent-type-imports": "warn",
    "@typescript-eslint/no-empty-function": "off",
    // Turn this one off to use the same rule from @typescript-eslint which is more TS specific.
    "no-unused-vars": "off",
    "@dword-design/import-alias/prefer-alias": [
      "error",
      {
        "alias": {
          "@": "./src"
        }
      }
    ],
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
};
