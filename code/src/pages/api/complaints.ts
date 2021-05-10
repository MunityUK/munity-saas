import { NextApiRequest, NextApiResponse } from 'next';

import airtable from 'src/utils/airtable';

const TABLE_NAME = 'Complaints';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const records = await getComplaints();
      res.status(200).json({ records });
    } else if (req.method === 'POST') {
      const { complaints } = JSON.parse(req.body);
      const records = await createComplaints(complaints);
      res.status(201).json({ records });
    }
  } catch (err) {
    const { message, statusCode } = err;
    res.status(statusCode).json({ message });
  }
}

export async function getComplaints() {
  return airtable(TABLE_NAME).select().all();
}

export async function createComplaints(complaints: any[]) {
  return airtable(TABLE_NAME).create(complaints);
}
