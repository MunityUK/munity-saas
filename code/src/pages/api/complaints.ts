import Knex from 'knex';
import { NextApiRequest, NextApiResponse } from 'next';

const knex = Knex({
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }
});

const TABLE_NAME = 'complaints';

export default async function (_: NextApiRequest, res: NextApiResponse) {
  try {
    const complaints = await getComplaints();
    res.status(200).json({ complaints });
  } catch (err) {
    const { message, statusCode } = err;
    res.status(statusCode).json({ message });
  }
}

export async function getComplaints() {
  return knex(TABLE_NAME).select();
}
