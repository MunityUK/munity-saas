import airtable from 'utils/airtable';
import { NextApiRequest, NextApiResponse } from 'next';

const TABLE_NAME = 'Table 1';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const records = await airtable(TABLE_NAME).select().all();
    res.status(200).json({ records });
  } catch (err) {
    const { message, statusCode } = err;
    res.status(statusCode).json({ message });
  }
};
