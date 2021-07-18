import { Complaint } from './classes/Complaint';
import { StationScore } from './classes/StationScore';

export * from './classes/Complaint';
export * from './classes/ComplaintFilters';
export * from './classes/StationScore';

export type StationComplaints = {
  [key: string]: Complaint[];
};

export type StationScores = {
  [key: string]: StationScore;
};

export type MapFilters = {
  [key in keyof Complaint]: MapFiltersValues;
};
export type MapFiltersValues = Array<string> | MapFiltersDateValues;

export type MapFiltersDateValues = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

export type ListItem =
  | string
  | {
      label: string;
      value: string | number;
    };
