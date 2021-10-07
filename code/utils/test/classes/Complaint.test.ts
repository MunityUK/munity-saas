import { assert } from 'chai';
import { describe, it } from 'mocha';

import {
  Complaint,
  ComplaintStatus,
  CreateComplaintOptions
} from '../../src/classes/Complaint';

describe('Complaint Validation Tests', function () {
  it('Given valid complaint', function () {
    assert.doesNotThrow(function () {
      Complaint.create();
    });
  });

  const tests: [string, CreateComplaintOptions][] = [
    [
      'Given complaint with invalid status',
      {
        overrider: () => ({
          status: 'hello' as ComplaintStatus
        })
      }
    ],
    [
      'Given complaint with no date',
      {
        overrider: () => ({
          dateComplaintMade: undefined
        })
      }
    ],
    [
      'Given unaddressed complaint has date under investigation',
      {
        status: ComplaintStatus.UNADDRESSED,
        overrider: () => ({
          dateUnderInvestigation: new Date(2000)
        })
      }
    ],
    [
      'Given unaddressed complaint has date of resolution',
      {
        status: ComplaintStatus.UNADDRESSED,
        overrider: () => ({
          dateResolved: new Date(2000)
        })
      }
    ],
    [
      'Given complaint under investigation has no date of investigation',
      {
        status: ComplaintStatus.INVESTIGATING,
        overrider: () => ({
          dateUnderInvestigation: undefined
        })
      }
    ],
    [
      'Given complaint under investigation has date of resolution',
      {
        status: ComplaintStatus.INVESTIGATING,
        overrider: () => ({
          dateResolved: new Date(2000)
        })
      }
    ],
    [
      "Given complaint's date under investigation is before the date of complaint",
      {
        status: ComplaintStatus.INVESTIGATING,
        overrider: () => ({
          dateComplaintMade: new Date(2000),
          dateUnderInvestigation: new Date(1999)
        })
      }
    ],
    [
      'Given resolved complaint has no date of resolution',
      {
        status: ComplaintStatus.RESOLVED,
        overrider: () => ({
          dateResolved: new Date(2000)
        })
      }
    ],
    [
      "Given complaint's date of resolution is before date under investigation",
      {
        status: ComplaintStatus.RESOLVED,
        overrider: () => ({
          dateUnderInvestigation: new Date(2000),
          dateResolved: new Date(1996)
        })
      }
    ]
  ];

  tests.forEach(([testName, options]) => {
    it(testName, function () {
      assert.throws(() => Complaint.create(options));
    });
  });
});
