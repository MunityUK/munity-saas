import * as faker from 'faker';

import * as ComplaintHelper from './helpers';

import { MapFiltersDateValues, MapFiltersValues } from '../..';
import { randomElement, randomEnumValue } from '../../../utils/functions';
import { Complainant, Officer } from '../Person';

export class Complaint {
  id?: number;
  complaintId?: string;
  station?: string;
  force?: string;
  dateOfComplaint?: Date;
  dateOfAddressal?: Date;
  dateOfResolution?: Date;
  incidentType?: IncidentType;
  incidentDescription?: string;
  status?: ComplaintStatus;
  notes?: string;
  city?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  complainants?: Complainant[] | string;
  officers?: Officer[] | string;

  /**
   * Generates a random complaint.
   * @returns The generated complaint.
   */
  static random() {
    const complaintId = faker.datatype
      .number(10000)
      .toString()
      .padStart(5, '0');

    const complaint = new Complaint();
    complaint.complaintId = complaintId;
    complaint.station = randomElement(BristolPoliceStations, 2);
    complaint.force = 'Avon and Somerset Constabulary';
    complaint.incidentType = randomEnumValue(IncidentType);
    complaint.incidentDescription = faker.lorem.sentence();
    complaint.status = randomEnumValue(ComplaintStatus, 2);
    complaint.notes = faker.lorem.sentence();
    complaint.city = 'Bristol';
    complaint.county = 'Avon';
    complaint.latitude = parseFloat(faker.address.latitude(51.475, 51.445, 15));
    complaint.longitude = parseFloat(faker.address.longitude(-2.57, -2.62, 15));
    complaint.dateOfComplaint = faker.date.past();

    if (complaint.status !== ComplaintStatus.UNADDRESSED) {
      complaint.dateOfAddressal = faker.date.future(
        0.2,
        complaint.dateOfComplaint
      );
    }

    if (complaint.status === ComplaintStatus.RESOLVED) {
      complaint.dateOfResolution = faker.date.future(
        0.5,
        complaint.dateOfAddressal
      );
    }

    complaint.complainants = JSON.stringify(
      Complainant.randomSet(faker.datatype.number(3))
    );
    complaint.officers = JSON.stringify(
      Officer.randomSet(faker.datatype.number(3))
    );

    return complaint;
  }

  /**
   * @see {ComplaintHelper.calculateStationScores}
   */
  static calculateStationScores(complaints: Complaint[]) {
    return ComplaintHelper.calculateStationScores(complaints);
  }

  /**
   * A type guard which verifies if the property is a Date type.
   * @param key The property to verify.
   * @param _values The values to determine types for.
   * @returns True if the property is a date type.
   */
  static isDateProperty(
    key: keyof Complaint,
    _values?: MapFiltersValues
  ): _values is MapFiltersDateValues {
    return (
      key === 'dateOfAddressal' ||
      key === 'dateOfComplaint' ||
      key === 'dateOfResolution'
    );
  }
}

export enum IncidentType {
  ASSAULT = 'Assault',
  FELONY = 'Felony',
  MISCONDUCT = 'Misconduct'
}

export enum ComplaintStatus {
  UNADDRESSED = 'Unaddressed',
  ADDRESSED = 'Addressed',
  RESOLVED = 'Resolved'
}

export type ComplaintDateField =
  | 'dateOfComplaint'
  | 'dateOfAddressal'
  | 'dateOfResolution';

export const BristolPoliceStations = [
  'Avonmouth',
  'Bishopsworth',
  'Brislington',
  'Broadbury Road',
  'Fishponds',
  'Newfoundland Road',
  'Southmead',
  'The Bridewell',
  'Trinity Road'
];
