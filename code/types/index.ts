import { Complaint } from './classes/complaint';
import { StationScore } from './classes/score';

export * from './classes/complaint';
export * from './classes/filter';
export * from './classes/score';

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
