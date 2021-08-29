import { Complaint, MunityDB } from '@munity/utils';
import dotenv from 'dotenv';
import Knex from 'knex';

dotenv.config();

const knex = Knex<Complaint, Complaint[]>({
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST!,
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
    database: process.env.MYSQL_DATABASE!
  }
});

export const conn = new MunityDB(knex as any);
