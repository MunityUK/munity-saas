import { Knex } from 'knex';

import { Complaint } from './types/classes/Complaint';

export const DB_SCHEMA = process.env.MYSQL_DATABASE!;
export const DB_TABLE = 'complaints';
export const DB_TABLE_TEST = 'complaints_test';

export class MunityDB {
  conn: Knex;

  constructor(knex: Knex) {
    this.conn = knex;
  }

  createTables(dbTable: string) {
    return this.conn.schema
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
        table.timestamp('createdAt').defaultTo(this.conn.fn.now());
      });
  }

  getAllComplaints(tableName: string): Promise<Complaint[]> {
    return this.conn(tableName).select<Array<Complaint>>();
  }

  insertComplaints(tableName: string, complaints: Complaint[]) {
    return this.conn(tableName).insert(complaints);
  }
}
