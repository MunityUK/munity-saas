import { Complaint } from './Complaint';

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
}

export type StationScores = Record<string, Station>;
