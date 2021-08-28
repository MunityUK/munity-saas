#!/usr/bin/env node

import { Command } from 'commander';

import { Complaint } from '../app/types';
import { insertComplaints } from '../app/utils/functions/database';
import { run } from '../app/utils/functions/test';
import { DB_TABLE } from '../app/utils/knex';
const cli = new Command();

run(main);

async function main() {
  cli
    .command('create')
    .arguments('[quantity] [status]')
    .description('Creates a new complaint.')
    .action(async (quantity = 1, status) => {
      const complaints: Complaint[] = [];

      for (let i = 1; i <= quantity; i++) {
        const complaint = Complaint.random({ status });
        complaints.push(complaint);
      }

      await insertComplaints(DB_TABLE, complaints);
    });

  await cli.parseAsync();
}
