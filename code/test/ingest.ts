import dotenv from 'dotenv';
dotenv.config();

import airtable from '../src/utils/airtable';

(async () => {
  const records = await airtable('CASES').create([
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
  console.log(records);
})();
