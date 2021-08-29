import { Complaint, ComplaintStatus, DB_TABLE } from '@munity/utils';

import { conn } from '../config';

export async function createTables() {
  await conn.createTables(DB_TABLE);
  console.info('Table (re)created.');
}

export async function ingest(quantity = 1, status?: ComplaintStatus) {
  const complaints: Complaint[] = [];

  for (let i = 1; i <= quantity; i++) {
    const complaint = Complaint.random({ status });
    complaint.complaintId = 'COM' + i.toString().padStart(4, '0');
    complaints.push(complaint);
  }

  await conn.insertComplaints(DB_TABLE, complaints);
  console.info(`${quantity} record(s) ingested.`);
}
