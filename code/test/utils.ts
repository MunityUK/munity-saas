export function run(main: () => void) {
  return (async () => {
    try {
      await main();
    } catch (err) {
      console.error(err);
    } finally {
      process.exit(0);
    }
  })();
}
