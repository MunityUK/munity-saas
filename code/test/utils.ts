export function run(main: () => Promise<void>) {
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
