import { assert } from 'chai';
import { describe, it } from 'mocha';

import { Complaint, ComplaintStatus, Station } from '../../src/index';

const STATION_NAME = 'Station';
const DATE_COMPLAINT = Date.UTC(2000, 0, 1);
const DATE_INVESTIGATING = Date.UTC(2000, 0, 15);
const DATE_RESOLVED = Date.UTC(2000, 0, 31);

describe('Station Score Tests', function () {
  it('Given all complaints unaddressed', function () {
    const complaints = Complaint.create({
      quantity: 5,
      status: ComplaintStatus.UNADDRESSED,
      overrider: () => ({
        station: STATION_NAME,
        dateComplaintMade: DATE_COMPLAINT
      })
    });

    const score = Station.calculateScores(complaints)[STATION_NAME];

    const assertions: ScoreAssertions = [
      [ScoreProp.TNOC!, 5],
      [ScoreProp.NOCU!, 5],
      [ScoreProp.NOCI!, 0],
      [ScoreProp.NOCR!, 0],
      [ScoreProp.PCTU!, '100%'],
      [ScoreProp.PCTI!, '0%'],
      [ScoreProp.PCTR!, '0%'],
      [ScoreProp.PCTA!, '0%'],
      [ScoreProp.AVGI!, null],
      [ScoreProp.AVGR!, null],
      [ScoreProp.AVGCD!, null],
      [ScoreProp.FS!, 30]
    ];

    runAssertions(score, assertions);
  });

  it('Given all complaints under investigation', function () {
    const complaints = Complaint.create({
      quantity: 5,
      status: ComplaintStatus.INVESTIGATING,
      overrider: () => ({
        station: STATION_NAME,
        dateComplaintMade: DATE_COMPLAINT,
        dateUnderInvestigation: DATE_INVESTIGATING
      })
    });

    const score = Station.calculateScores(complaints)[STATION_NAME];

    const assertions: ScoreAssertions = [
      [ScoreProp.TNOC!, 5],
      [ScoreProp.NOCU!, 0],
      [ScoreProp.NOCI!, 5],
      [ScoreProp.NOCR!, 0],
      [ScoreProp.PCTU!, '0%'],
      [ScoreProp.PCTI!, '100%'],
      [ScoreProp.PCTR!, '0%'],
      [ScoreProp.PCTA!, '100%'],
      [ScoreProp.AVGI!, '14 days'],
      [ScoreProp.AVGR!, null],
      [ScoreProp.AVGCD!, null],
      [ScoreProp.FS!, 80]
    ];

    runAssertions(score, assertions);
  });

  it('Given all complaints resolved', function () {
    const complaints = Complaint.create({
      quantity: 5,
      status: ComplaintStatus.RESOLVED,
      overrider: () => ({
        station: STATION_NAME,
        dateComplaintMade: DATE_COMPLAINT,
        dateUnderInvestigation: DATE_INVESTIGATING,
        dateResolved: DATE_RESOLVED
      })
    });

    const score = Station.calculateScores(complaints)[STATION_NAME];

    const assertions: ScoreAssertions = [
      [ScoreProp.TNOC!, 5],
      [ScoreProp.NOCU!, 0],
      [ScoreProp.NOCI!, 0],
      [ScoreProp.NOCR!, 5],
      [ScoreProp.PCTU!, '0%'],
      [ScoreProp.PCTI!, '0%'],
      [ScoreProp.PCTR!, '100%'],
      [ScoreProp.PCTA!, '100%'],
      [ScoreProp.AVGI!, '14 days'],
      [ScoreProp.AVGR!, '16 days'],
      [ScoreProp.AVGCD!, '30 days'],
      [ScoreProp.FS!, 100]
    ];

    runAssertions(score, assertions);
  });

  it('Given all complaints resolved with delay', function () {
    const complaints = Complaint.create({
      quantity: 5,
      status: ComplaintStatus.RESOLVED,
      overrider: () => ({
        station: STATION_NAME,
        dateComplaintMade: DATE_COMPLAINT,
        dateUnderInvestigation: Date.UTC(2000, 3, 1),
        dateResolved: Date.UTC(2000, 5, 1)
      })
    });

    const score = Station.calculateScores(complaints)[STATION_NAME];

    const assertions: ScoreAssertions = [
      [ScoreProp.TNOC!, 5],
      [ScoreProp.NOCU!, 0],
      [ScoreProp.NOCI!, 0],
      [ScoreProp.NOCR!, 5],
      [ScoreProp.PCTU!, '0%'],
      [ScoreProp.PCTI!, '0%'],
      [ScoreProp.PCTR!, '100%'],
      [ScoreProp.PCTA!, '100%'],
      [ScoreProp.AVGI!, '91 days'],
      [ScoreProp.AVGR!, '61 days'],
      [ScoreProp.AVGCD!, '152 days'],
      [ScoreProp.FS!, 75.6]
    ];

    runAssertions(score, assertions);
  });

  it('Given a mix of complaint statuses', function () {
    const complaintsUnaddressed = Complaint.create({
      status: ComplaintStatus.UNADDRESSED,
      overrider: () => ({
        station: STATION_NAME,
        dateComplaintMade: DATE_COMPLAINT
      })
    });

    const complaintsInvestigating = Complaint.create({
      quantity: 2,
      status: ComplaintStatus.INVESTIGATING,
      overrider: () => ({
        station: STATION_NAME,
        dateComplaintMade: DATE_COMPLAINT,
        dateUnderInvestigation: DATE_INVESTIGATING
      })
    });

    const complaintsResolved = Complaint.create({
      quantity: 2,
      status: ComplaintStatus.RESOLVED,
      overrider: () => ({
        station: STATION_NAME,
        dateComplaintMade: DATE_COMPLAINT,
        dateUnderInvestigation: DATE_INVESTIGATING,
        dateResolved: DATE_RESOLVED
      })
    });

    const complaints = complaintsUnaddressed.concat(
      complaintsInvestigating,
      complaintsResolved
    );

    const score = Station.calculateScores(complaints)[STATION_NAME];

    const assertions: ScoreAssertions = [
      [ScoreProp.TNOC!, 5],
      [ScoreProp.NOCU!, 1],
      [ScoreProp.NOCI!, 2],
      [ScoreProp.NOCR!, 2],
      [ScoreProp.PCTU!, '20%'],
      [ScoreProp.PCTI!, '40%'],
      [ScoreProp.PCTR!, '40%'],
      [ScoreProp.PCTA!, '80%'],
      [ScoreProp.AVGI!, '14 days'],
      [ScoreProp.AVGR!, '16 days'],
      [ScoreProp.AVGCD!, '30 days'],
      [ScoreProp.FS!, 78]
    ];

    runAssertions(score, assertions);
  });
});

/**
 * Runs the constructed score assertions.
 * @param score The station score.
 * @param assertions The list of assertions.
 */
function runAssertions(score: Station, assertions: ScoreAssertions) {
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

const ScoreProp: Record<string, keyof Station> = {
  TNOC: 'totalNumberOfComplaints',
  NOCU: 'numberOfComplaintsUnaddressed',
  NOCI: 'numberOfComplaintsInvestigating',
  NOCR: 'numberOfComplaintsResolved',
  PCTU: 'percentageUnaddressed',
  PCTI: 'percentageInvestigating',
  PCTR: 'percentageResolved',
  PCTA: 'percentageAttendedTo',
  AVGI: 'averageInvestigationTime',
  AVGR: 'averageResolutionTime',
  AVGCD: 'averageCaseDuration',
  FS: 'finalScore'
};

type ScoreAssertions = Array<[keyof Station, unknown]>;
