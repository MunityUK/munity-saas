import { Complaint } from '../../types';
import { createTables, insertComplaints } from '../../utils/functions/database';
import { run } from '../../utils/functions/test';
import { DB_TABLE } from '../../utils/knex';

const NUM_OF_RECORDS = process.argv[2] || 100;

run(main);

async function main() {
  await createTables(DB_TABLE);
  console.info('Table (re)created.');

  await ingestData();
  console.info(`${NUM_OF_RECORDS} records ingested.`);
}

function ingestData() {
  const complaints: Complaint[] = [];

  for (let i = 1; i <= NUM_OF_RECORDS; i++) {
    const complaint = Complaint.random();
    complaint.complaintId = 'COM' + i.toString().padStart(4, '0');
    complaints.push(complaint);
  }

  return insertComplaints(DB_TABLE, complaints);
}
