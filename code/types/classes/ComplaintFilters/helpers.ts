import { compareAsc } from 'date-fns';

import { Complaint, MapFiltersDateValues } from '../../../types';
import { Person } from '../Person';

/**
 * Determines if a specified date is within a range of values.
 * @param dateValue The specified date.
 * @param values The range of values.
 * @returns True if the date is within range.
 */
export function isDateInRange(dateValue: Date, values: MapFiltersDateValues) {
  const { startDate, endDate } = values;
  const date = new Date(dateValue);
  const isAfterStart = !startDate || compareAsc(date, startDate!) === 1;
  const isBeforeEnd = !endDate || compareAsc(date, endDate!) === -1;
  return isAfterStart && isBeforeEnd;
}

/**
 * Determines if a complaint's property matches selected values.
 * @param propertyFilter The complaint property filter key.
 * @param complaint The complaint to verify.
 * @param values The list of selected values.
 * @returns True if the complaint's property is among selected values.
 */
export function filterMultiValuedProperty(
  propertyFilter: MultiValuedPropertyFilterType,
  complaint: Complaint,
  values: string[]
): boolean {
  if (!values.length) return true;
  const { accessor, prop } = PropertyFilterMap[propertyFilter];
  const entities = complaint[accessor] as Person[];
  return entities.some((entity) => {
    return values.includes(entity[prop]!.toString());
  });
}

export const PropertyFilterMap: PropertyFilterMapType = {
  officerEthnicGroup: {
    accessor: 'officers',
    prop: 'ethnicGroup'
  },
  officerSex: {
    accessor: 'officers',
    prop: 'sex'
  },
  complainantEthnicGroup: {
    accessor: 'complainants',
    prop: 'ethnicGroup'
  },
  complainantSex: {
    accessor: 'complainants',
    prop: 'sex'
  }
};

export const MultiValuedPropertyFilters = <const>[
  'officerEthnicGroup',
  'officerSex',
  'complainantEthnicGroup',
  'complainantSex'
];

type PropertyFilterMapType = {
  [key in MultiValuedPropertyFilterType]: {
    accessor: MultiValuedPropertyType;
    prop: keyof Person;
  };
};

export type MultiValuedPropertyFilterType = typeof MultiValuedPropertyFilters[number];
type MultiValuedPropertyType = 'officers' | 'complainants';
