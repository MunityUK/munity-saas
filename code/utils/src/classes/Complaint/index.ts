import * as ComplaintHelper from './helpers';

import { Elements } from '../../types';
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
  static create(options: CreateComplaintOptions = {}): Complaint[] {
    const { overrider, quantity = 1, status } = options;
    return Array(quantity)
      .fill(null)
      .map((_, i) => {
        return ComplaintHelper.createComplaint({
          overrider,
          status,
          currentIndex: i
        });
      });
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

export enum ComplaintStatus {
  UNADDRESSED = 'Unaddressed',
  INVESTIGATING = 'Under Investigation',
  RESOLVED = 'Resolved'
}

export const IncidentTypes = ['Assault', 'Felony', 'Misconduct'] as const;
export type IncidentType = Elements<typeof IncidentTypes>;

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

export type CreateComplaintOptions = {
  quantity?: number;
  status?: ComplaintStatus;
  overrider?: ComplaintPropertyOverrider;
};
