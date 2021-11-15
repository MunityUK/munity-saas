import { MunityTest } from '@munity/utils';
import { Command } from 'commander';

import Comrank from './comrank';
import * as Database from './database';

main();

async function main() {
  const program = new Command();

  program
    .command('init')
    .description('Initialises the MySQL database on Docker')
    .option('--no-tables', 'Skips creating the tables after initialisation.')
    .action(Database.initialiseDatabase);

  program
    .command('ingest')
    .arguments('[quantity] [status]')
    .option('--clear-data', 'Clears all data from the table before ingestion')
    .description('Ingests random complaints into the database.')
    .action(Database.ingest);

  program
    .command('create-tables')
    .description('Creates the tables in the database.')
    .action(Database.createTable);

  program
    .command('comrank')
    .description('Prints the PCP scores for each station to the console.')
    .action(Comrank);

  program.addHelpCommand(false);
  program.exitOverride(() => process.exit(0));

  await MunityTest.run(
    async () => {
      await program.parseAsync();
    },
    { exit: true }
  );
}
