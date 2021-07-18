import { capitalCase } from 'capital-case';
import { compareAsc } from 'date-fns';

import {
  BristolPoliceStations,
  Complaint,
  ComplaintStatus,
  IncidentType,
  ListItem,
  MapFilters,
  Race,
  Sex
} from 'types';

export class ComplaintFilters {
  /**
   * Initialise the complaint filters.
   */
  constructor() {
    const mapFilters: MapFilters = {};
    FilterFields.forEach(({ name }) => {
      if (Complaint.isDateProperty(name)) {
        mapFilters[name] = {
          startDate: undefined,
          endDate: undefined
        };
      } else {
        mapFilters[name] = [];
      }
    });
    return mapFilters;
  }

  /**
   * Filter the list of complaints by specified property.
   * @param complaints The full list of complaints.
   * @param filters The current collection of filters.
   * @returns The filtered list of complaints.
   */
  static filter(
    complaints: Array<Complaint>,
    filters: MapFilters
  ): Array<Complaint> {
    const filteredComplaints = complaints.filter((complaint) => {
      return Object.entries(filters).every(([property, values]) => {
        const key = property as keyof Complaint;
        if (Complaint.isDateProperty(key, values)) {
          const { startDate, endDate } = values;

          const date = new Date(complaint[key]!);
          const isAfterStart = !startDate || compareAsc(date, startDate!) === 1;
          const isBeforeEnd = !endDate || compareAsc(date, endDate!) === -1;
          return isAfterStart && isBeforeEnd;
        } else {
          if (!values || !values.length) return true;
          return values.includes(complaint[key]!.toString());
        }
      });
    });
    return filteredComplaints;
  }
}

const raceOptions = Object.values(Race);
const sexOptions = Object.entries(Sex).map(([key, value]) => {
  return {
    label: capitalCase(key),
    value: value
  };
});

export const FilterFields: Array<FilterField> = [
  {
    label: 'Date of Complaint',
    name: 'dateOfComplaint'
  },
  {
    label: 'Date of Addressal',
    name: 'dateOfAddressal'
  },
  {
    label: 'Date of Resolution',
    name: 'dateOfResolution'
  },
  {
    label: 'Incident Type',
    name: 'incidentType',
    items: Object.values(IncidentType)
  },
  {
    label: 'Station',
    name: 'station',
    items: BristolPoliceStations
  },
  {
    label: 'Status',
    name: 'status',
    items: Object.values(ComplaintStatus)
  },
  {
    label: 'Officer Race',
    name: 'officerRace',
    items: raceOptions
  },
  {
    label: 'Officer Sex',
    name: 'officerSex',
    items: sexOptions
  },
  {
    label: 'Complainant Race',
    name: 'complainantRace',
    items: raceOptions
  },
  {
    label: 'Complainant Sex',
    name: 'complainantSex',
    items: sexOptions
  }
];

type FilterField = {
  label: string;
  name: keyof Complaint;
  items?: Array<ListItem>;
};
