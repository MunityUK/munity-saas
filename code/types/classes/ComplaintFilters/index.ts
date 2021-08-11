import { capitalCase } from 'capital-case';

import {
  filterMultiValuedProperty,
  isDateInRange,
  MultiValuedPropertyFilters,
  MultiValuedPropertyFilterType
} from './helpers';

import { ListItem, MapFiltersDateValues } from '../..';
import {
  BristolPoliceStations,
  Complaint,
  ComplaintStatus,
  IncidentType
} from '../Complaint';
import { Race, Sex } from '../Person';

export class ComplaintFilters {
  dateOfComplaint?: MapFiltersDateValues;
  dateOfAddressal?: MapFiltersDateValues;
  dateOfResolution?: MapFiltersDateValues;
  incidentType?: string[];
  station?: string[];
  status?: string[];
  officerRace?: string[];
  officerSex?: string[];
  complainantRace?: string[];
  complainantSex?: string[];

  /**
   * Initialise the complaint filters.
   */
  constructor() {
    return {
      dateOfComplaint: DefaultDateFilters,
      dateOfAddressal: DefaultDateFilters,
      dateOfResolution: DefaultDateFilters,
      incidentType: [],
      station: [],
      status: [],
      officerRace: [],
      officerSex: [],
      complainantRace: [],
      complainantSex: []
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
          return filterMultiValuedProperty(key, complaint, values);
        } else {
          const options = <string[]>values;
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

const RaceOptions = Object.values(Race);
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
    label: 'Officer Race',
    name: 'officerRace',
    items: RaceOptions,
    defaultValue: []
  },
  {
    label: 'Officer Sex',
    name: 'officerSex',
    items: SexOptions,
    defaultValue: []
  },
  {
    label: 'Complainant Race',
    name: 'complainantRace',
    items: RaceOptions,
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
  items?: Array<ListItem>;
};
