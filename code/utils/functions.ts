import { differenceInDays, differenceInMilliseconds } from 'date-fns';

import {
  Complaint,
  ComplaintStatus,
  StationComplaints,
  StationScore,
  StationScores
} from '../types';

/**
 * Calculates the ComRank score for each station among the total list of
 * complaints.
 * @returns The mapping of scores to station.
 */
export function calculateStationScores(complaints: Complaint[]) {
  const complaintsByStation: StationComplaints = {};
  const stationScores: StationScores = {};

  const addressalTimeByComplaint: { [key: number]: number } = {};
  const resolutionTimeByComplaint: { [key: number]: number } = {};

  complaints.forEach((complaint) => {
    const { station } = complaint;
    const listOfComplaints = complaintsByStation[station!] ?? [];
    listOfComplaints.push(complaint);
    complaintsByStation[station!] = listOfComplaints;

    if (complaint.dateOfAddressal) {
      addressalTimeByComplaint[complaint.id!] = differenceInMilliseconds(
        complaint.dateOfComplaint!,
        complaint.dateOfAddressal
      );
    }

    if (complaint.dateOfResolution) {
      resolutionTimeByComplaint[complaint.id!] = differenceInMilliseconds(
        complaint.dateOfComplaint!,
        complaint.dateOfResolution
      );
    }
  });

  Object.entries(complaintsByStation).forEach(([station, complaints]) => {
    const complaintCount = complaints.length;
    const resolvedCount = complaints.filter(
      (c) => c.status === ComplaintStatus.RESOLVED
    ).length;
    const percentageResolved = (resolvedCount / complaintCount) * 100;

    const avgAddressalTime = averageTime(complaints, addressalTimeByComplaint);
    const avgResolutionTime = averageTime(
      complaints,
      resolutionTimeByComplaint
    );

    const score = new StationScore();
    score.numberOfComplaints = complaintCount;
    score.percentageResolved = Math.round(percentageResolved * 10) / 10 + '%';
    score.avgAddressalTime = avgAddressalTime + ' days';
    score.avgResolutionTime = avgResolutionTime + ' days';

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
export function round(number: number, precision: number) {
  if (!precision) return number;
  const scale = 10 ^ precision;
  return Math.round(number * scale) / scale;
}

/**
 * Calculates the average time to address or resolve a list of complaints.
 * @param complaints The list of complaints.
 * @param timeByComplaint The mapping for times to complaints.
 * @returns The average time taken in milliseconds.
 */
function averageTime(
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

type TimeByComplaint = { [key: number]: number };
