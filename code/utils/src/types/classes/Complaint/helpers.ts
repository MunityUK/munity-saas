import { differenceInDays, differenceInMilliseconds } from 'date-fns';
import faker from 'faker';

import {
  BristolPoliceStations,
  Complainant,
  Complaint,
  ComplaintPropertyOverrides,
  ComplaintStatus,
  IncidentType,
  Officer,
  Station,
  StationScores
} from '../..';
import { randomElement, randomEnumValue } from '../../../functions/common';

/**
 * Creates random complaints.
 * @param overrides The complaint property overrides.
 * @returns The generated complaint.
 */
export function createComplaints(overrides?: ComplaintPropertyOverrides) {
  const complaint = new Complaint();
  complaint.complaintId =
    overrides?.complaintId ??
    faker.datatype.number(10000).toString().padStart(5, '0');
  complaint.station =
    overrides?.station ?? randomElement(BristolPoliceStations, 2);
  complaint.force = 'Avon and Somerset Constabulary';
  complaint.incidentType = randomEnumValue(IncidentType);
  complaint.incidentDescription = faker.lorem.sentence();
  complaint.status = overrides?.status ?? randomEnumValue(ComplaintStatus, 2);
  complaint.notes = faker.lorem.sentence();
  complaint.city = 'Bristol';
  complaint.county = 'Avon';
  complaint.latitude = parseFloat(faker.address.latitude(51.475, 51.445, 15));
  complaint.longitude = parseFloat(faker.address.longitude(-2.57, -2.62, 15));
  complaint.dateComplaintMade =
    overrides?.dateComplaintMade ?? faker.date.past();

  if (complaint.status !== ComplaintStatus.UNADDRESSED) {
    complaint.dateUnderInvestigation =
      overrides?.dateUnderInvestigation ??
      faker.date.future(0.2, new Date(complaint.dateComplaintMade));
  }

  if (complaint.status === ComplaintStatus.RESOLVED) {
    complaint.dateResolved =
      overrides?.dateResolved ??
      faker.date.future(0.5, new Date(complaint.dateUnderInvestigation!));
  }

  complaint.complainants = JSON.stringify(
    Complainant.randomSet(faker.datatype.number({ min: 1, max: 3 }))
  );
  complaint.officers = JSON.stringify(
    Officer.randomSet(faker.datatype.number({ min: 1, max: 3 }))
  );

  Complaint.validate(complaint);
  return complaint;
}

/**
 * Calculates the ComRank score for each station among the total list of
 * complaints.
 * @param complaints The list of complaints.
 * @returns The mapping of scores to station.
 */
export function calculateStationScores(complaints: Complaint[]): StationScores {
  const complaintsByStation: ComplaintsByStation = {};
  const stationScores: StationScores = {};

  const investigationTimeByComplaint: TimeByComplaint = {};
  const resolutionTimeByComplaint: TimeByComplaint = {};
  const caseDurationByComplaint: TimeByComplaint = {};

  // Accumulate times by complaint.
  complaints.forEach((complaint) => {
    const { station } = complaint;
    const currentComplaints = complaintsByStation[station!];
    complaintsByStation[station!] = currentComplaints
      ? [...currentComplaints, complaint]
      : [complaint];

    if (complaint.dateUnderInvestigation) {
      investigationTimeByComplaint[complaint.id!] = differenceInMilliseconds(
        new Date(complaint.dateComplaintMade!),
        new Date(complaint.dateUnderInvestigation)
      );
    }

    if (complaint.dateResolved) {
      resolutionTimeByComplaint[complaint.id!] = differenceInMilliseconds(
        new Date(complaint.dateUnderInvestigation!),
        new Date(complaint.dateResolved)
      );
      caseDurationByComplaint[complaint.id!] = differenceInMilliseconds(
        new Date(complaint.dateComplaintMade!),
        new Date(complaint.dateResolved)
      );
    }
  });

  Object.entries(complaintsByStation).forEach(([stationName, complaints]) => {
    // Calculate counts.
    const complaintCount = complaints.length;
    const investigatingCount = getComplaintCountByStatus(complaints, [
      ComplaintStatus.INVESTIGATING
    ]);
    const resolvedCount = getComplaintCountByStatus(complaints, [
      ComplaintStatus.RESOLVED
    ]);
    const unaddressedCount =
      complaints.length - investigatingCount - resolvedCount;

    // Calculate percentages.
    const percentageUnaddressed = (unaddressedCount / complaintCount) * 100;
    const percentageInvestigating = (investigatingCount / complaintCount) * 100;
    const percentageResolved = (resolvedCount / complaintCount) * 100;
    const percentageAttendedTo = percentageResolved + percentageInvestigating;

    // Calculate average times.
    const avgInvestigationTime = calcAverageTime(
      complaints,
      investigationTimeByComplaint
    );
    const avgResolutionTime = calcAverageTime(
      complaints,
      resolutionTimeByComplaint
    );
    const avgCaseDuration = calcAverageTime(
      complaints,
      caseDurationByComplaint
    );

    // Marshal values to score object.
    const score = new Station();
    score.complaints = complaints;
    score.totalNumberOfComplaints = complaintCount;
    score.numberOfComplaintsResolved = resolvedCount;
    score.numberOfComplaintsInvestigating = investigatingCount;
    score.numberOfComplaintsUnaddressed = unaddressedCount;
    score.percentageUnaddressed = round(percentageUnaddressed) + '%';
    score.percentageInvestigating = round(percentageInvestigating) + '%';
    score.percentageResolved = round(percentageResolved) + '%';
    score.percentageAttendedTo = round(percentageAttendedTo) + '%';
    score.averageInvestigationTime = assignAverageTime(avgInvestigationTime);
    score.averageResolutionTime = assignAverageTime(avgResolutionTime);
    score.averageCaseDuration = assignAverageTime(avgCaseDuration);

    const penaltyUnresolved = calcUnresolvedPenalty(percentageResolved);
    const penaltyUnaddressed = calcUnaddressedPenalty(percentageAttendedTo);
    const penaltyLongAddressTime =
      calcLongAddressTimePenalty(avgInvestigationTime);
    const penaltyLongResolveTime =
      calcLongResolveTimePenalty(avgResolutionTime);

    score.finalScore = calcFinalScore(
      penaltyUnaddressed,
      penaltyUnresolved,
      penaltyLongAddressTime,
      penaltyLongResolveTime
    );

    stationScores[stationName] = score;
  });

  return stationScores;
}

