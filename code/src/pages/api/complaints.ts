import { NextApiRequest, NextApiResponse } from 'next';

import airtable from 'src/utils/airtable';

const TABLE_NAME = 'Complaints';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { complaints } = req.body;
        const records = await createComplaints(complaints);
        res.status(201).json({ complaints: records });
        break;
      }
      default: {
        const complaints = await getComplaints();
        res.status(200).json({ complaints });
      }
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
