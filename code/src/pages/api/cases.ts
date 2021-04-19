import { NextApiRequest, NextApiResponse } from 'next';
import airtable from 'src/utils/airtable';

const TABLE_NAME = 'Cases';

export default async function (_req: NextApiRequest, res: NextApiResponse) {
  try {
    const records = await getCases();
    res.status(200).json({ records });
  } catch (err) {
    const { message, statusCode } = err;
    res.status(statusCode).json({ message });
  }
}

export async function getCases() {
  const records = airtable(TABLE_NAME).select().all();
  return records;
}
