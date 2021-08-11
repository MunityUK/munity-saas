import { StationScore } from './classes/StationScore';

export * from './classes/Complaint';
export * from './classes/ComplaintFilters';
export * from './classes/StationScore';

export type StationScores = {
  [key: string]: StationScore;
};

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