/**
 * Rounds a float to the specified number of decimal places. Will leave out
 * decimals if the number is an integer.
 * @param number The number to round.
 * @param precision The number of decimal places.
 * @returns The rounded number.
 */
function round(number: number, precision = 1) {
  if (!precision) return number;
  const scale = 10 ** precision;
  return Math.round(number * scale) / scale;
}

/**
 * Calculates the penalty incurred for unresolved complaints.
 * @param percentageResolved The percentage of resolved complaints.
 * @returns The calculated penalty to deduct from final score.
 */
function calcUnresolvedPenalty(percentageResolved: number) {
  return (100 - percentageResolved) * 0.2;
}

/**
 * Calculates the penalty incurred for unaddressed complaints.
 * @param percentageAttendedTo The percentage of addressed and resolved
 * complaints collectively.
 * @returns The calculated penalty to deduct from final score.
 */
function calcUnaddressedPenalty(percentageAttendedTo: number) {
  return (100 - percentageAttendedTo) * 0.5;
}

/**
 * Calculates the penalty incurred for a long average complaint investigation time.
 * @param avgInvestigationTime The average investigation time.
 * @returns The calculated penalty to deduct from final score.
 */
function calcLongAddressTimePenalty(avgInvestigationTime: number | null) {
  if (avgInvestigationTime === null) return 0;
  const cappedPenalty = Math.min(avgInvestigationTime - 30, 30);
  return Math.max(cappedPenalty * 0.8, 0);
}

/**
 * Calculates the penalty incurred for a long average complaint resolution time.
 * @param avgResolutionTime The average resolution time.
 * @returns The calculated penalty to deduct from final score.
 */
function calcLongResolveTimePenalty(avgResolutionTime: number | null) {
  if (avgResolutionTime === null) return 0;
  const cappedPenalty = Math.min(avgResolutionTime - 60, 30);
  return Math.max(cappedPenalty * 0.4, 0);
}

/**
 * Calculate the final score using the penalty deductions.
 * @param pua The penalty for unaddressed complaints.
 * @param pur The penalty for unresolved complaints
 * @param plit The penalty for long average complaint investigation times.
 * @param plrt The penalty for long average complaint resolution times.
 * @returns The final score.
 */
function calcFinalScore(pua: number, pur: number, plit: number, plrt: number) {
  return round(100 - pua - pur - plit - plrt);
}

/**
 * Calculates the average time to address or resolve a list of complaints.
 * @param complaints The list of complaints.
 * @param timeByComplaint The mapping for times to complaints.
 * @returns The average time taken in milliseconds.
 */
function calcAverageTime(
  complaints: Complaint[],
  timeByComplaint: TimeByComplaint
): number {
  const total = complaints
    .map((c) => timeByComplaint[c.id!])
    .filter((e) => e)
    .reduce((a, b) => a + b, 0);

  const average = total / complaints.length;
  const averageTime = Math.abs(differenceInDays(average, 0));
  return averageTime;
}

/**
 * Assigns a specified average time to a score.
 * @param time The average time to assign.
 * @returns The average time string with the unit suffix. Null if average time
 * is zero.
 */
function assignAverageTime(time: number): string | null {
  return time > 0 ? time + ' days' : null;
}

/**
 * Retrieve the number of complaints which have a status matching the specified
 * statuses.
 * @param complaints The list of complaints.
 * @param statuses The statuses a complaint must match.
 * @returns The number of complaints with the specified statuses.
 */
function getComplaintCountByStatus(
  complaints: Complaint[],
  statuses: ComplaintStatus[]
) {
  return complaints.filter((c) => statuses.includes(c.status!)).length;
}

type ComplaintsByStation = Record<string, Complaint[]>;
type TimeByComplaint = Record<number, number>;
