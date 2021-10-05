import { assert } from 'chai';
import { describe, it } from 'mocha';

import {
  DateRangeVerificationOptions,
  formatDate,
  isDateInRange
} from '../../../src/functions/common';

const DEFAULT_START_DATE = new Date(2000, 0, 1);
const DEFAULT_END_DATE = new Date(2000, 11, 1);

describe('Date Range Tests', function () {
  it('Given date is within range', function () {
    const date = new Date(2000, 3, 1);
    const clause = 'when between start date and end date.';
    assertDate(date, true, clause);
  });

  it('Given date is after start date, no end date provided, no strict', function () {
    const date = new Date(2001, 0, 1);
    const clause = 'when after start date where no end date is provided.';
    assertDate(date, true, clause, { endDate: null });
  });

  it('Given date is before end date, no start date provided, no strict', function () {
    const date = new Date(1999, 11, 1);
    const clause = 'when before end date where no start date is provided.';
    assertDate(date, true, clause, { startDate: null });
  });

  it('Given date is after start date, with strict', function () {
    const date = new Date(2001, 0, 1);
    const clause = "when after start date and 'strict' is 'true'.";
    assertDate(date, false, clause, { strict: true });
  });

  it('Given date is before end date, with strict', function () {
    const date = new Date(1999, 11, 1);
    const clause = "when before end date and 'strict' is 'true'.";
    assertDate(date, false, clause, { strict: true });
  });

  it('Given date is on start date, no inclusive', function () {
    const date = new Date(2000, 0, 1);
    const clause = "when on start date and 'inclusive' is 'false'.";
    assertDate(date, false, clause);
  });

  it('Given date is on end date, no inclusive', function () {
    const date = new Date(2000, 11, 1);
    const clause = "when on end date and 'inclusive' is 'false'.";
    assertDate(date, false, clause);
  });

  it('Given date is on start date, with inclusive', function () {
    const date = new Date(2000, 0, 1);
    const clause = "when on start date and 'inclusive' is 'true'.";
    assertDate(date, true, clause, { inclusive: true });
  });

  it('Given date is on end date, with inclusive', function () {
    const date = new Date(2000, 11, 1);
    const clause = "when on end date and 'inclusive' is 'true'.";
    assertDate(date, true, clause, { inclusive: true });
  });
});

/**
 * Asserts that a clauseified date is in range.
 * @param date The clauseified date to test.
 * @param shouldPass Whether the test is expected to pass or not.
 * @param options Options and overrides for the date range function.
 */
function assertDate(
  date: Date,
  shouldPass: boolean,
  clause: string,
  options: DateAssertionOptions = {}
) {
  const {
    startDate = DEFAULT_START_DATE,
    endDate = DEFAULT_END_DATE,
    strict = false,
    inclusive = false
  } = options;
  assert.equal(
    isDateInRange(
      date,
      {
        startDate,
        endDate
      },
      { inclusive, strict }
    ),
    shouldPass,
    `The function denies that ${formatDate(
      date,
      'yyyy-MM-dd'
    )} is within range ${clause}`
  );
}

interface DateAssertionOptions extends DateRangeVerificationOptions {
  startDate?: Date;
  endDate?: Date;
}
