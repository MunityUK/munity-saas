import { assert } from 'chai';

/**
 * Executes a specified function and handles any thrown errors.
 * @param main The function to execute.
 * @returns A promise.
 */
export async function run(
  main: () => Promise<void | never>,
  options: RunOptions = {}
): Promise<void | never> {
  const { assertFail = false, exit = false } = options;
  try {
    await main();
  } catch (err: any) {
    if (assertFail) {
      assert.fail(err);
    }
    console.error(`${err.name}: ${err.message}`);
  } finally {
    if (exit) process.exit(0);
  }
}

type RunOptions = {
  /** Should assert fail with error if the function fails. Usually used for tests. */
  assertFail?: boolean;
  /** Should exit the process after running. */
  exit?: boolean;
};
