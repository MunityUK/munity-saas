import { createTables, insertComplaints } from '../../utils/functions/database';
import { DB_TABLE } from '../../utils/knex';
import { Complaint } from '../../utils/types';

const NUM_OF_RECORDS = process.argv[2] || 100;

main()
;
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
