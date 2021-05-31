import dotenv from 'dotenv';

import Knex from 'knex';

dotenv.config();

export const DB_SCHEMA = 'voicera';
export const DB_TABLE = 'complaints';
export const DB_TABLE_TEST = 'complaints_test';

export default Knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'voicera',
    password: 'voicera',
    database: 'voicera'
  }
});