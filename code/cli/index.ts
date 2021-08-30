import { MunityTest } from '@munity/utils';
import { Command } from 'commander';

import Comrank from './src/comrank';
import * as Database from './src/database';

MunityTest.run(main);

async function main() {
  const program = new Command();

  program
    .command('init-db')
    .description('Initialises the MySQL database on Docker')
    .action(Database.initialiseDatabase);

  program
    .command('ingest')
    .arguments('[quantity] [status]')
    .description('Ingests random complaints into the database.')
    .action(Database.ingest);

  program
    .command('comrank')
    .description('Prints the PCP scores for each station to the console.')
    .action(Comrank);

  program
    .command('create-tables')
    .description('Creates the tables in the database.')
    .action(Database.createTables);

  program.addHelpCommand(false);
  await program.parseAsync();
}
