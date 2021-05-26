import { differenceInDays, differenceInMilliseconds } from 'date-fns';

import Complaint, { ComplaintStatus } from '../../src/classes/complaint';
import StationScore from '../../src/classes/score';

/**
 * Calculates the ComRank score for each station among the total list of
 * complaints.
 * @returns The mapping of scores to station.
 */
 export async function calculateStationScores(complaints: Complaint[]) {
  const complaintsByStation: StationComplaints = {};
  const stationScores: StationScores = {};

  const timeDiffForComplaints: { [key: number]: number } = {};

  complaints.forEach((complaint) => {
    const { station } = complaint;
    const array = complaintsByStation[station!] ?? [];
    array.push(complaint);
    complaintsByStation[station!] = array;

    if (complaint.endDate) {
      timeDiffForComplaints[complaint.id!] = differenceInMilliseconds(
        complaint.startDate!,
        complaint.endDate
      );
    }
  });

  Object.entries(complaintsByStation).forEach(([station, complaints]) => {
    const complaintCount = complaints.length;
    const resolvedCount = complaints.filter(
      (c) => c.status === ComplaintStatus.RESOLVED
    ).length;
    const percentageResolved = (resolvedCount / complaintCount) * 100;

    const sum = complaints
      .map((c) => timeDiffForComplaints[c.id!])
      .filter((e) => e)
      .reduce((a, b) => a + b, 0);
    const avgTimeToResolve = sum / complaints.length;

    const score = new StationScore();
    score.numberOfComplaints = complaintCount;
    score.percentageResolved = Math.round(percentageResolved * 10) / 10 + '%';
    score.avgTimeToResolve = differenceInDays(avgTimeToResolve, 0) + ' days';

    stationScores[station] = score;
  });

  return stationScores;
}

type StationComplaints = {
  [key: string]: Complaint[];
};

type StationScores = {
  [key: string]: StationScore;
};