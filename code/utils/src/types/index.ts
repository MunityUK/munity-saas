export type DateRangeValues = {
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
