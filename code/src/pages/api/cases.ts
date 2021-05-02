import { NextApiRequest, NextApiResponse } from 'next';

import airtable from 'src/utils/airtable';

const TABLE_NAME = 'Cases';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const records = await getCases();
      res.status(200).json({ records });
    } else if (req.method === 'POST') {
      const records = await createCases();
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

export async function createCases() {
  return airtable(TABLE_NAME).create([
    {
      fields: {
        'Start date': '2020-10-07',
        Month: 'October',
        Year: '2020',
        'End date': '2020-10-07',
        'Date recorded by us': '2020-10-08',
        Demographic: 'Black ',
        'Incident type': 'Harrasment',
        'Coordinates Type': 'Standard',
        Country: 'United Kingdom',
        Region: 'South West',
        Borough: 'Easton',
        'City/Town': 'Bristol',
        'Court/Police report number': 1223423,
        Sources: 'www.bristolpost.co.uk',
        Description: 'Black Woman assualted by Bristol police',
        'Perpetrator (Station)': 'Trinity Police Station ',
        'Number of officers involved': 2,
        'Officer IDs': ['24B', '24C']
      }
    }
  ]);
}
