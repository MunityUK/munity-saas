import { calculateStationScores } from './utils';

import Complaint from '../../src/classes/complaint';
import StationScore from '../../src/classes/score';
import { DB_TABLE, knex } from '../config';

(async () => {
  try {
    await main();
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();

async function main() {
  const complaints = await knex(DB_TABLE).select<Complaint[]>();
  const scores = await calculateStationScores(complaints);
  printScores(scores);
}

/**
 * Prints the scores to the console in a user-friendly format.
 * @param stationScores The mapping containing scores of each station.
 */
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

type StationScores = {
  [key: string]: StationScore;
};
