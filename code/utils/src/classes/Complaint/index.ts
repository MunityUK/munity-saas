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
  static create(options: CreateComplaintOptions = {}): Complaint[] {
    const { overrider, quantity = 1, status } = options;

    const complaints = [];
    for (let i = 1; i <= quantity; i++) {
      const complaint = ComplaintHelper.createComplaint({
        overrider,
        status,
        currentIndex: i
      });
      complaints.push(complaint);
    }
    return complaints;
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

export enum IncidentType {
  VERBAL_ABUSE = 'Verbal Abuse',
  BRUTALITY = 'Brutality',
  HARASSMENT = 'Harassment',
  ID_REFUSAL = 'Refusal To Give ID',
  EXCESSIVE_FORCE = 'Excessive Force'
}

export const IncidentTypes = Object.values(IncidentType);

export const IncidentTypeSeverities = {
  [IncidentType.VERBAL_ABUSE]: 'LOW',
  [IncidentType.ID_REFUSAL]: 'LOW',
  [IncidentType.HARASSMENT]: 'MEDIUM',
  [IncidentType.EXCESSIVE_FORCE]: 'MEDIUM',
  [IncidentType.BRUTALITY]: 'HIGH'
} as const;

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
