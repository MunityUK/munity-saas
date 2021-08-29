import { Complaint } from '@munity/utils';
import MunityDB, { DB_SCHEMA, DB_TABLE } from '@munity/utils/dist/database';
import Knex from 'knex';
import { NextApiRequest, NextApiResponse } from 'next';

// const knex = MunityDB.default({
//   host: process.env.MYSQL_HOST!,
//   user: process.env.MYSQL_USER!,
//   password: process.env.MYSQL_PASSWORD!,
//   database: MunityDB.DB_SCHEMA
// });
const knex = Knex<Complaint, Complaint[]>({
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST!,
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
    database: DB_SCHEMA
  }
});
const conn = new MunityDB(knex);

export default async function (_: NextApiRequest, res: NextApiResponse) {
  try {
    const complaints = await getComplaints();
    res.status(200).json({ complaints });
  } catch (err) {
    const { message, statusCode } = err;
    res.status(statusCode).json({ message });
  }
}

export function getComplaints() {
  return conn.getAllComplaints(DB_TABLE);
}
