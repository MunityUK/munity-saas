// @ts-check

const options = {};

if (process.env.CI) {
  options.reporter = 'mocha-junit-reporter';
  options.reporterOptions = `mochaFile=${process.env.HOME}/test-results/utils.xml`;
}

/**
 * @type {import('mocha').MochaOptions}
 **/
module.exports = {
  exit: true,
  extension: ['ts'],
  require: 'ts-node/register',
  // spec: './test/**/score.test.ts',
  timeout: false,
  ...options
};
