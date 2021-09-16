export * from './classes/Complaint';
export * from './classes/ComplaintFilters';
export * from './classes/Person';
export * from './classes/Station';

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
export type ListItemGroups = {
  [key in string]: ListItem[];
};
