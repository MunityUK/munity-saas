import { assert } from 'chai';
import { describe, it } from 'mocha';

import { Complaint, ComplaintStatus, StationScore } from '../../src/index';

const STATION_NAME = 'Station';
const DATE_COMPLAINT = Date.UTC(2000, 0, 1);
const DATE_INVESTIGATING = Date.UTC(2000, 0, 15);
const DATE_RESOLVED = Date.UTC(2000, 0, 31);

const ScoreProp: { [key in keyof StationScore]: keyof StationScore } = {
  totalNumberOfComplaints: 'totalNumberOfComplaints',
  numberOfComplaintsUnaddressed: 'numberOfComplaintsUnaddressed',
  numberOfComplaintsInvestigating: 'numberOfComplaintsInvestigating',
  numberOfComplaintsResolved: 'numberOfComplaintsResolved',
  percentageUnaddressed: 'percentageUnaddressed',
  percentageInvestigating: 'percentageInvestigating',
  percentageResolved: 'percentageResolved',
  percentageAttendedTo: 'percentageAttendedTo',
  averageInvestigationTime: 'averageInvestigationTime',
  averageResolutionTime: 'averageResolutionTime',
  averageCaseDuration: 'averageCaseDuration',
  finalScore: 'finalScore'
};

describe('Station Score Tests', function () {
  it('Given all complaints unaddressed', function () {
    const complaints = Complaint.createMultiple(5, {
      station: STATION_NAME,
      status: ComplaintStatus.UNADDRESSED,
      dateComplaintMade: DATE_COMPLAINT,
      dateUnderInvestigation: undefined,
      dateResolved: undefined
    });

    const score = Complaint.calculateStationScores(complaints)[STATION_NAME];

    const assertions: ScoreAssertions = [
      [ScoreProp.totalNumberOfComplaints!, 5],
      [ScoreProp.numberOfComplaintsUnaddressed!, 5],
      [ScoreProp.numberOfComplaintsInvestigating!, 0],
      [ScoreProp.numberOfComplaintsResolved!, 0],
      [ScoreProp.percentageUnaddressed!, '100%'],
      [ScoreProp.percentageInvestigating!, '0%'],
      [ScoreProp.percentageResolved!, '0%'],
      [ScoreProp.percentageAttendedTo!, '0%'],
      [ScoreProp.averageInvestigationTime!, null],
      [ScoreProp.averageResolutionTime!, null],
      [ScoreProp.averageCaseDuration!, null],
      [ScoreProp.finalScore!, 30]
    ];

    runAssertions(score, assertions);
  });

  it('Given all complaints under investigation', function () {
    const complaints = Complaint.createMultiple(5, {
      station: STATION_NAME,
      status: ComplaintStatus.INVESTIGATING,
      dateComplaintMade: DATE_COMPLAINT,
      dateUnderInvestigation: DATE_INVESTIGATING,
      dateResolved: undefined
    });

    const score = Complaint.calculateStationScores(complaints)[STATION_NAME];

    const assertions: ScoreAssertions = [
      [ScoreProp.totalNumberOfComplaints!, 5],
      [ScoreProp.numberOfComplaintsUnaddressed!, 0],
      [ScoreProp.numberOfComplaintsInvestigating!, 5],
      [ScoreProp.numberOfComplaintsResolved!, 0],
      [ScoreProp.percentageUnaddressed!, '0%'],
      [ScoreProp.percentageInvestigating!, '100%'],
      [ScoreProp.percentageResolved!, '0%'],
      [ScoreProp.percentageAttendedTo!, '100%'],
      [ScoreProp.averageInvestigationTime!, '14 days'],
      [ScoreProp.averageResolutionTime!, null],
      [ScoreProp.averageCaseDuration!, null],
      [ScoreProp.finalScore!, 80]
    ];

    runAssertions(score, assertions);
  });

  it('Given all complaints resolved', function () {
    const complaints = Complaint.createMultiple(5, {
      station: STATION_NAME,
      status: ComplaintStatus.RESOLVED,
      dateComplaintMade: DATE_COMPLAINT,
      dateUnderInvestigation: DATE_INVESTIGATING,
      dateResolved: DATE_RESOLVED
    });

    const score = Complaint.calculateStationScores(complaints)[STATION_NAME];

    const assertions: ScoreAssertions = [
      [ScoreProp.totalNumberOfComplaints!, 5],
      [ScoreProp.numberOfComplaintsUnaddressed!, 0],
      [ScoreProp.numberOfComplaintsInvestigating!, 0],
      [ScoreProp.numberOfComplaintsResolved!, 5],
      [ScoreProp.percentageUnaddressed!, '0%'],
      [ScoreProp.percentageInvestigating!, '0%'],
      [ScoreProp.percentageResolved!, '100%'],
      [ScoreProp.percentageAttendedTo!, '100%'],
      [ScoreProp.averageInvestigationTime!, '14 days'],
      [ScoreProp.averageResolutionTime!, '16 days'],
      [ScoreProp.averageCaseDuration!, '30 days'],
      [ScoreProp.finalScore!, 100]
    ];

    runAssertions(score, assertions);
  });

  it('Given all complaints resolved with delay', function () {
    const complaints = Complaint.createMultiple(5, {
      station: STATION_NAME,
      status: ComplaintStatus.RESOLVED,
      dateComplaintMade: DATE_COMPLAINT,
      dateUnderInvestigation: new Date(Date.UTC(2000, 3, 1)),
      dateResolved: new Date(Date.UTC(2000, 5, 1))
    });

    const score = Complaint.calculateStationScores(complaints)[STATION_NAME];

    const assertions: ScoreAssertions = [
      [ScoreProp.totalNumberOfComplaints!, 5],
      [ScoreProp.numberOfComplaintsUnaddressed!, 0],
      [ScoreProp.numberOfComplaintsInvestigating!, 0],
      [ScoreProp.numberOfComplaintsResolved!, 5],
      [ScoreProp.percentageUnaddressed!, '0%'],
      [ScoreProp.percentageInvestigating!, '0%'],
      [ScoreProp.percentageResolved!, '100%'],
      [ScoreProp.percentageAttendedTo!, '100%'],
      [ScoreProp.averageInvestigationTime!, '91 days'],
      [ScoreProp.averageResolutionTime!, '61 days'],
      [ScoreProp.averageCaseDuration!, '152 days'],
      [ScoreProp.finalScore!, 75.6]
    ];

    runAssertions(score, assertions);
  });

  it('Given a mix of complaint statuses', function () {
    const complaintsUnaddressed = Complaint.createMultiple(1, {
      station: STATION_NAME,
      status: ComplaintStatus.UNADDRESSED,
      dateComplaintMade: DATE_COMPLAINT,
      dateUnderInvestigation: undefined,
      dateResolved: undefined
    });

    const complaintsInvestigating = Complaint.createMultiple(2, {
      station: STATION_NAME,
      status: ComplaintStatus.INVESTIGATING,
      dateComplaintMade: DATE_COMPLAINT,
      dateUnderInvestigation: DATE_INVESTIGATING,
      dateResolved: undefined
    });

    const complaintsResolved = Complaint.createMultiple(2, {
      station: STATION_NAME,
      status: ComplaintStatus.RESOLVED,
      dateComplaintMade: DATE_COMPLAINT,
      dateUnderInvestigation: DATE_INVESTIGATING,
      dateResolved: DATE_RESOLVED
    });

    const complaints = complaintsUnaddressed.concat(
      complaintsInvestigating,
      complaintsResolved
    );

    const score = Complaint.calculateStationScores(complaints)[STATION_NAME];

    const assertions: ScoreAssertions = [
      [ScoreProp.totalNumberOfComplaints!, 5],
      [ScoreProp.numberOfComplaintsUnaddressed!, 1],
      [ScoreProp.numberOfComplaintsInvestigating!, 2],
      [ScoreProp.numberOfComplaintsResolved!, 2],
      [ScoreProp.percentageUnaddressed!, '20%'],
      [ScoreProp.percentageInvestigating!, '40%'],
      [ScoreProp.percentageResolved!, '40%'],
      [ScoreProp.percentageAttendedTo!, '80%'],
      [ScoreProp.averageInvestigationTime!, '14 days'],
      [ScoreProp.averageResolutionTime!, '16 days'],
      [ScoreProp.averageCaseDuration!, '30 days'],
      [ScoreProp.finalScore!, 78]
    ];

    runAssertions(score, assertions);
  });
});

/**
 * Runs the constructed score assertions.
 * @param score The station score.
 * @param assertions The list of assertions.
 */
function runAssertions(score: StationScore, assertions: ScoreAssertions) {
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

type ScoreAssertions = Array<[keyof StationScore, unknown]>;
