import { capitalCase } from 'capital-case';

import {
  filterMultiValuedProperty,
  isDateInRange,
  MultiValuedPropertyFilters,
  MultiValuedPropertyFilterType
} from './helpers';

import { ListItemGroups, ListItems, MapFiltersDateValues } from '../..';
import {
  BristolPoliceStations,
  Complaint,
  ComplaintStatus,
  IncidentType
} from '../Complaint';
import { EthnicGroup, Sex } from '../Person';

export class ComplaintFilters {
  dateOfComplaint?: MapFiltersDateValues;
  dateOfAddressal?: MapFiltersDateValues;
  dateOfResolution?: MapFiltersDateValues;
  incidentType?: Set<string>;
  station?: Set<string>;
  status?: Set<string>;
  officerEthnicGroup?: Set<string>;
  officerSex?: Set<string>;
  complainantEthnicGroup?: Set<string>;
  complainantSex?: Set<string>;

  /**
   * Initialise the complaint filters.
   */
  constructor() {
    return {
      dateOfComplaint: DefaultDateFilters,
      dateOfAddressal: DefaultDateFilters,
      dateOfResolution: DefaultDateFilters,
      incidentType: new Set(),
      station: new Set(),
      status: new Set(),
      officerEthnicGroup: new Set(),
      officerSex: new Set(),
      complainantEthnicGroup: new Set(),
      complainantSex: new Set()
    };
  }

  /**
   * Filter the list of complaints by specified property.
   * @param complaints The full list of complaints.
   * @param filters The current collection of filters.
   * @returns The filtered list of complaints.
   */
  static filter(
    complaints: Array<Complaint>,
    filters: ComplaintFilters
  ): Array<Complaint> {
    const filteredComplaints = complaints.filter((complaint) => {
      return Object.entries(filters).every(([property, values]) => {
        const key = property as keyof ComplaintFilters;
        if (this.isDateProperty(key)) {
          const date = complaint[key as ComplaintDateProperty]!;
          return isDateInRange(date, values);
        } else if (this.isMultiValuedProperty(key)) {
          return filterMultiValuedProperty(key, complaint, Array.from(values));
        } else {
          const options = Array.from(values);
          if (!options || !options.length) return true;
          return options.includes(complaint[key]!);
        }
      });
    });
    return filteredComplaints;
  }

  /**
   * A type guard which verifies if the property is a date type.
   * @param property The property to verify.
   * @returns True if the property is a date type.
   */
  static isDateProperty(
    property: keyof ComplaintFilters
  ): property is ComplaintDateProperty {
    return DatePropertyFilters.includes(<ComplaintDateProperty>property);
  }

  /**
   * A type guard which verifies if a property is multivalued .
   * @param property The property to verify.
   * @returnsTrue if the property is multivalued.
   */
  static isMultiValuedProperty(
    property: keyof ComplaintFilters
  ): property is MultiValuedPropertyFilterType {
    return MultiValuedPropertyFilters.includes(
      <MultiValuedPropertyFilterType>property
    );
  }
}

const DefaultDateFilters: MapFiltersDateValues = {
  startDate: undefined,
  endDate: undefined
};

const DatePropertyFilters = <const>[
  'dateOfComplaint',
  'dateOfAddressal',
  'dateOfResolution'
];

const EthnicGroupOptions = {
  White: [
    EthnicGroup.WHITE_BRITISH,
    EthnicGroup.WHITE_GYPSY,
    EthnicGroup.WHITE_IRISH,
    EthnicGroup.WHITE_OTHER
  ],
  Mixed: [
    EthnicGroup.MIXED_AFRICAN,
    EthnicGroup.MIXED_CARIBBEAN,
    EthnicGroup.MIXED_ASIAN,
    EthnicGroup.MIXED_OTHER
  ],
  Asian: [
    EthnicGroup.ASIAN_INDIAN,
    EthnicGroup.ASIAN_PAKISTANI,
    EthnicGroup.ASIAN_BANGLADESHI,
    EthnicGroup.ASIAN_CHINESE,
    EthnicGroup.ASIAN_OTHER
  ],
  Black: [
    EthnicGroup.BLACK_AFRICAN,
    EthnicGroup.BLACK_CARIBBEAN,
    EthnicGroup.BLACK_OTHER
  ],
  Other: [EthnicGroup.ARAB, EthnicGroup.OTHER]
};
const SexOptions = Object.entries(Sex).map(([key, value]) => {
  return {
    label: capitalCase(key),
    value: value
  };
});

export const ComplaintFilterFields: Array<ComplaintFilterFieldType> = [
  {
    label: 'Date of Complaint',
    name: 'dateOfComplaint',
    defaultValue: DefaultDateFilters
  },
  {
    label: 'Date of Addressal',
    name: 'dateOfAddressal',
    defaultValue: DefaultDateFilters
  },
  {
    label: 'Date of Resolution',
    name: 'dateOfResolution',
    defaultValue: DefaultDateFilters
  },
  {
    label: 'Incident Type',
    name: 'incidentType',
    items: Object.values(IncidentType),
    defaultValue: []
  },
  {
    label: 'Station',
    name: 'station',
    items: BristolPoliceStations,
    defaultValue: []
  },
  {
    label: 'Status',
    name: 'status',
    items: Object.values(ComplaintStatus),
    defaultValue: []
  },
  {
    label: 'Officer Ethnic Group',
    name: 'officerEthnicGroup',
    itemGroups: EthnicGroupOptions,
    defaultValue: []
  },
  {
    label: 'Officer Sex',
    name: 'officerSex',
    items: SexOptions,
    defaultValue: []
  },
  {
    label: 'Complainant Ethnic Group',
    name: 'complainantEthnicGroup',
    itemGroups: EthnicGroupOptions,
    defaultValue: []
  },
  {
    label: 'Complainant Sex',
    name: 'complainantSex',
    items: SexOptions,
    defaultValue: []
  }
];

export type ComplaintDateProperty = typeof DatePropertyFilters[number];
type ComplaintFilterFieldType = {
  label: string;
  name: keyof ComplaintFilters;
  defaultValue: Array<unknown> | MapFiltersDateValues;
  items?: ListItems;
  itemGroups?: ListItemGroups
};
