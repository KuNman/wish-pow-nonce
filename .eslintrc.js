module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'object-curly-newline': ['error', {
      'ObjectExpression': 'always',
      'ObjectPattern': { 'multiline': false },
      'ImportDeclaration': { 'multiline': true, 'minProperties': 3 },
      'ExportDeclaration': { 'multiline': false, 'minProperties': 3 }
    }],
    'padding-line-between-statements': [
      'error',
      { 'blankLine': 'always', 'prev': '*','next': 'return' },
      { 'blankLine': 'always', 'prev': '*','next': 'if' },
      { 'blankLine': 'always', 'prev': '*','next': 'throw' }
    ],
    'newline-per-chained-call': ['error', { 'ignoreChainWithDepth': 1 }],
    'class-methods-use-this': 'warn',
    'no-underscore-dangle': 'off'
  },
};
