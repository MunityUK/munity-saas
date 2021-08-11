import { assert } from 'chai';
import { describe, it } from 'mocha';

import { createTables } from './helper';

import knex, { DB_SCHEMA, DB_TABLE_TEST } from '../../utils/knex';

describe('Ingestion Tests', function () {
  it('Create table', async function () {
    await createTables(DB_TABLE_TEST);
    const tableExists = await knex.schema
      .withSchema(DB_SCHEMA)
      .hasTable(DB_TABLE_TEST);
    assert.isTrue(tableExists, `Expected table '${DB_TABLE_TEST}' to exist.`);
  });
});
