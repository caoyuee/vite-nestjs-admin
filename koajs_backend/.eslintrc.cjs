/**
 * Modern ESLint config using overrides for filetypes.
 * Keeps TypeScript rules scoped to TS files and JS rules scoped to JS files.
 */
module.exports = {
  root: true,
  ignorePatterns: ['node_modules/', 'dist/', 'logs/'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
      rules: {
        'no-console': 'warn',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      files: ['*.js'],
      env: { node: true, es2022: true },
      extends: ['eslint:recommended', 'prettier'],
      rules: { 'no-console': 'warn' },
    },
  ],
};
