import airtable from 'utils/airtable';
import { NextApiRequest, NextApiResponse } from 'next';

const TABLE_NAME = 'Table 1';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const records = await airtable(TABLE_NAME).select().all();
  res.status(200).json({ records });
};
