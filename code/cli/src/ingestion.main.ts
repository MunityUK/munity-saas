import { Complaint } from '../../app/types';
import { createTables, insertComplaints } from '../../app/utils/functions/database';
import { DB_TABLE } from '../../app/utils/knex';

const NUM_OF_RECORDS = process.argv[2] || 100;

export async function main() {
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
