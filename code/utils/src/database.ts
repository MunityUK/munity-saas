import { Knex } from 'knex';

export const DB_SCHEMA = process.env.MYSQL_DATABASE!;
export const DB_TABLE = 'complaints';
export const DB_TABLE_TEST = 'complaints_test';

export class MunityDB {
  conn: Knex;

  constructor(knex: Knex) {
    this.conn = knex;
  }

  /**
   * Creates the database tables.
   * @param tableName The name of the table to create.
   * @returns A promise.
   */
  createTable(tableName: string) {
    return this.conn.schema
      .withSchema(DB_SCHEMA)
      .dropTableIfExists(tableName)
      .createTable(tableName, (table) => {
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

  /**
   * Clears all data from a specified table.
   * @param tableName The name of the table to truncate.
   * @returns A promise.
   */
  truncateTable(tableName: string) {
    return this.conn(tableName).truncate();
  }

  /**
   * Retrieves all records from the table.
   * @param tableName The name of the table to query.
   * @returns A promise.
   */
  getAllRecords<T>(tableName: string): Promise<T[]> {
    return this.conn(tableName).select();
  }

  /**
   * Inserts records into the specified table.
   * @param tableName The name of the table to insert records into.
   * @param records The list of records to insert.
   * @returns A promise.
   */
  insertRecords<T>(tableName: string, records: T[]) {
    return this.conn(tableName).insert(records);
  }
}
