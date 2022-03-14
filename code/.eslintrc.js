/**
 * @type {import('eslint').Linter.Config}
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
    project: ['**/tsconfig.json']
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
