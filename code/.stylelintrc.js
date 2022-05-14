/**
 * @type {import('stylelint').Config}
 */
module.exports = {
  extends: '@zzavidd/stylelint-config/sass',
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: '@zzavidd/stylelint-config/sc'
    }
  ]
};
