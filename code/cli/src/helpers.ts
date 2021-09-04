import chalk from 'chalk';

export const Logger = {
  outcome(message: string) {
    console.info(chalk.magenta(message));
  },
  progress(message: string) {
    console.info(chalk.cyan(message));
  },
  success(message: string) {
    console.info(chalk.green(message));
  },
  warning(message: string) {
    console.info(chalk.yellow(message));
  },
  error(message: string) {
    console.info(chalk.red(message));
  }
};
