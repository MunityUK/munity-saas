import {
  addMonths,
  differenceInDays,
  differenceInMilliseconds
} from 'date-fns';

import { ExtendedTimePenaltyFactors, PenaltyFactors } from './constants';
import {
  ComplaintsByStation,
  ExtendedTimeType,
  PenaltyStatus,
  StationScoreByMonth,
  TimeByComplaint
} from './types';

import { Complaint, ComplaintStatus, Station, StationScores } from '../..';
import { formatDate, isDateInRange } from '../../functions/common';

/**
 * Groups the list of complaints by their stations.
 * @param complaints The list of complaints.
 * @returns The grouped complaints by station.
 */
export function groupComplaintsByStation(
  complaints: Complaint[]
): ComplaintsByStation {
  const complaintsByStation: ComplaintsByStation = {};
  complaints.forEach((complaint) => {
    const { station } = complaint;
    const currentComplaints = complaintsByStation[station!];
    complaintsByStation[station!] = currentComplaints
      ? [...currentComplaints, complaint]
      : [complaint];
  });
  return complaintsByStation;
}

/**
 * Calculates the station scores for each month across a specified time period
 * and groups results by station.
 * @param complaints The list of complaints.
 * @param startDate The lower bound of the time period.
 * @param endDate The upper bound of the time period.
 * @returns The station scores for each month grouped by station.
 */
export function trackScoresAcrossTimePeriod(
  complaints: Complaint[],
  startDate: Date,
  endDate: Date
) {
  const complaintsByStation = groupComplaintsByStation(complaints);
  const stationScoreByMonth = Object.keys(complaintsByStation).reduce(
    (acc: StationScoreByMonth, i) => {
      acc[i] = {};
      return acc;
    },
    {}
  );

  Object.entries(complaintsByStation).forEach(
    ([stationName, stationComplaints]) => {
      let currentMonth = startDate;
      while (currentMonth.getTime() <= endDate.getTime()) {
        const complaintsInDateRange = stationComplaints.filter((c) => {
          return isDateInRange(
            c.dateComplaintMade!,
            {
              startDate,
              endDate: currentMonth
            },
            { inclusive: true, strict: true }
          );
        });

        if (complaintsInDateRange.length) {
          const monthKey = formatDate(currentMonth, 'yyyy-MM');
          const stationScore = Station.calculateScores(complaintsInDateRange)[
            stationName
          ];
          stationScoreByMonth[stationName][monthKey] =
            stationScore?.finalScore ?? 0;
        }
        currentMonth = addMonths(currentMonth, 1);
      }
    }
  );

  return stationScoreByMonth;
}

/**
 * Calculates the ComRank score for each station among the total list of
 * complaints.
 * @param complaints The list of complaints.
 * @returns The mapping of scores to station.
 */
export function calculateStationScores(complaints: Complaint[]): StationScores {
  const investigationTimeByComplaint: TimeByComplaint = {};
  const resolutionTimeByComplaint: TimeByComplaint = {};
  const caseDurationByComplaint: TimeByComplaint = {};

  complaints.forEach((complaint) => {
    if (complaint.dateUnderInvestigation) {
      investigationTimeByComplaint[complaint.complaintId!] =
        differenceInMilliseconds(
          new Date(complaint.dateComplaintMade!),
          new Date(complaint.dateUnderInvestigation)
        );
    }
    if (complaint.dateResolved) {
      resolutionTimeByComplaint[complaint.complaintId!] =
        differenceInMilliseconds(
          new Date(complaint.dateUnderInvestigation!),
          new Date(complaint.dateResolved)
        );
      caseDurationByComplaint[complaint.complaintId!] =
        differenceInMilliseconds(
          new Date(complaint.dateComplaintMade!),
          new Date(complaint.dateResolved)
        );
    }
  });

  const complaintsByStation = groupComplaintsByStation(complaints);
  const stationScores: StationScores = {};

  Object.entries(complaintsByStation).forEach(([stationName, complaints]) => {
    // Calculate counts by status.
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
    const avgInvestigationTime = calculateAverageTime(
      complaints,
      investigationTimeByComplaint
    );
    const avgResolutionTime = calculateAverageTime(
      complaints,
      resolutionTimeByComplaint
    );
    const avgCaseDuration = calculateAverageTime(
      complaints,
      caseDurationByComplaint
    );

    const score: Station = {
      complaints,
      totalNumberOfComplaints: complaintCount,
      numberOfComplaintsResolved: resolvedCount,
      numberOfComplaintsInvestigating: investigatingCount,
      numberOfComplaintsUnaddressed: unaddressedCount,
      percentageUnaddressed: round(percentageUnaddressed) + '%',
      percentageInvestigating: round(percentageInvestigating) + '%',
      percentageResolved: round(percentageResolved) + '%',
      percentageAttendedTo: round(percentageAttendedTo) + '%',
      averageInvestigationTime: assignAverageTime(avgInvestigationTime),
      averageResolutionTime: assignAverageTime(avgResolutionTime),
      averageCaseDuration: assignAverageTime(avgCaseDuration)
    };

    const penaltyUnresolved = calculateStatusPenalty(
      percentageResolved,
      'Unresolved'
    );
    const penaltyUnaddressed = calculateStatusPenalty(
      percentageAttendedTo,
      'Unaddressed'
    );
    const penaltyLongAddressTime = calculateExtendedTimePenalty(
      avgInvestigationTime,
      'Investigation'
    );
    const penaltyLongResolveTime = calculateExtendedTimePenalty(
      avgResolutionTime,
      'Resolution'
    );

    score.finalScore = calculateFinalScore(
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
 * Calculates the penalty incurred for complaints with a certain status.
 * @param percentageResolved The percentage of resolved complaints.
 * @param status The status to calculate penalties for.
 * @returns The calculated penalty to deduct from final score.
 */
function calculateStatusPenalty(percentage: number, status: PenaltyStatus) {
  const factor = PenaltyFactors[status];
  return (100 - percentage) * factor;
}

/**
 * Calculates the penalty incurred for a long average time.
 * @param averageTime The average time.
 * @param type The type of time measured.
 * @returns The calculated penalty to deduct from final score.
 */
function calculateExtendedTimePenalty(
  averageTime: number | null,
  type: ExtendedTimeType
) {
  if (averageTime === null) return 0;
  const { maxPenalty, penaltyFactor } = ExtendedTimePenaltyFactors[type];
  const cappedPenalty = Math.min(averageTime - maxPenalty, 30);
  return Math.max(cappedPenalty * penaltyFactor, 0);
}

/**
 * Calculate the final score using the penalty deductions.
 * @param pua The penalty for unaddressed complaints.
 * @param pur The penalty for unresolved complaints
 * @param plit The penalty for long average complaint investigation times.
 * @param plrt The penalty for long average complaint resolution times.
 * @returns The final score.
 */
function calculateFinalScore(
  pua: number,
  pur: number,
  plit: number,
  plrt: number
) {
  return round(100 - pua - pur - plit - plrt);
}

/**
 * Calculates the average time to address or resolve a list of complaints.
 * @param complaints The list of complaints.
 * @param timeByComplaint The mapping for times to complaints.
 * @returns The average time taken in milliseconds.
 */
function calculateAverageTime(
  complaints: Complaint[],
  timeByComplaint: TimeByComplaint
): number {
  const total = complaints
    .map((c) => timeByComplaint[c.complaintId!])
    .filter((e) => e)
    .reduce((a, b) => a + b, 0);

  if (total === 0) return total;

  const average = total / Object.keys(timeByComplaint).length;
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
