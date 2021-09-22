import { Complaint, ComplaintStatus, DB_TABLE } from '@munity/utils';

import { conn } from '../config';
import { Logger } from '../helpers';

export * from './init';

/**
 * Creates the database tables.
 */
export async function createTable() {
  Logger.progress(`Creating '${DB_TABLE}' table...`);
  await conn.createTable(DB_TABLE);
  Logger.outcome(`Table(s) created.`);
}

/**
 * Clears all data from the database table.
 */
export async function truncateTable() {
  Logger.progress(`Clearing all data from '${DB_TABLE}' table...`);
  await conn.truncateTable(DB_TABLE);
  Logger.outcome(`Table data cleared.`);
}

/**
 * Ingests complaint data into the database.
 * @param quantity The quantity of complaints to ingest. Defaults to 1.
 * @param status An optional {@link ComplaintStatus} assigned to all complaints.
 * @param options Options passed into the ingest command..
 */
export async function ingest(
  quantity = 1,
  status?: ComplaintStatus,
  options?: IngestOptions
) {
  if (options?.clearData) {
    await truncateTable();
  }

  Logger.progress(`Ingesting record(s)...`);
  await conn.insertRecords(
    DB_TABLE,
    Complaint.create({
      quantity,
      status,
      overrider: (_, i) => ({
        complaintId: 'COM' + i.toString().padStart(4, '0')
      })
    })
  );
  Logger.outcome(`${quantity} record(s) ingested.`);
}

type IngestOptions = {
  clearData?: boolean;
};
