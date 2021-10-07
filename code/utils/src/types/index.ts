export type Elements<T extends readonly string[]> = T[number];
export type Values<T> = T[keyof T];

export type DateRangeValues = {
  startDate: DateType;
  endDate: DateType;
};

export type DateType = Date | null | undefined;

export type ListItem =
  | string
  | {
      label: string;
      value: string | number;
    };
export type ListItemGroups = {
  [key in string]: ListItem[];
};
