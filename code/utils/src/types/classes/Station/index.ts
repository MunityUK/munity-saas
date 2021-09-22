import * as StationHelper from './helpers';

import { Complaint } from '../Complaint';

export class Station {
  complaints?: Complaint[];
  totalNumberOfComplaints?: number;
  numberOfComplaintsResolved?: number;
  numberOfComplaintsInvestigating?: number;
  numberOfComplaintsUnaddressed?: number;
  percentageUnaddressed?: string;
  percentageInvestigating?: string;
  percentageResolved?: string;
  percentageAttendedTo?: string;
  averageInvestigationTime?: string | null;
  averageResolutionTime?: string | null;
  averageCaseDuration?: string | null;
  finalScore?: number;

  /**
   * @see {StationHelper.groupComplaintsByStation}
   */
  static groupComplaints(complaints: Complaint[]) {
    return StationHelper.groupComplaintsByStation(complaints);
  }

  /**
   * @see {StationHelper.calculateStationScores}
   */
  static calculateScores(complaints: Complaint[]) {
    return StationHelper.calculateStationScores(complaints);
  }
}

export type StationScores = Record<string, Station>;
