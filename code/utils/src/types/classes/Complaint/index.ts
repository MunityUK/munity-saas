import * as ComplaintHelper from './helpers';

import { Complainant, Officer } from '../Person';

export class Complaint {
  id?: number;
  complaintId?: string;
  station?: string;
  force?: string;
  dateComplaintMade?: Date | number;
  dateUnderInvestigation?: Date | number;
  dateResolved?: Date | number;
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
   * @see {ComplaintHelper.createComplaint}
   */
  static create(overrider?: ComplaintPropertyOverrider): Complaint;
  static create(
    quantity: number,
    overrider?: ComplaintPropertyOverrider
  ): Complaint[];
  static create(
    a?: number | ComplaintPropertyOverrider,
    b?: ComplaintPropertyOverrider
  ): Complaint | Complaint[] {
    if (typeof a === 'number') {
      return Array(a)
        .fill(null)
        .map((_, i) => {
          return ComplaintHelper.createComplaint({
            overrider: b,
            currentIndex: i
          });
        });
    } else {
      return ComplaintHelper.createComplaint({ overrider: a });
    }
  }

  /**
   * @see {ComplaintHelper.validateComplaint}
   */
  static validate(complaint: Complaint) {
    ComplaintHelper.validateComplaint(complaint);
  }

  /**
   * @see {ComplaintHelper.reverseGeocodeCoordinates}
   */
  static async reverseGeocodeCoordinates(complaint: Complaint) {
    return await ComplaintHelper.reverseGeocodeCoordinates(complaint);
  }
}

export enum IncidentType {
  ASSAULT = 'Assault',
  FELONY = 'Felony',
  MISCONDUCT = 'Misconduct'
}

export enum ComplaintStatus {
  UNADDRESSED = 'Unaddressed',
  INVESTIGATING = 'Under Investigation',
  RESOLVED = 'Resolved'
}

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

export type ComplaintPropertyOverrider = (
  complaint: Complaint,
  index: number
) => Omit<Partial<Complaint>, 'id'>;
