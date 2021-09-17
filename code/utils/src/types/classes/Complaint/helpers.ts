import faker from 'faker';

import {
  BristolPoliceStations,
  Complainant,
  Complaint,
  ComplaintPropertyOverrides,
  ComplaintStatus,
  IncidentType,
  Officer
} from '../..';
import { ARCGIS_BASE_URL } from '../../../constants';
import {
  isEnumValue,
  randomElement,
  randomEnumValue,
  writeAsList
} from '../../../functions/common';

/**
 * Creates random complaints.
 * @param overrides The complaint property overrides.
 * @returns The generated complaint.
 */
export function createComplaints(overrides?: ComplaintPropertyOverrides) {
  const complaint = new Complaint();
  complaint.complaintId =
    overrides?.complaintId ??
    faker.datatype.number(10000).toString().padStart(5, '0');
  complaint.station =
    overrides?.station ?? randomElement(BristolPoliceStations, 2);
  complaint.force = 'Avon and Somerset Constabulary';
  complaint.incidentType = randomEnumValue(IncidentType);
  complaint.incidentDescription = faker.lorem.sentence();
  complaint.status = overrides?.status ?? randomEnumValue(ComplaintStatus, 2);
  complaint.notes = faker.lorem.sentence();
  complaint.city = 'Bristol';
  complaint.county = 'Avon';
  complaint.latitude = parseFloat(faker.address.latitude(51.475, 51.445, 15));
  complaint.longitude = parseFloat(faker.address.longitude(-2.57, -2.62, 15));
  complaint.dateComplaintMade =
    overrides?.dateComplaintMade ?? faker.date.past();

  if (complaint.status !== ComplaintStatus.UNADDRESSED) {
    complaint.dateUnderInvestigation =
      overrides?.dateUnderInvestigation ??
      faker.date.future(0.2, new Date(complaint.dateComplaintMade));
  }

  if (complaint.status === ComplaintStatus.RESOLVED) {
    complaint.dateResolved =
      overrides?.dateResolved ??
      faker.date.future(0.5, new Date(complaint.dateUnderInvestigation!));
  }

  complaint.complainants = JSON.stringify(
    Complainant.randomSet(faker.datatype.number({ min: 1, max: 3 }))
  );
  complaint.officers = JSON.stringify(
    Officer.randomSet(faker.datatype.number({ min: 1, max: 3 }))
  );

  validateComplaint(complaint);
  return complaint;
}

/**
 * Validates the properties of this complaint.
 * @param complaint The complaint.
 * @throws If the complaint status is invalid.
 */
export function validateComplaint(complaint: Complaint) {
  const { status } = complaint;
  if (!isEnumValue(ComplaintStatus, status)) {
    const validStatuses = writeAsList(Object.keys(ComplaintStatus));
    throw new TypeError(
      `'${status}' is not a valid complaint status. The valid complaint status options are ${validStatuses}.`
    );
  }
}

/**
 * Reverse geocodes a complaint's location using its latitude and longtude.
 * @param complaint The complaint.
 */
export async function reverseGeocodeCoordinates(complaint: Complaint) {
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
