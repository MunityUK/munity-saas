import { Complaint } from '..';

export type ComplaintsByStation = Record<string, Complaint[]>;
export type StationScoreByMonth = Record<string, Record<string, number>>;
export type TimeByComplaint = Record<string, number>;

export type ExtendedTimeType = 'Investigation' | 'Resolution';
export type PenaltyStatus = 'Unresolved' | 'Unaddressed';

export type ExtendedTimePenalty = {
  maxPenalty: number;
  penaltyFactor: number;
};
