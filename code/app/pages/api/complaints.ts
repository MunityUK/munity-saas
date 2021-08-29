import { Complaint, MunityDB, DB_TABLE, DB_SCHEMA } from '@munity/utils';
import Knex from 'knex';
import { NextApiRequest, NextApiResponse } from 'next';

const knex = Knex<Complaint, Complaint[]>({
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST!,
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
    database: DB_SCHEMA
  }
});
const conn = new MunityDB(knex as any);

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
