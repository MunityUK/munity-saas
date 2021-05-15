import dotenv from 'dotenv';
import Knex from 'knex';

import Complaint from '../../src/classes';

dotenv.config();
const knex = Knex({
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }
});

const SCHEMA = 'voicera';
const TABLE = 'complaints';
const NUM_OF_RECORDS = 100;

(async () => {
  try {
    await createTables();
    console.info('Table created.');

    await ingestData();
    console.info(`${NUM_OF_RECORDS} records ingested.`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();

function createTables() {
  return knex.schema
    .withSchema(SCHEMA)
    .dropTableIfExists(TABLE)
    .createTable(TABLE, (table) => {
      table.increments('id', { primaryKey: true });
      table.string('reportId', 15);
      table.string('station', 100);
      table.dateTime('startDate');
      table.dateTime('endDate');
      table.string('incidentType', 20);
      table.text('incidentDescription');
      table.string('outcome', 20);
      table.text('outcomeDescription');
      table.string('city', 50);
      table.string('county', 50);
      table.decimal('latitude', 18, 15);
      table.decimal('longitude', 18, 15);
      table.integer('victimAge', 2);
      table.string('victimRace', 15);
      table.integer('victimSex', 1);
      table.string('officerId', 15);
      table.integer('officerAge', 2);
      table.string('officerRace', 15);
      table.integer('officerSex', 1);
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
}

function ingestData() {
  const complaints: Complaint[] = [];

  for (let i = 1; i <= NUM_OF_RECORDS; i++) {
    const complaint = Complaint.random();
    complaint.reportId = 'COM' + i.toString().padStart(4, '0');
    complaints.push(complaint);
  }

  return knex(TABLE).insert(complaints);
}
