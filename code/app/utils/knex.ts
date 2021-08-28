import dotenv from 'dotenv';

import path from 'path';

import Knex from 'knex';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const DB_SCHEMA = process.env.MYSQL_DATABASE!;
export const DB_TABLE = 'complaints';
export const DB_TABLE_TEST = 'complaints_test';

export default Knex({
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: DB_SCHEMA
  }
});
