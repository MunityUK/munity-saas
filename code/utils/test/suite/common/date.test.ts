import { assert } from 'chai';
import { describe, it } from 'mocha';

import { isDateInRange } from '../../../src/functions/common';

const DEFAULT_START_DATE = new Date(2000, 0, 1);
const DEFAULT_END_DATE = new Date(2000, 11, 1);

describe('Date Range Tests', function () {
  it('Given date is within range', function () {
    assertDate(new Date(2000, 3, 1), false);
  });

  it('Given date is after start date, no end date provided, no strict', function () {
    assertDate(new Date(2001, 0, 1), true, { endDate: null });
  });

  it('Given date is before end date, no start date provided, no strict', function () {
    assertDate(new Date(1999, 11, 1), true, { startDate: null });
  });

  it('Given date is after start date, with strict', function () {
    assertDate(new Date(2001, 0, 1), false, { strict: true });
  });

  it('Given date is before end date, with strict', function () {
    assertDate(new Date(1999, 11, 1), false, { strict: true });
  });

  it('Given date is on start date, no inclusive', function () {
    assertDate(new Date(2000, 0, 1), false);
  });

  it('Given date is on end date, no inclusive', function () {
    assertDate(new Date(2000, 11, 1), false);
  });

  it('Given date is on start date, with inclusive', function () {
    assertDate(new Date(2000, 0, 1), true, { inclusive: true });
  });

  it('Given date is on end date, with inclusive', function () {
    assertDate(new Date(2000, 11, 1), true, { inclusive: true });
  });
});

/**
 * Asserts that a specified date is in range.
 * @param date The specified date to test.
 * @param shouldPass Whether the test is expected to pass or not.
 * @param options Options and overrides for the date range function.
 */
function assertDate(
  date: Date,
  shouldPass: boolean,
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
    shouldPass
  );
}

type DateAssertionOptions = {
  startDate?: Date;
  endDate?: Date;
  strict?: boolean;
  inclusive?: boolean;
};
