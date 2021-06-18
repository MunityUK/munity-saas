import { assert } from 'chai';
import { describe, it } from 'mocha';

import { Complaint, ComplaintStatus } from '../../types';
import { calculateStationScores, round } from '../../utils/functions';

const STATION_NAME = 'Station';

describe('ComRank Tests', function () {
  it('Calculate station scores', function () {
    const expNumOfComplaints = 5;

    let numOfAddressed = 0;
    let numOfResolved = 0;

    const complaints: Complaint[] = [];

    for (let i = 0; i < expNumOfComplaints; i++) {
      const complaint = Complaint.random();
      complaint.station = STATION_NAME;
      complaint.dateOfComplaint = new Date(2000, 0, 1);

      if (complaint.status === ComplaintStatus.ADDRESSED) {
        complaint.dateOfAddressal = new Date(2000, 0, 15);
        numOfAddressed++;
      } else if (complaint.status === ComplaintStatus.RESOLVED) {
        complaint.dateOfAddressal = new Date(2000, 0, 15);
        complaint.dateOfResolution = new Date(2000, 0, 31);
        numOfAddressed++;
        numOfResolved++;
      }

      complaints.push(complaint);
    }

    const expPctAddressed =
      round((numOfAddressed / expNumOfComplaints) * 100) + '%';
    const expPctResolved =
      round((numOfResolved / expNumOfComplaints) * 100) + '%';

    const scores = calculateStationScores(complaints)[STATION_NAME];
    assert.strictEqual(scores.numberOfComplaints, expNumOfComplaints);
    assert.strictEqual(scores.percentageAddressed, expPctAddressed);
    assert.strictEqual(scores.percentageResolved, expPctResolved);
    assert.strictEqual(scores.averageAddressalTime, '14 days');
    assert.strictEqual(scores.averageResolutionTime, '30 days');
  });

  it('Given all complaints unaddressed', function () {
    const complaints = createComplaints(5, {
      station: STATION_NAME,
      status: ComplaintStatus.UNADDRESSED,
      dateOfComplaint: new Date(2000, 0, 1),
      dateOfAddressal: undefined,
      dateOfResolution: undefined
    });

    const scores = calculateStationScores(complaints)[STATION_NAME];
    assert.strictEqual(scores.percentageAddressed, '0%');
    assert.strictEqual(scores.percentageResolved, '0%');
    assert.isNull(scores.averageAddressalTime);
    assert.isNull(scores.averageResolutionTime);
    assert.strictEqual(scores.finalScore, 30);
  });

  it('Given all complaints resolved', function () {
    const complaints = createComplaints(5, {
      station: STATION_NAME,
      status: ComplaintStatus.RESOLVED,
      dateOfComplaint: new Date(2000, 0, 1),
      dateOfAddressal: new Date(2000, 0, 15),
      dateOfResolution: new Date(2000, 0, 31)
    });

    const scores = calculateStationScores(complaints)[STATION_NAME];
    assert.strictEqual(scores.percentageAddressed, '100%');
    assert.strictEqual(scores.percentageResolved, '100%');
    assert.strictEqual(scores.averageAddressalTime, '14 days');
    assert.strictEqual(scores.averageResolutionTime, '30 days');
    assert.strictEqual(scores.finalScore, 100);
  });
});

/**
 * Create a specified number of complaints.
 * @param quantity The quantity of complaints to create.
 * @param overrides The property overrides for each complaint.
 * @returns A list of complaints.
 */
function createComplaints(quantity: number, overrides: ComplaintOverrides) {
  const complaints: Complaint[] = [];

  for (let i = 0; i < quantity; i++) {
    const complaint = Object.assign(Complaint.random(), overrides);
    complaints.push(complaint);
  }

  return complaints;
}

type ComplaintOverrides = { [key in keyof Complaint]: unknown };
