module.exports = {
  extends: '@zzavidd/eslint-config',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './tsconfig.eslint.json'
    ],
    tsconfigRootDir: __dirname
  },
  ignorePatterns: ['**/*.js', 'next-env.d.ts']
};
