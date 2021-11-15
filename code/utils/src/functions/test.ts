import { assert } from 'chai';

/**
 * Executes a specified function and exits the program.
 * @param main The function to execute.
 * @returns A promise.
 */
export async function run(
  main: () => Promise<void>,
  options: RunOptions = {}
): Promise<void | never> {
  const { exit = false } = options;
  try {
    await main();
  } catch (err: any) {
    console.error(`${err.name}: ${err.message}`);
  } finally {
    if (exit) process.exit(0);
  }
}

/**
 * Runs a sequence of instructions prone to throwing an exception.
 * @param runnable The runnable sequence of instructions.
 * @returns The function surrounded in a try-catch.
 */
export function tryCatch(runnable: () => Promise<void>) {
  return async () => {
    try {
      await runnable();
    } catch (err: any) {
      assert.fail(err);
    }
  };
}

type RunOptions = {
  exit?: boolean;
};
