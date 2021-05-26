import { differenceInDays, differenceInMilliseconds } from 'date-fns';

import Complaint, { ComplaintStatus } from '../../src/classes/complaint';
import StationScore from '../../src/classes/score';
import { DB_TABLE, knex } from '../config';

(async () => {
  try {
    const scores = await calculateStationScores();
    printScores(scores);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();

async function calculateStationScores() {
  const complaintsByStation: StationComplaints = {};
  const stationScores: StationScores = {};

  const timeDiffForComplaints: { [key: number]: number } = {};

  const complaints = await knex(DB_TABLE).select<Complaint[]>();

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

function printScores(stationScores: StationScores) {
  console.info('---');
  Object.entries(stationScores).forEach(([station, score], i) => {
    console.info(`Station #${i + 1}: ${station}`);
    console.info('* Number of Complaints: ' + score.numberOfComplaints);
    console.info('* Percentage Resolved: ' + score.percentageResolved);
    console.info('* Avg. Resolution Time: ' + score.avgTimeToResolve);
    console.info();
  });
  console.info('---');
}

type StationComplaints = {
  [key: string]: Complaint[];
};

type StationScores = {
  [key: string]: StationScore;
};
