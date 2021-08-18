import * as faker from 'faker';

import * as ComplaintHelper from './helpers';

import { ARCGIS_BASE_URL } from '../../../utils/constants';
import { randomElement, randomEnumValue } from '../../../utils/functions';
import { Complainant, Officer } from '../Person';

export class Complaint {
  id?: number;
  complaintId?: string;
  station?: string;
  force?: string;
  dateComplaintMade?: Date;
  dateUnderInvestigation?: Date;
  dateResolved?: Date;
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
  static random(options?: RandomComplaintOptions) {
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
    complaint.status = options?.status ?? randomEnumValue(ComplaintStatus, 2);
    complaint.notes = faker.lorem.sentence();
    complaint.city = 'Bristol';
    complaint.county = 'Avon';
    complaint.latitude = parseFloat(faker.address.latitude(51.475, 51.445, 15));
    complaint.longitude = parseFloat(faker.address.longitude(-2.57, -2.62, 15));
    complaint.dateComplaintMade = faker.date.past();

    if (complaint.status !== ComplaintStatus.UNADDRESSED) {
      complaint.dateUnderInvestigation = faker.date.future(
        0.2,
        complaint.dateComplaintMade
      );
    }

    if (complaint.status === ComplaintStatus.RESOLVED) {
      complaint.dateResolved = faker.date.future(
        0.5,
        complaint.dateUnderInvestigation
      );
    }

    complaint.complainants = JSON.stringify(
      Complainant.randomSet(faker.datatype.number({ min: 1, max: 3 }))
    );
    complaint.officers = JSON.stringify(
      Officer.randomSet(faker.datatype.number({ min: 1, max: 3 }))
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

type RandomComplaintOptions = {
  status?: ComplaintStatus;
}