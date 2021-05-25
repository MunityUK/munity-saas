import Complaint from 'src/classes/complaint';
import ComplaintScore from 'src/classes/score';

import { DB_TABLE, knex } from '../config';

(async () => {
  try {
    const complaintsByStation: StationComplaints = {};
    const complaints = await knex(DB_TABLE).select<Complaint[]>();

    complaints.forEach((complaint) => {

      // const score = new ComplaintScore();
      // score.

      const array = complaintsByStation[complaint.station!] ?? [];
      array.push(complaint);
      complaintsByStation[complaint.station!] = array;
    });

    console.log(Object.keys(complaintsByStation));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();

type StationComplaints = {
  [key: string]: Complaint[];
};
