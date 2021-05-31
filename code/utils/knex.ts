import dotenv from 'dotenv';

import Knex from 'knex';

dotenv.config();

export const DB_SCHEMA = 'voicera';
export const DB_TABLE = 'complaints';
export const DB_TABLE_TEST = 'complaints_test';

export default Knex({
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }
});