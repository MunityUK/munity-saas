import {
  Complaint,
  ComplaintStatus,
  MunityTest,
  DB_SCHEMA,
  DB_TABLE_TEST
} from '@munity/utils';
import { assert } from 'chai';
import { describe, it } from 'mocha';

import { conn } from '../../config';

describe('Database Tests', function () {
  it(
    'Create test table',
    MunityTest.tryCatch(async () => {
      await conn.createTables(DB_TABLE_TEST);
      const tableExists = await conn.conn.schema
        .withSchema(DB_SCHEMA)
        .hasTable(DB_TABLE_TEST);
      assert.isTrue(tableExists, `Expected table '${DB_TABLE_TEST}' to exist.`);
    })
  );

  it(
    'Ingest data into test table',
    MunityTest.tryCatch(async () => {
      await conn.insertComplaints(DB_TABLE_TEST, [
        Complaint.random({ status: ComplaintStatus.RESOLVED })
      ]);
      const res = await conn.conn(DB_TABLE_TEST).count();
      const size = res[0]['count(*)'];
      assert.equal(size, 1);
    })
  );
});
