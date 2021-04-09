const airtable = require('../../utils/airtable');

const TABLE_NAME = 'Table 1';

export default async (req, res) => {
  const records = await airtable(TABLE_NAME).select().all();
  res.status(200).json({ records });
};
