import { assert } from 'chai';

import { Complaint, ComplaintStatus } from '../../types';
import { calculateStationScores, round } from '../../utils/functions';

describe('ComRank Tests', function () {
  it('Calculate station scores', function () {
    const stationName = 'Station';
    const expNumOfComplaints = 5;
    let numOfResolved = 0;

    const complaints: Complaint[] = [];

    for (let i = 0; i < expNumOfComplaints; i++) {
      const complaint = Complaint.random();
      complaint.station = 'Station';
      complaint.startDate = new Date(2000, 0, 1);
      complaint.endDate = new Date(2000, 0, 31);
      complaints.push(complaint);

      if (complaint.status === ComplaintStatus.RESOLVED) {
        numOfResolved++;
      }
    }

    const expPctResolved =
      round((numOfResolved / expNumOfComplaints) * 100, 1) + '%';

    const scores = calculateStationScores(complaints)[stationName];
    assert.strictEqual(scores.numberOfComplaints, expNumOfComplaints);
    assert.strictEqual(scores.percentageResolved, expPctResolved);
    assert.strictEqual(scores.avgTimeToResolve, '30 days');
  });
});
