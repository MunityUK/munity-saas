import {
  filterMultiValuedProperty,
  MultiValuedPropertyFilters,
  MultiValuedPropertyFilterType
} from './helpers';

import { isDateInRange } from '../../functions/common';
import {
  DateRangeValues,
  Elements,
  ListItem,
  ListItemGroups
} from '../../types';
import {
  BristolPoliceStations,
  Complaint,
  ComplaintStatus,
  IncidentTypes
} from '../Complaint';
import { EthnicGroupOptions, SexOptions } from '../Person';

export class ComplaintFilters {
  dateComplaintMade?: DateRangeValues;
  dateUnderInvestigation?: DateRangeValues;
  dateResolved?: DateRangeValues;
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
      dateComplaintMade: DefaultDateFilters,
      dateUnderInvestigation: DefaultDateFilters,
      dateResolved: DefaultDateFilters,
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

const DefaultDateFilters: DateRangeValues = {
  startDate: undefined,
  endDate: undefined
};

const DatePropertyFilters = <const>[
  'dateComplaintMade',
  'dateUnderInvestigation',
  'dateResolved'
];

export const ComplaintFilterFields: Array<ComplaintFilterFieldType> = [
  {
    label: 'Date of Complaint',
    name: 'dateComplaintMade',
    defaultValue: DefaultDateFilters,
    type: 'date'
  },
  {
    label: 'Date of Investigation',
    name: 'dateUnderInvestigation',
    defaultValue: DefaultDateFilters,
    type: 'date'
  },
  {
    label: 'Date of Resolution',
    name: 'dateResolved',
    defaultValue: DefaultDateFilters,
    type: 'date'
  },
  {
    label: 'Incident Type',
    name: 'incidentType',
    items: IncidentTypes,
    defaultValue: [],
    type: 'list'
  },
  {
    label: 'Station',
    name: 'station',
    items: BristolPoliceStations,
    defaultValue: [],
    type: 'list'
  },
  {
    label: 'Status',
    name: 'status',
    items: ComplaintStatus ? Object.values(ComplaintStatus) : [],
    defaultValue: [],
    type: 'list'
  },
  {
    label: 'Officer Ethnic Group',
    name: 'officerEthnicGroup',
    itemGroups: EthnicGroupOptions,
    defaultValue: [],
    type: 'grouped-list'
  },
  {
    label: 'Officer Sex',
    name: 'officerSex',
    items: SexOptions,
    defaultValue: [],
    type: 'list'
  },
  {
    label: 'Complainant Ethnic Group',
    name: 'complainantEthnicGroup',
    itemGroups: EthnicGroupOptions,
    defaultValue: [],
    type: 'grouped-list'
  },
  {
    label: 'Complainant Sex',
    name: 'complainantSex',
    items: SexOptions,
    defaultValue: [],
    type: 'list'
  }
];

export type ComplaintDateProperty = Elements<typeof DatePropertyFilters>;

type ComplaintFilterFieldType =
  | {
      label: string;
      name: keyof ComplaintFilters;
    } & (
      | {
          type: 'date';
          defaultValue: DateRangeValues;
        }
      | {
          type: 'list';
          defaultValue: Array<unknown>;
          items: readonly ListItem[];
        }
      | {
          type: 'grouped-list';
          defaultValue: Array<unknown>;
          itemGroups: ListItemGroups;
        }
    );
