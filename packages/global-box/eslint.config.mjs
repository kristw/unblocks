import baseConfig from '@unblocks/eslint-config/index.mjs';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  baseConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      }
    },
  },
);
