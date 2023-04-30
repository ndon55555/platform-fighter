module.exports = {
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: true,
      tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint'],
    root: true,
    env: {
      node: true
    },
    ignorePatterns: ['.eslintrc.cjs'],
    rules: {
      semi: ['error', 'never']
    }
  };
