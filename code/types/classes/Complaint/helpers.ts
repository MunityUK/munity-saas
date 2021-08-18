import { differenceInDays, differenceInMilliseconds } from 'date-fns';

import { Complaint, ComplaintStatus, StationScore, StationScores } from '../..';

/**
 * Calculates the ComRank score for each station among the total list of
 * complaints.
 * @param complaints The list of complaints.
 * @returns The mapping of scores to station.
 */
export function calculateStationScores(complaints: Complaint[]): StationScores {
  const complaintsByStation: StationComplaints = {};
  const stationScores: StationScores = {};

  const addressalTimeByComplaint: { [key: number]: number } = {};
  const resolutionTimeByComplaint: { [key: number]: number } = {};
  const caseDurationByComplaint: { [key: number]: number } = {};

  // Accumulate times by complaint.
  complaints.forEach((complaint) => {
    const { station } = complaint;
    const listOfComplaints = complaintsByStation[station!] ?? [];
    listOfComplaints.push(complaint);
    complaintsByStation[station!] = listOfComplaints;

    if (complaint.dateUnderInvestigation) {
      addressalTimeByComplaint[complaint.id!] = differenceInMilliseconds(
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

  Object.entries(complaintsByStation).forEach(([station, complaints]) => {
    // Calculate counts.
    const complaintCount = complaints.length;
    const addressedCount = getComplaintCountByStatus(complaints, [
      ComplaintStatus.INVESTIGATING
    ]);
    const resolvedCount = getComplaintCountByStatus(complaints, [
      ComplaintStatus.RESOLVED
    ]);
    const unaddressedCount = complaints.length - addressedCount - resolvedCount;

    // Calculate percentages.
    const percentageUnaddressed = (unaddressedCount / complaintCount) * 100;
    const percentageAddressed = (addressedCount / complaintCount) * 100;
    const percentageResolved = (resolvedCount / complaintCount) * 100;
    const percentageProgressed = percentageResolved + percentageAddressed;

    // Calculate average times.
    const avgAddressalTime = calcAverageTime(
      complaints,
      addressalTimeByComplaint
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
    const score = new StationScore();
    score.totalNumberOfComplaints = complaintCount;
    score.numberOfComplaintsResolved = resolvedCount;
    score.numberOfComplaintsAddressed = addressedCount;
    score.numberOfComplaintsUnaddressed = unaddressedCount;

    score.percentageUnaddressed = round(percentageUnaddressed) + '%';
    score.percentageAddressed = round(percentageAddressed) + '%';
    score.percentageResolved = round(percentageResolved) + '%';
    score.percentageProgressed = round(percentageProgressed) + '%';
    score.averageAddressalTime = assignAverageTime(avgAddressalTime);
    score.averageResolutionTime = assignAverageTime(avgResolutionTime);
    score.averageCaseDuration = assignAverageTime(avgCaseDuration);

    const penaltyUnresolved = calcUnresolvedPenalty(percentageResolved);
    const penaltyUnaddressed = calcUnaddressedPenalty(percentageProgressed);
    const penaltyLongAddressTime = calcLongAddressTimePenalty(avgAddressalTime);
    const penaltyLongResolveTime = calcLongResolveTimePenalty(
      avgResolutionTime
    );

    score.finalScore = calcFinalScore(
      penaltyUnaddressed,
      penaltyUnresolved,
      penaltyLongAddressTime,
      penaltyLongResolveTime
    );

    stationScores[station] = score;
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
 * @param percentageProgressed The percentage of addressed and resolved
 * complaints collectively.
 * @returns The calculated penalty to deduct from final score.
 */
function calcUnaddressedPenalty(percentageProgressed: number) {
  return (100 - percentageProgressed) * 0.5;
}

/**
 * Calculates the penalty incurred for a long average complaint addressal time.
 * @param avgAddressalTime The average addressal time.
 * @returns The calculated penalty to deduct from final score.
 */
function calcLongAddressTimePenalty(avgAddressalTime: number | null) {
  if (avgAddressalTime === null) return 0;
  const cappedPenalty = Math.min(avgAddressalTime - 30, 30);
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
 * @param plat The penalty for long average complaint addressal times.
 * @param plrt The penalty for long average complaint resolution times.
 * @returns The final score.
 */
function calcFinalScore(pua: number, pur: number, plat: number, plrt: number) {
  return round(100 - pua - pur - plat - plrt);
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

type StationComplaints = {
  [key: string]: Complaint[];
};
type TimeByComplaint = { [key: number]: number };
