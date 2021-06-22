import { Complaint } from './classes/complaint';
import { StationScore } from './classes/score';

export * from './classes/complaint';
export * from './classes/score';

export type StationComplaints = {
  [key: string]: Complaint[];
};

export type StationScores = {
  [key: string]: StationScore;
};

export type ListItem =
  | string
  | {
      label: string;
      value: string | number;
    };
