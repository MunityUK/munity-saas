/**
 * @type {import('eslint').ESLint.Options}
 **/
module.exports = {
  extends: '@zzavidd/eslint-config',
  root: true,
  ignorePatterns: [
    '.eslintrc.js',
    '**/next.config.js',
    '**/dist/**',
    '**/next-env.d.ts'
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['**/tsconfig.eslint.json', '**/tsconfig.json']
  },
  settings: {
    react: 'latest'
  }
};
