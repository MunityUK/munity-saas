import { assert } from 'chai';
import { describe, it } from 'mocha';

import { Complaint, ComplaintStatus } from '../../types';
import { calculateStationScores } from '../../utils/functions';

const STATION_NAME = 'Station';
const DATE_OF_COMPLAINT = new Date(2000, 0, 1);
const DATE_OF_ADDRESSAL = new Date(2000, 0, 15);
const DATE_OF_RESOLUTION = new Date(2000, 0, 31);

describe('ComRank Tests', function () {
  it('Given all complaints unaddressed', function () {
    const complaints = createComplaints(5, {
      station: STATION_NAME,
      status: ComplaintStatus.UNADDRESSED,
      dateOfComplaint: DATE_OF_COMPLAINT,
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

  it('Given all complaints addressed', function () {
    const complaints = createComplaints(5, {
      station: STATION_NAME,
      status: ComplaintStatus.ADDRESSED,
      dateOfComplaint: DATE_OF_COMPLAINT,
      dateOfAddressal: DATE_OF_ADDRESSAL,
      dateOfResolution: undefined
    });

    const scores = calculateStationScores(complaints)[STATION_NAME];
    assert.strictEqual(scores.percentageAddressed, '100%');
    assert.strictEqual(scores.percentageResolved, '0%');
    assert.strictEqual(scores.averageAddressalTime, '14 days');
    assert.isNull(scores.averageResolutionTime);
    assert.strictEqual(scores.finalScore, 80);
  });

  it('Given all complaints resolved', function () {
    const complaints = createComplaints(5, {
      station: STATION_NAME,
      status: ComplaintStatus.RESOLVED,
      dateOfComplaint: DATE_OF_COMPLAINT,
      dateOfAddressal: DATE_OF_ADDRESSAL,
      dateOfResolution: DATE_OF_RESOLUTION
    });

    const scores = calculateStationScores(complaints)[STATION_NAME];
    assert.strictEqual(scores.percentageAddressed, '100%');
    assert.strictEqual(scores.percentageResolved, '100%');
    assert.strictEqual(scores.averageAddressalTime, '14 days');
    assert.strictEqual(scores.averageResolutionTime, '16 days');
    assert.strictEqual(scores.finalScore, 100);
  });

  it('Given all complaints resolved with delay', function () {
    const complaints = createComplaints(5, {
      station: STATION_NAME,
      status: ComplaintStatus.RESOLVED,
      dateOfComplaint: DATE_OF_COMPLAINT,
      dateOfAddressal: new Date(2000, 3, 1),
      dateOfResolution: new Date(2000, 5, 1)
    });

    const scores = calculateStationScores(complaints)[STATION_NAME];
    assert.strictEqual(scores.percentageAddressed, '100%');
    assert.strictEqual(scores.percentageResolved, '100%');
    assert.strictEqual(scores.averageAddressalTime, '90 days');
    assert.strictEqual(scores.averageResolutionTime, '61 days');
    assert.strictEqual(scores.finalScore, 75.6);
  });

  it('Given a mix of complaint statuses', function () {
    const complaintsUnaddressed = createComplaints(1, {
      station: STATION_NAME,
      status: ComplaintStatus.UNADDRESSED,
      dateOfComplaint: DATE_OF_COMPLAINT,
      dateOfAddressal: undefined,
      dateOfResolution: undefined
    });

    const complaintsAddressed = createComplaints(2, {
      station: STATION_NAME,
      status: ComplaintStatus.ADDRESSED,
      dateOfComplaint: DATE_OF_COMPLAINT,
      dateOfAddressal: DATE_OF_ADDRESSAL,
      dateOfResolution: undefined
    });

    const complaintsResolved = createComplaints(2, {
      station: STATION_NAME,
      status: ComplaintStatus.RESOLVED,
      dateOfComplaint: DATE_OF_COMPLAINT,
      dateOfAddressal: DATE_OF_ADDRESSAL,
      dateOfResolution: DATE_OF_RESOLUTION
    });

    const complaints = [].concat(
      complaintsUnaddressed,
      complaintsAddressed,
      complaintsResolved
    );

    const scores = calculateStationScores(complaints)[STATION_NAME];
    assert.strictEqual(scores.percentageAddressed, '80%');
    assert.strictEqual(scores.percentageResolved, '40%');
    assert.strictEqual(scores.averageAddressalTime, '14 days');
    assert.strictEqual(scores.averageResolutionTime, '16 days');
    assert.strictEqual(scores.finalScore, 78);
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
