module.exports = {
  extends: '@zzavidd/eslint-config',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.eslint.json'],
    tsconfigRootDir: __dirname
  },
  ignorePatterns: ['.eslintrc.js']
};
