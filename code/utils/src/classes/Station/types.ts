import { Complaint, ComplaintStatus, IncidentType } from '..';

export type ComplaintsByStation = Record<string, Complaint[]>;
export type StationScoreByMonth = Record<string, Record<string, number>>;
export interface TimeByComplaint {
  [complaintId: string]: {
    incidentType: IncidentType;
    time: number;
    status?: ComplaintStatus;
  };
}

export type ExtendedTimeType = 'Investigation' | 'Resolution';
export type PenaltyStatus = 'Unresolved' | 'Unaddressed';

export interface ExtendedTimePenalty {
  maxPenalty: number;
  penaltyFactor: number;
}
