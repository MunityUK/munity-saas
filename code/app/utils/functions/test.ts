import { assert } from 'chai';

/**
 * Executes a specified function on call.
 * @param main The function to execute.
 * @returns A promise.
 */
export function run(main: () => Promise<void>) {
  return (async () => {
    try {
      await main();
    } catch (err) {
      console.error(`${err.name}: ${err.message}`);
    } finally {
      process.exit(0);
    }
  })();
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
    } catch (err) {
      assert.fail(err);
    }
  };
}
