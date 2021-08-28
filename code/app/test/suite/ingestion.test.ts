import { assert } from 'chai';
import { describe, it } from 'mocha';

import { createTables, insertComplaints } from '../../../utils/functions/database';
import { tryCatch } from '../../../utils/functions/test';
import knex, { DB_SCHEMA, DB_TABLE_TEST } from '../../../utils/knex';
import { Complaint, ComplaintStatus } from '../../../utils/types';

describe('Database Tests', function () {
  it(
    'Create test table',
    tryCatch(async () => {
      await createTables(DB_TABLE_TEST);
      const tableExists = await knex.schema
        .withSchema(DB_SCHEMA)
        .hasTable(DB_TABLE_TEST);
      assert.isTrue(tableExists, `Expected table '${DB_TABLE_TEST}' to exist.`);
    })
  );

  it(
    'Ingest data into test table',
    tryCatch(async () => {
      await insertComplaints(DB_TABLE_TEST, [
        Complaint.random({ status: ComplaintStatus.RESOLVED })
      ]);
      const res = await knex(DB_TABLE_TEST).count();
      const size = res[0]['count(*)'];
      assert.equal(size, 1);
    })
  );
});
