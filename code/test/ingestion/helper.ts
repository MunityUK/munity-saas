import { Complaint } from '../../types';
import knex, { DB_SCHEMA } from '../../utils/knex';

export function createTable(dbTable: string) {
  return knex.schema
    .withSchema(DB_SCHEMA)
    .dropTableIfExists(dbTable)
    .createTable(dbTable, (table) => {
      table.increments('id', { primaryKey: true });
      table.string('reportId', 15);
      table.string('station', 100);
      table.string('force', 50);
      table.dateTime('startDate');
      table.dateTime('endDate');
      table.string('incidentType', 20);
      table.text('incidentDescription');
      table.string('status', 20);
      table.text('notes');
      table.string('city', 50);
      table.string('county', 50);
      table.decimal('latitude', 18, 15);
      table.decimal('longitude', 18, 15);
      table.integer('complainantAge', 2).unsigned();
      table.string('complainantRace', 15);
      table.integer('complainantSex', 1).unsigned();
      table.string('officerId', 15);
      table.integer('officerAge', 2).unsigned();
      table.string('officerRace', 15);
      table.integer('officerSex', 1).unsigned();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
}

export function insertComplaints(table: string, complaints: Complaint[]) {
  return knex(table).insert(complaints);
}
