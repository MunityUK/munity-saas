import axios from 'axios';
import { compareDesc } from 'date-fns';
import faker from 'faker';
import invariant from 'tiny-invariant';

import { URL } from 'url';

import {
  BristolPoliceStations,
  Complainant,
  Complaint,
  ComplaintPropertyOverrider,
  ComplaintStatus,
  IncidentTypes,
  Officer
} from '../..';
import { ARCGIS_BASE_URL } from '../../constants';
import Messages from '../../constants/messages';
import {
  interpolate,
  isEnumMember,
  randomElement,
  randomEnumValue
} from '../../functions/common';

/**
 * Creates a random complaint.
 * @param options The complaint creation options.
 * @returns The generated complaint.
 */
export function createComplaint(options: CreateComplaintOptions) {
  const { overrider, currentIndex, status } = options;

  let complaint = new Complaint();
  complaint.complaintId = faker.datatype
    .number(10000)
    .toString()
    .padStart(5, '0');
  complaint.station = randomElement(BristolPoliceStations, 2);
  complaint.force = 'Avon and Somerset Constabulary';
  complaint.incidentType = randomElement(IncidentTypes);
  complaint.incidentDescription = faker.lorem.sentence();
  complaint.status = status ?? randomEnumValue(ComplaintStatus, 2);
  complaint.notes = faker.lorem.sentence();
  complaint.city = 'Bristol';
  complaint.county = 'Avon';
  complaint.latitude = parseFloat(faker.address.latitude(51.475, 51.445, 15));
  complaint.longitude = parseFloat(faker.address.longitude(-2.57, -2.62, 15));
  complaint.dateComplaintMade = faker.date.past();

  if (complaint.status !== ComplaintStatus.UNADDRESSED) {
    complaint.dateUnderInvestigation = faker.date.future(
      0.2,
      new Date(complaint.dateComplaintMade)
    );
  }

  if (complaint.status === ComplaintStatus.RESOLVED) {
    complaint.dateResolved = faker.date.future(
      0.5,
      new Date(complaint.dateUnderInvestigation!)
    );
  }

  complaint.complainants = JSON.stringify(
    Complainant.randomSet(faker.datatype.number({ min: 1, max: 3 }))
  );
  complaint.officers = JSON.stringify(
    Officer.randomSet(faker.datatype.number({ min: 1, max: 3 }))
  );

  if (overrider) {
    complaint = { ...complaint, ...overrider(complaint, currentIndex!) };
  }

  validateComplaint(complaint);
  return complaint;
}

/**
 * Validates the properties of this complaint.
 * @param complaint The complaint.
 * @throws If the complaint status is invalid.
 */
export function validateComplaint(complaint: Complaint) {
  const { dateComplaintMade, dateUnderInvestigation, dateResolved, status } =
    complaint;

  invariant(
    isEnumMember(ComplaintStatus, status),
    interpolate(Messages.INVALID_COMPLAINT_STATUS, status!)
  );
  invariant(dateComplaintMade, Messages.MUST_HAVE_CREATION_DATE);

  if (status === ComplaintStatus.UNADDRESSED) {
    invariant(
      !dateUnderInvestigation,
      interpolate(Messages.CANNOT_HAVE_INVESTIGATION_DATE, status)
    );
    invariant(
      !dateResolved,
      interpolate(Messages.CANNOT_HAVE_RESOLVED_DATE, status)
    );
  } else {
    invariant(
      dateUnderInvestigation,
      interpolate(Messages.MUST_HAVE_INVESTIGATION_DATE, status!)
    );
    invariant(
      compareDesc(dateComplaintMade, dateUnderInvestigation) >= 1,
      Messages.INVESTIGATION_DATE_AFTER_CREATION_DATE
    );

    if (status === ComplaintStatus.INVESTIGATING) {
      invariant(
        !dateResolved,
        interpolate(Messages.CANNOT_HAVE_RESOLVED_DATE, status)
      );
    } else if (status === ComplaintStatus.RESOLVED) {
      invariant(
        dateResolved,
        interpolate(Messages.MUST_HAVE_RESOLVED_DATE, status!)
      );

      invariant(
        compareDesc(dateComplaintMade, dateUnderInvestigation) >= 1,
        Messages.INVESTIGATION_DATE_BEFORE_RESOLVED_DATE
      );
    }
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
    const res = await axios(url.href);
    return res.data();
  } catch (message) {
    return console.error(message);
  }
}

type CreateComplaintOptions = {
  overrider?: ComplaintPropertyOverrider;
  status?: ComplaintStatus;
  currentIndex?: number;
};
