import { capitalCase } from 'capital-case';
import { compareAsc } from 'date-fns';

import {
  BristolPoliceStations,
  Complaint,
  ComplaintStatus,
  IncidentType
} from './Complaint';
import { Complainant, Officer, Race, Sex } from './Person';

import { ListItem, MapFiltersDateValues } from '..';

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
    const complaintFilters: ComplaintFilters = {
      dateOfComplaint: defaultDateFilters,
      dateOfAddressal: defaultDateFilters,
      dateOfResolution: defaultDateFilters,
      incidentType: [],
      station: [],
      status: [],
      officerRace: [],
      officerSex: [],
      complainantRace: [],
      complainantSex: []
    };
    return complaintFilters;
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
          const { startDate, endDate } = <MapFiltersDateValues>values;

          const date = new Date(complaint[key as ComplaintDateField]!);
          const isAfterStart = !startDate || compareAsc(date, startDate!) === 1;
          const isBeforeEnd = !endDate || compareAsc(date, endDate!) === -1;
          return isAfterStart && isBeforeEnd;
        } else if (key === 'officerRace') {
          if (!values.length) return true;
          const officers = complaint.officers as Officer[];
          return officers.some((officer) => {
            return values.includes(officer.race!);
          });
        } else if (key === 'officerSex') {
          if (!values.length) return true;
          const officers = complaint.officers as Officer[];
          return officers.some((officer) => {
            return values.includes(officer.sex!.toString());
          });
        } else if (key === 'complainantRace') {
          if (!values.length) return true;
          const complainants = complaint.complainants as Complainant[];
          return complainants.some((complainant) => {
            return values.includes(complainant.race!);
          });
        } else if (key === 'complainantSex') {
          if (!values.length) return true;
          const complainants = complaint.complainants as Complainant[];
          return complainants.some((complainant) => {
            return values.includes(complainant.sex!.toString());
          });
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
   * A type guard which verifies if the property is a Date type.
   * @param key The property to verify.
   * @returns True if the property is a date type.
   */
  static isDateProperty(
    key: keyof ComplaintFilters
  ): key is ComplaintDateField {
    return datePropFilters.includes(<ComplaintDateField>key);
  }

  // TODO: Comment;
  static isMultiValuedProperty(
    key: keyof ComplaintFilters
  ): key is ComplaintMultiValuedField {
    return multiValuedPropFilters.includes(<ComplaintMultiValuedField>key);
  }
}

const raceOptions = Object.values(Race);
const sexOptions = Object.entries(Sex).map(([key, value]) => {
  return {
    label: capitalCase(key),
    value: value
  };
});

const defaultDateFilters: MapFiltersDateValues = {
  startDate: undefined,
  endDate: undefined
};

export const FilterFields: Array<FilterField> = [
  {
    label: 'Date of Complaint',
    name: 'dateOfComplaint',
    defaultValue: defaultDateFilters
  },
  {
    label: 'Date of Addressal',
    name: 'dateOfAddressal',
    defaultValue: defaultDateFilters
  },
  {
    label: 'Date of Resolution',
    name: 'dateOfResolution',
    defaultValue: defaultDateFilters
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
    items: raceOptions,
    defaultValue: []
  },
  {
    label: 'Officer Sex',
    name: 'officerSex',
    items: sexOptions,
    defaultValue: []
  },
  {
    label: 'Complainant Race',
    name: 'complainantRace',
    items: raceOptions,
    defaultValue: []
  },
  {
    label: 'Complainant Sex',
    name: 'complainantSex',
    items: sexOptions,
    defaultValue: []
  }
];

type FilterField = {
  label: string;
  name: keyof ComplaintFilters;
  defaultValue: Array<unknown> | MapFiltersDateValues;
  items?: Array<ListItem>;
};

const datePropFilters = <const>[
  'dateOfComplaint',
  'dateOfAddressal',
  'dateOfResolution'
];

const multiValuedPropFilters = <const>[
  'officerRace',
  'officerSex',
  'complainantRace',
  'complainantSex'
];

export type ComplaintDateField = typeof datePropFilters[number];
type ComplaintMultiValuedField = typeof multiValuedPropFilters[number];
