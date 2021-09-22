import { assert } from 'chai';
import { addDays } from 'date-fns';
import { describe, it } from 'mocha';

import { Complaint, ComplaintStatus, Station } from '../../src/types';

const STATION_NAME = 'Station';
const COMPLAINT_COUNT = 5;
const START_DATE = new Date(2000, 0, 1);
const END_DATE = addDays(START_DATE, COMPLAINT_COUNT);

describe('Score Tracking Tests', function () {
  it('Given five complaints a day apart', function () {
    const complaints = Complaint.create({
      quantity: COMPLAINT_COUNT,
      overrider: (_, i) => {
        const overrides: Complaint = {};
        overrides.station = STATION_NAME;
        overrides.status = ComplaintStatus.RESOLVED;
        overrides.dateComplaintMade = addDays(START_DATE, i);
        overrides.dateUnderInvestigation = addDays(
          overrides.dateComplaintMade,
          1
        );
        overrides.dateResolved = addDays(overrides.dateUnderInvestigation, 1);
        return overrides;
      }
    });

    const stationScoresByMonth = Station.trackScores(
      complaints,
      START_DATE,
      END_DATE
    );

    assert.hasAllKeys(stationScoresByMonth, [STATION_NAME]);
    assert.deepPropertyVal(stationScoresByMonth, STATION_NAME, {
      '2000-01': 100
    });
  });
});
