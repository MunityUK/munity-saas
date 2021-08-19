import { Complaint, StationScore } from '../../types';
import { run } from '../../utils/functions/test';
import knex, { DB_TABLE } from '../../utils/knex';

run(main);

async function main() {
  const complaints = await knex(DB_TABLE).select<Complaint[]>();
  const scores = Complaint.calculateStationScores(complaints);
  printScores(scores);
}

/**
 * Prints the scores to the console in a user-friendly format.
 * @param stationScores The mapping containing scores of each station.
 */
function printScores(stationScores: StationScores) {
  console.info('---');
  Object.entries(stationScores).forEach(([station, score], i, array) => {
    console.info(`**** Station #${i + 1}: ${station}`);
    console.info('> Total Number of Complaints: ' + score.totalNumberOfComplaints);
    console.info('> Number of Complaints Unaddressed: ' + score.numberOfComplaintsUnaddressed);
    console.info('> Number of Complaints Investigating: ' + score.numberOfComplaintsInvestigating);
    console.info('> Number of Complaints Resolved: ' + score.numberOfComplaintsResolved);
    console.info('> Percentage Unaddressed: ' + score.percentageUnaddressed);
    console.info('> Percentage Investigating: ' + score.percentageInvestigating);
    console.info('> Percentage Resolved: ' + score.percentageResolved);
    console.info('> Avg. Investigation Time: ' + score.averageInvestigationTime);
    console.info('> Avg. Resolution Time: ' + score.averageResolutionTime);
    console.info('> Avg. Case Duration: ' + score.averageCaseDuration);
    console.info('**** Score: ' + score.finalScore + ' / 100 ****');

    const isLastItem = i === array.length - 1;
    console.info(isLastItem ? '---' : '');
  });
}

type StationScores = {
  [key: string]: StationScore;
};
