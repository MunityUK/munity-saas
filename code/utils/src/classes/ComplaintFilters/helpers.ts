import { Complaint } from '../..';
import { Person } from '../Person';

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

export type MultiValuedPropertyFilterType =
  typeof MultiValuedPropertyFilters[number];
type MultiValuedPropertyType = 'officers' | 'complainants';
