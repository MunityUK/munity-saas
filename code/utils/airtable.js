const Airtable = require('airtable');

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
  endpointUrl: 'https://api.airtable.com',
});
const base = Airtable.base(process.env.AIRTABLE_BASE);

module.exports = base;