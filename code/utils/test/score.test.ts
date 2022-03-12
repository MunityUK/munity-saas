import FakeTimers from '@sinonjs/fake-timers';
import { assert } from 'chai';

import {
  Complaint,
  ComplaintStatus,
  IncidentType,
  IncidentTypeSeverities,
  Station
} from '../src';

const STATION_NAME = 'Station';
const DATE_COMPLAINT = Date.UTC(2000, 0, 1);
const DATE_INVESTIGATING = Date.UTC(2000, 0, 15);
const DATE_RESOLVED = Date.UTC(2000, 0, 31);

describe('Station Score Tests', function () {
  let clock: FakeTimers.InstalledClock;

  function mockTodaysDate(year: number, month: number, day: number) {
    clock = FakeTimers.install({ now: Date.UTC(year, month, day) });
  }

  describe('Given all complaints unaddressed, within slack period', function () {
    before(() => mockTodaysDate(2000, 0, 3));
    after(() => clock.reset());

    const tests: Record<Severity, number> = {
      low: 100,
      medium: 100,
      high: 100
    };
    Object.entries(tests).forEach(([severity, expectedFinalScore]) => {
      it(`With severity ${severity}`, function () {
        const complaints = Complaint.create({
          quantity: 5,
          status: ComplaintStatus.UNADDRESSED,
          overrider: () => ({
            incidentType: incidentTypeFromSeverity(severity),
            station: STATION_NAME,
            dateComplaintMade: Date.UTC(2000, 0, 1)
          })
        });

        const scores = Station.calculateScores(complaints);
        const actualStation = scores[STATION_NAME];

        const expectedStation: Partial<Station> = {
          totalNumberOfComplaints: 5,
          numberOfComplaintsUnaddressed: 5,
          numberOfComplaintsInvestigating: 0,
          numberOfComplaintsResolved: 0,
          percentageUnaddressed: '100%',
          percentageInvestigating: '0%',
          percentageResolved: '0%',
          percentageAttendedTo: '0%',
          averageInvestigationTime: null,
          averageResolutionTime: null,
          averageCaseDuration: null,
          finalScore: expectedFinalScore
        };

        assertStationEqual(actualStation, expectedStation);
      });
    });
  });

  describe('Given all complaints unaddressed, beyond slack period', function () {
    before(() => mockTodaysDate(2000, 0, 15));
    after(() => clock.reset());

    const tests: Record<Severity, number> = {
      low: 82,
      medium: 64,
      high: 37
    };
    Object.entries(tests).forEach(([severity, expectedFinalScore]) => {
      it(`With severity ${severity}`, function () {
        const complaints = Complaint.create({
          quantity: 5,
          status: ComplaintStatus.UNADDRESSED,
          overrider: () => ({
            incidentType: incidentTypeFromSeverity(severity),
            station: STATION_NAME,
            dateComplaintMade: Date.UTC(2000, 0, 1)
          })
        });

        const scores = Station.calculateScores(complaints);
        const actualStation = scores[STATION_NAME];

        const expectedStation: Partial<Station> = {
          totalNumberOfComplaints: 5,
          numberOfComplaintsUnaddressed: 5,
          numberOfComplaintsInvestigating: 0,
          numberOfComplaintsResolved: 0,
          percentageUnaddressed: '100%',
          percentageInvestigating: '0%',
          percentageResolved: '0%',
          percentageAttendedTo: '0%',
          averageInvestigationTime: null,
          averageResolutionTime: null,
          averageCaseDuration: null,
          finalScore: expectedFinalScore
        };

        assertStationEqual(actualStation, expectedStation);
      });
    });
  });

  describe('Given all complaints under investigation, within slack period', function () {
    before(() => mockTodaysDate(2000, 0, 29));
    after(() => clock.reset());

    const tests: Record<Severity, number> = {
      low: 97.4,
      medium: 94.8,
      high: 90.9
    };
    Object.entries(tests).forEach(([severity, expectedFinalScore]) => {
      it(`With severity ${severity}`, function () {
        const complaints = Complaint.create({
          quantity: 5,
          status: ComplaintStatus.INVESTIGATING,
          overrider: () => ({
            station: STATION_NAME,
            incidentType: incidentTypeFromSeverity(severity),
            dateComplaintMade: DATE_COMPLAINT,
            dateUnderInvestigation: DATE_INVESTIGATING
          })
        });

        const scores = Station.calculateScores(complaints);
        const actual = scores[STATION_NAME];

        const expected: Partial<Station> = {
          totalNumberOfComplaints: 5,
          numberOfComplaintsUnaddressed: 0,
          numberOfComplaintsInvestigating: 5,
          numberOfComplaintsResolved: 0,
          percentageUnaddressed: '0%',
          percentageInvestigating: '100%',
          percentageResolved: '0%',
          percentageAttendedTo: '100%',
          averageInvestigationTime: '14 days',
          averageResolutionTime: null,
          averageCaseDuration: null,
          finalScore: expectedFinalScore
        };

        assertStationEqual(actual, expected);
      });
    });
  });

  describe('Given all complaints resolved within slack periods', function () {
    const tests: Record<Severity, number> = {
      low: 100,
      medium: 100,
      high: 100
    };
    Object.entries(tests).forEach(([severity, expectedFinalScore]) => {
      it(`With severity ${severity}`, function () {
        const complaints = Complaint.create({
          quantity: 5,
          status: ComplaintStatus.RESOLVED,
          overrider: () => ({
            station: STATION_NAME,
            incidentType: incidentTypeFromSeverity(severity),
            dateComplaintMade: DATE_COMPLAINT,
            dateUnderInvestigation: Date.UTC(2000, 0, 5),
            dateResolved: Date.UTC(2000, 0, 15)
          })
        });

        const scores = Station.calculateScores(complaints);
        const actual = scores[STATION_NAME];

        const expected: Partial<Station> = {
          totalNumberOfComplaints: 5,
          numberOfComplaintsUnaddressed: 0,
          numberOfComplaintsInvestigating: 0,
          numberOfComplaintsResolved: 5,
          percentageUnaddressed: '0%',
          percentageInvestigating: '0%',
          percentageResolved: '100%',
          percentageAttendedTo: '100%',
          averageInvestigationTime: '4 days',
          averageResolutionTime: '10 days',
          averageCaseDuration: '14 days',
          finalScore: expectedFinalScore
        };

        assertStationEqual(actual, expected);
      });
    });
  });

  describe('Given all complaints resolved beyond slack period', function () {
    before(() => mockTodaysDate(2000, 2, 1));
    after(() => clock.reset());

    it('With severity low', function () {
      const complaints = Complaint.create({
        quantity: 5,
        status: ComplaintStatus.RESOLVED,
        overrider: () => ({
          station: STATION_NAME,
          incidentType: incidentTypeFromSeverity('low'),
          dateComplaintMade: DATE_COMPLAINT,
          dateUnderInvestigation: Date.UTC(2000, 1, 1),
          dateResolved: Date.UTC(2000, 2, 1)
        })
      });

      const scores = Station.calculateScores(complaints);
      const actual = scores[STATION_NAME];

      const expected: Partial<Station> = {
        totalNumberOfComplaints: 5,
        numberOfComplaintsUnaddressed: 0,
        numberOfComplaintsInvestigating: 0,
        numberOfComplaintsResolved: 5,
        percentageUnaddressed: '0%',
        percentageInvestigating: '0%',
        percentageResolved: '100%',
        percentageAttendedTo: '100%',
        averageInvestigationTime: '31 days',
        averageResolutionTime: '29 days',
        averageCaseDuration: '60 days',
        finalScore: 79.9
      };

      assertStationEqual(actual, expected);
    });
  });

  describe.skip('Given a mix of complaint statuses', function () {
    const tests = [
      { incidentType: IncidentType.VERBAL_ABUSE, expectedFinalScore: 70.4 },
      { incidentType: IncidentType.HARASSMENT, expectedFinalScore: 58.8 },
      { incidentType: IncidentType.BRUTALITY, expectedFinalScore: 47.2 }
    ];
    tests.forEach(({ incidentType, expectedFinalScore }) => {
      const severity = IncidentTypeSeverities[incidentType].toLowerCase();
      it(`With severity ${severity}`, function () {
        const complaintsUnaddressed = Complaint.create({
          status: ComplaintStatus.UNADDRESSED,
          overrider: () => ({
            station: STATION_NAME,
            incidentType,
            dateComplaintMade: DATE_COMPLAINT
          })
        });

        const complaintsInvestigating = Complaint.create({
          quantity: 2,
          status: ComplaintStatus.INVESTIGATING,
          overrider: () => ({
            station: STATION_NAME,
            incidentType,
            dateComplaintMade: DATE_COMPLAINT,
            dateUnderInvestigation: DATE_INVESTIGATING
          })
        });

        const complaintsResolved = Complaint.create({
          quantity: 2,
          status: ComplaintStatus.RESOLVED,
          overrider: () => ({
            station: STATION_NAME,
            incidentType,
            dateComplaintMade: DATE_COMPLAINT,
            dateUnderInvestigation: DATE_INVESTIGATING,
            dateResolved: DATE_RESOLVED
          })
        });

        const complaints = [
          ...complaintsUnaddressed,
          ...complaintsInvestigating,
          ...complaintsResolved
        ];

        const scores = Station.calculateScores(complaints);
        const actual = scores[STATION_NAME];

        const expected: Partial<Station> = {
          totalNumberOfComplaints: 5,
          numberOfComplaintsUnaddressed: 1,
          numberOfComplaintsInvestigating: 2,
          numberOfComplaintsResolved: 2,
          percentageUnaddressed: '20%',
          percentageInvestigating: '40%',
          percentageResolved: '40%',
          percentageAttendedTo: '80%',
          averageInvestigationTime: '14 days',
          averageResolutionTime: '16 days',
          averageCaseDuration: '30 days',
          finalScore: expectedFinalScore
        };

        assertStationEqual(actual, expected);
      });
    });
  });
});

/**
 * Runs the constructed score assertions.
 * @param actualStation The actual station.
 * @param expectedStation The expected station.
 */
function assertStationEqual(
  actualStation: Station,
  expectedStation: Partial<Station>
) {
  Object.entries(expectedStation).forEach(([field, actual]) => {
    assertThat(actualStation[field as keyof Station], actual, field);
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

function incidentTypeFromSeverity(severity: string): IncidentType {
  if (severity === 'low') {
    return IncidentType.VERBAL_ABUSE;
  } else if (severity === 'medium') {
    return IncidentType.HARASSMENT;
  } else {
    return IncidentType.BRUTALITY;
  }
}

type Severity = 'low' | 'medium' | 'high';
