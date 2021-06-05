import { assert } from 'chai';

import { Complaint, ComplaintStatus } from '../../types';
import { calculateStationScores, round } from '../../utils/functions';

describe('ComRank Tests', function () {
  it('Calculate station scores', function () {
    const stationName = 'Station';
    const expNumOfComplaints = 5;
    let numOfAddressed = 0;
    let numOfResolved = 0;

    const complaints: Complaint[] = [];

    for (let i = 0; i < expNumOfComplaints; i++) {
      const complaint = Complaint.random();
      complaint.station = 'Station';
      complaint.dateOfComplaint = new Date(2000, 0, 1);
      complaint.dateOfAddressal = new Date(2000, 0, 15);
      complaint.dateOfResolution = new Date(2000, 0, 31);
      complaints.push(complaint);

      if (complaint.status === ComplaintStatus.ADDRESSED) {
        numOfAddressed++;
      } else if (complaint.status === ComplaintStatus.RESOLVED) {
        numOfAddressed++;
        numOfResolved++;
      }
    }

    const expPctAddressed =
      round((numOfAddressed / expNumOfComplaints) * 100) + '%';
    const expPctResolved =
      round((numOfResolved / expNumOfComplaints) * 100) + '%';

    const scores = calculateStationScores(complaints)[stationName];
    assert.strictEqual(scores.numberOfComplaints, expNumOfComplaints);
    assert.strictEqual(scores.percentageAddressed, expPctAddressed);
    assert.strictEqual(scores.percentageResolved, expPctResolved);
    assert.strictEqual(scores.avgAddressalTime, '14 days');
    assert.strictEqual(scores.avgResolutionTime, '30 days');
  });
});
