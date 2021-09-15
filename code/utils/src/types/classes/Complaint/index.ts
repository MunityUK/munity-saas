import * as ComplaintHelper from './helpers';

import { ARCGIS_BASE_URL } from '../../../constants';
import { isEnumValue, writeAsList } from '../../../functions/common';
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
   * @see {ComplaintHelper.createComplaints}
   */
  static create(overrides?: ComplaintPropertyOverrides): Complaint;
  static create(
    quantity: number,
    overrides?: ComplaintPropertyOverrides
  ): Complaint[];
  static create(
    a?: number | ComplaintPropertyOverrides,
    b?: ComplaintPropertyOverrides
  ): Complaint | Complaint[] {
    let quantity = 1;
    if (typeof a === 'number') {
      quantity = a;
      return Array(quantity)
        .fill(null)
        .map(() => this.create(b));
    } else {
      return ComplaintHelper.createComplaints(a);
    }
  }

  /**
   * Validates the properties of this complaint.
   * @param complaint The complaint.
   * @throws If the complaint status is invalid.
   */
  static validate(complaint: Complaint) {
    const { status } = complaint;
    if (!isEnumValue(ComplaintStatus, status)) {
      const validStatuses = writeAsList(Object.keys(ComplaintStatus));
      throw new TypeError(
        `'${status}' is not a valid complaint status. The valid complaint status options are ${validStatuses}.`
      );
    }
  }

  /**
   * @see {ComplaintHelper.calculateStationScores}
   */
  static calculateStationScores(complaints: Complaint[]) {
    return ComplaintHelper.calculateStationScores(complaints);
  }

  /**
   * Reverse geocodes a complaint's location using its latitude and longtude.
   * @param complaint The complaint.
   * @returns A promise which resolves to the fetch response data.
   */
  static async reverseGeocodeCoordinates(complaint: Complaint) {
    const url = new URL(`${ARCGIS_BASE_URL}/reverseGeocode`);
    url.searchParams.append('f', 'pjson');
    url.searchParams.append('langCode', 'EN');
    url.searchParams.append(
      'location',
      `${complaint.longitude},${complaint.latitude}`
    );

    try {
      const res = await fetch(url.href);
      return await res.json();
    } catch (message) {
      return console.error(message);
    }
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

export type ComplaintPropertyOverrides = Omit<Partial<Complaint>, 'id'>;
