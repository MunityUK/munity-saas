import Airtable from 'airtable';

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
  endpointUrl: 'https://api.airtable.com',
});
const base = airtable.base(process.env.AIRTABLE_BASE);

export default base;