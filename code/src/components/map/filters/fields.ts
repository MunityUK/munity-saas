import { RACE_OPTIONS, SEX_OPTIONS } from 'src/utils/constants';
import {
  BristolPoliceStations,
  Complaint,
  ComplaintStatus,
  IncidentType,
  ListItem
} from 'types';

export enum FilterType {
  CHECKBOXES = 'checkboxes',
  DATEPICKER = 'datepicker'
}

const FILTER_FIELDS: Array<FilterField> = [
  {
    label: 'Date of Complaint',
    name: 'dateOfComplaint',
    type: FilterType.DATEPICKER
  },
  {
    label: 'Incident Type',
    name: 'incidentType',
    items: Object.values(IncidentType),
    type: FilterType.CHECKBOXES
  },
  {
    label: 'Station',
    name: 'station',
    items: BristolPoliceStations,
    type: FilterType.CHECKBOXES
  },
  {
    label: 'Status',
    name: 'status',
    items: Object.values(ComplaintStatus),
    type: FilterType.CHECKBOXES
  },
  {
    label: 'Officer Race',
    name: 'officerRace',
    items: RACE_OPTIONS,
    type: FilterType.CHECKBOXES
  },
  {
    label: 'Officer Sex',
    name: 'officerSex',
    items: SEX_OPTIONS,
    type: FilterType.CHECKBOXES
  },
  {
    label: 'Complainant Race',
    name: 'complainantRace',
    items: RACE_OPTIONS,
    type: FilterType.CHECKBOXES
  },
  {
    label: 'Complainant Sex',
    name: 'complainantSex',
    items: SEX_OPTIONS,
    type: FilterType.CHECKBOXES
  }
];

export default FILTER_FIELDS;

type FilterField = {
  label: string;
  name: keyof Complaint;
  type: FilterType;
  items?: Array<ListItem>;
};
