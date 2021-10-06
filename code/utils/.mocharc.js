// @ts-check

const options = {};

// if (process.env.CI) {
//   options.reporter = 'mocha-junit-reporter';
//   options.reporterOptions = 'mochaFile=~/test-results/utils.xml';
// }

/**
 * @type {import('mocha').MochaOptions}
 **/
module.exports = {
  exit: true,
  extension: ['ts'],
  require: 'ts-node/register',
  spec: './test/**/*.test.ts',
  timeout: false,
  ...options
};
