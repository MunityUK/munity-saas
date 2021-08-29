module.exports = {
  extends: '@zzavidd/eslint-config',
  root: true,
  ignorePatterns: ['.eslintrc.js', '**/dist/**', '**/next-env.d.ts'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./*/tsconfig.json']
  },
  settings: {
    react: 'latest'
  }
};
