import knex, { DB_SCHEMA } from '../knex';
import { Complaint } from '../types';

export function createTables(dbTable: string) {
  return knex.schema
    .withSchema(DB_SCHEMA)
    .dropTableIfExists(dbTable)
    .createTable(dbTable, (table) => {
      table.increments('id');
      table.string('complaintId', 15).unique();
      table.string('station', 100);
      table.string('force', 50);
      table.dateTime('dateComplaintMade');
      table.dateTime('dateUnderInvestigation');
      table.dateTime('dateResolved');
      table.string('incidentType', 20);
      table.text('incidentDescription');
      table.string('status', 20);
      table.string('city', 50);
      table.string('county', 50);
      table.decimal('latitude', 18, 15);
      table.decimal('longitude', 18, 15);
      table.json('complainants');
      table.json('officers');
      table.text('notes');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
}

export function insertComplaints(tableName: string, complaints: Complaint[]) {
  return knex(tableName).insert(complaints);
}
