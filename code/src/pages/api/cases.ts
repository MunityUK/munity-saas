import { NextApiRequest, NextApiResponse } from 'next';

import airtable from 'src/utils/airtable';

const TABLE_NAME = 'Cases';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const records = await getCases();
      res.status(200).json({ records });
    } else if (req.method === 'POST') {
      const { cases } = JSON.parse(req.body);
      const records = await createCases(cases);
      res.status(201).json({ records });
    }
  } catch (err) {
    const { message, statusCode } = err;
    res.status(statusCode).json({ message });
  }
}

export async function getCases() {
  return airtable(TABLE_NAME).select().all();
}

export async function createCases(cases: any[]) {
  return airtable(TABLE_NAME).create(cases);
}
