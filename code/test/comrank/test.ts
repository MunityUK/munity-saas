import { assert } from 'chai';
import { describe, it } from 'mocha';

import { Complaint, ComplaintStatus, StationScore } from '../../types';

const STATION_NAME = 'Station';
const DATE_OF_COMPLAINT = Date.UTC(2000, 0, 1);
const DATE_OF_ADDRESSAL = Date.UTC(2000, 0, 15);
const DATE_OF_RESOLUTION = Date.UTC(2000, 0, 31);

describe('ComRank Tests', function () {
  it('Given all complaints unaddressed', function () {
    const complaints = createComplaints(5, {
      station: STATION_NAME,
      status: ComplaintStatus.UNADDRESSED,
      dateOfComplaint: DATE_OF_COMPLAINT,
      dateOfAddressal: undefined,
      dateOfResolution: undefined
    });

    const score = Complaint.calculateStationScores(complaints)[STATION_NAME];

    const assertions: Assertions = [
      [ScoreProp.totalNumberOfComplaints, 5],
      [ScoreProp.numberOfComplaintsUnaddressed, 5],
      [ScoreProp.numberOfComplaintsAddressed, 0],
      [ScoreProp.numberOfComplaintsResolved, 0],
      [ScoreProp.percentageUnaddressed, '100%'],
      [ScoreProp.percentageAddressed, '0%'],
      [ScoreProp.percentageResolved, '0%'],
      [ScoreProp.percentageProgressed, '0%'],
      [ScoreProp.averageAddressalTime, null],
      [ScoreProp.averageResolutionTime, null],
      [ScoreProp.averageCaseDuration, null],
      [ScoreProp.finalScore, 30]
    ];

    runAssertions(score, assertions);
  });

  it('Given all complaints addressed', function () {
    const complaints = createComplaints(5, {
      station: STATION_NAME,
      status: ComplaintStatus.ADDRESSED,
      dateOfComplaint: DATE_OF_COMPLAINT,
      dateOfAddressal: DATE_OF_ADDRESSAL,
      dateOfResolution: undefined
    });

    const score = Complaint.calculateStationScores(complaints)[STATION_NAME];

    const assertions: Assertions = [
      [ScoreProp.totalNumberOfComplaints, 5],
      [ScoreProp.numberOfComplaintsUnaddressed, 0],
      [ScoreProp.numberOfComplaintsAddressed, 5],
      [ScoreProp.numberOfComplaintsResolved, 0],
      [ScoreProp.percentageUnaddressed, '0%'],
      [ScoreProp.percentageAddressed, '100%'],
      [ScoreProp.percentageResolved, '0%'],
      [ScoreProp.percentageProgressed, '100%'],
      [ScoreProp.averageAddressalTime, '14 days'],
      [ScoreProp.averageResolutionTime, null],
      [ScoreProp.averageCaseDuration, null],
      [ScoreProp.finalScore, 80]
    ];

    runAssertions(score, assertions);
  });

  it('Given all complaints resolved', function () {
    const complaints = createComplaints(5, {
      station: STATION_NAME,
      status: ComplaintStatus.RESOLVED,
      dateOfComplaint: DATE_OF_COMPLAINT,
      dateOfAddressal: DATE_OF_ADDRESSAL,
      dateOfResolution: DATE_OF_RESOLUTION
    });

    const score = Complaint.calculateStationScores(complaints)[STATION_NAME];

    const assertions: Assertions = [
      [ScoreProp.totalNumberOfComplaints, 5],
      [ScoreProp.numberOfComplaintsUnaddressed, 0],
      [ScoreProp.numberOfComplaintsAddressed, 0],
      [ScoreProp.numberOfComplaintsResolved, 5],
      [ScoreProp.percentageUnaddressed, '0%'],
      [ScoreProp.percentageAddressed, '0%'],
      [ScoreProp.percentageResolved, '100%'],
      [ScoreProp.percentageProgressed, '100%'],
      [ScoreProp.averageAddressalTime, '14 days'],
      [ScoreProp.averageResolutionTime, '16 days'],
      [ScoreProp.averageCaseDuration, '30 days'],
      [ScoreProp.finalScore, 100]
    ];

    runAssertions(score, assertions);
  });

  it('Given all complaints resolved with delay', function () {
    const complaints = createComplaints(5, {
      station: STATION_NAME,
      status: ComplaintStatus.RESOLVED,
      dateOfComplaint: DATE_OF_COMPLAINT,
      dateOfAddressal: Date.UTC(2000, 3, 1),
      dateOfResolution: Date.UTC(2000, 5, 1)
    });

    const score = Complaint.calculateStationScores(complaints)[STATION_NAME];

    const assertions: Assertions = [
      [ScoreProp.totalNumberOfComplaints, 5],
      [ScoreProp.numberOfComplaintsUnaddressed, 0],
      [ScoreProp.numberOfComplaintsAddressed, 0],
      [ScoreProp.numberOfComplaintsResolved, 5],
      [ScoreProp.percentageUnaddressed, '0%'],
      [ScoreProp.percentageAddressed, '0%'],
      [ScoreProp.percentageResolved, '100%'],
      [ScoreProp.percentageProgressed, '100%'],
      [ScoreProp.averageAddressalTime, '91 days'],
      [ScoreProp.averageResolutionTime, '61 days'],
      [ScoreProp.averageCaseDuration, '152 days'],
      [ScoreProp.finalScore, 75.6]
    ];

    runAssertions(score, assertions);
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

    const score = Complaint.calculateStationScores(complaints)[STATION_NAME];

    const assertions: Assertions = [
      [ScoreProp.totalNumberOfComplaints, 5],
      [ScoreProp.numberOfComplaintsUnaddressed, 1],
      [ScoreProp.numberOfComplaintsAddressed, 2],
      [ScoreProp.numberOfComplaintsResolved, 2],
      [ScoreProp.percentageUnaddressed, '20%'],
      [ScoreProp.percentageAddressed, '40%'],
      [ScoreProp.percentageResolved, '40%'],
      [ScoreProp.percentageProgressed, '80%'],
      [ScoreProp.averageAddressalTime, '14 days'],
      [ScoreProp.averageResolutionTime, '16 days'],
      [ScoreProp.averageCaseDuration, '30 days'],
      [ScoreProp.finalScore, 78]
    ];

    runAssertions(score, assertions);
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

/**
 * Runs the constructed score assertions.
 * @param score The station score.
 * @param assertions The list of assertions.
 */
function runAssertions(score: StationScore, assertions: Assertions) {
  assertions.forEach(([field, actual]) => {
    assertThat(score[field], actual, field);
  });
}

/**
 * Asserts that given values are strictly equal.
 * @param actual The actual value.
 * @param expected The expected value.
 * @param fieldName The name of the score field to assert.
 */
function assertThat<T>(actual: T, expected: T, fieldName: string) {
  const message = `Expected ${fieldName} to equal '${expected}' but was '${actual}'.`;
  assert.strictEqual(actual, expected, message);
}

const ScoreProp: { [key in keyof StationScore]: keyof StationScore } = {
  totalNumberOfComplaints: 'totalNumberOfComplaints',
  numberOfComplaintsUnaddressed: 'numberOfComplaintsUnaddressed',
  numberOfComplaintsAddressed: 'numberOfComplaintsAddressed',
  numberOfComplaintsResolved: 'numberOfComplaintsResolved',
  percentageUnaddressed: 'percentageUnaddressed',
  percentageAddressed: 'percentageAddressed',
  percentageResolved: 'percentageResolved',
  percentageProgressed: 'percentageProgressed',
  averageAddressalTime: 'averageAddressalTime',
  averageResolutionTime: 'averageResolutionTime',
  averageCaseDuration: 'averageCaseDuration',
  finalScore: 'finalScore'
};

type Assertions = Array<[keyof StationScore, unknown]>;
type ComplaintOverrides = { [key in keyof Complaint]: unknown };
