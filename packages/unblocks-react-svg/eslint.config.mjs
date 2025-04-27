import baseConfig from '@unblocks/eslint-config/react.mjs';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  baseConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      }
    },
  },
);
