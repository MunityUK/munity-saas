import { RACE_OPTIONS, SEX_OPTIONS } from 'src/utils/constants';
import {
  BristolPoliceStations,
  Complaint,
  ComplaintStatus,
  IncidentType,
  ListItem
} from 'types';

const FILTER_FIELDS: Array<FilterField> = [
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
    items: RACE_OPTIONS
  },
  {
    label: 'Officer Sex',
    name: 'officerSex',
    items: SEX_OPTIONS
  },
  {
    label: 'Complainant Race',
    name: 'complainantRace',
    items: RACE_OPTIONS
  },
  {
    label: 'Complainant Sex',
    name: 'complainantSex',
    items: SEX_OPTIONS
  }
];

export default FILTER_FIELDS;

type FilterField = {
  label: string;
  name: keyof Complaint;
  items?: Array<ListItem>;
};
