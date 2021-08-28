const path = require('path');

module.exports = {
  extends: '@zzavidd/eslint-config',
  ignorePatterns: ['**/*.js', 'next-env.d.ts'],
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, './tsconfig.json')
      }
    }
  }
};
