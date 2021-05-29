import { createTable, insertComplaints } from './helper';

import { Complaint } from '../../types';
import { DB_TABLE } from '../../utils/knex';
import { run } from '../utils';

const NUM_OF_RECORDS = process.argv[2] || 100;

run(main);

async function main() {
  await createTable(DB_TABLE);
  console.info('Table (re)created.');

  await ingestData();
  console.info(`${NUM_OF_RECORDS} records ingested.`);
}

function ingestData() {
  const complaints: Complaint[] = [];

  for (let i = 1; i <= NUM_OF_RECORDS; i++) {
    const complaint = Complaint.random();
    complaint.reportId = 'COM' + i.toString().padStart(4, '0');
    complaints.push(complaint);
  }

  return insertComplaints(DB_TABLE, complaints);
}
