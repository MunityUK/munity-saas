import dotenv from 'dotenv';
dotenv.config();

import Complaint, { DatabaseField } from '../src/classes';
import airtable from '../src/utils/airtable';

const NUM_OF_RECORDS = 50;

let recordCount = 0;

(async () => {
  console.info(`Commencing ingestion of ${NUM_OF_RECORDS} records...`);
  const numOfRecordSets = NUM_OF_RECORDS / 10;

  for (let i = 1; i <= numOfRecordSets; i++) {
    await ingestRecords();
    console.info(`> Ingested ${recordCount} of ${NUM_OF_RECORDS} records`);
    if (i < numOfRecordSets) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  console.info(`Finished ${recordCount} records.`);
})();

async function ingestRecords() {
  const records: unknown[] = [];

  for (let i = 1; i <= 10; i++) {
    recordCount++;
    const complaint = Complaint.random();
    complaint.reportId = 'COM' + recordCount.toString().padStart(4, '0');
    const data = marshalToFields(complaint);
    records.push({ fields: data });
  }

  try {
    await airtable('Complaints').create(records);
  } catch (err) {
    console.error(err);
  }
}

function marshalToFields(complaint: Complaint) {
  const data: { [key: string]: unknown } = {};

  Object.keys(complaint).forEach((key) => {
    const complaintKey = key as keyof Complaint;
    const fieldName = DatabaseField[complaintKey];
    data[fieldName] = complaint[complaintKey];
  });

  return data;
}
