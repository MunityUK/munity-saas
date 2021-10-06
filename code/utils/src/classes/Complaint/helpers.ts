import { compareDesc } from 'date-fns';
import faker from 'faker';

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
import {
  isEnumMember,
  randomElement,
  randomEnumValue,
  writeAsList
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
  if (!isEnumMember(ComplaintStatus, status)) {
    const validStatuses = writeAsList(Object.keys(ComplaintStatus));
    throw new Error(
      `'${status}' is not a valid complaint status. The valid complaint status options are ${validStatuses}.`
    );
  }

  if (!dateComplaintMade) {
    throw new Error(`Complaints must have a date of creation.`);
  }

  if (status === ComplaintStatus.UNADDRESSED) {
    if (dateUnderInvestigation) {
      throw new Error(
        `Complaints with status '${status}' cannot have an 'Under Investigation' date.`
      );
    } else if (dateResolved) {
      throw new Error(
        `Complaints with status '${status}' cannot have a 'Resolved' date.`
      );
    }
  } else {
    if (!dateUnderInvestigation) {
      throw new Error(
        `Complaints with status '${status}' must have an 'Under Investigation' date.`
      );
    }

    if (compareDesc(dateComplaintMade, dateUnderInvestigation) < 1) {
      throw new Error(
        `The 'Under Investigation' must be after the complaint creation date.`
      );
    }

    if (status === ComplaintStatus.INVESTIGATING) {
      if (dateResolved) {
        throw new Error(
          `Complaints with status '${status}' cannot have a 'Resolved' date.`
        );
      }
    } else if (status === ComplaintStatus.RESOLVED) {
      if (!dateResolved) {
        throw new Error(
          `Complaints with status '${status}' must have a 'Resolved' date.`
        );
      }

      if (compareDesc(dateUnderInvestigation, dateResolved) < 1) {
        throw new Error(
          `The 'Resolved' date must be after the 'Under Investigation' date.`
        );
      }
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
    const res = await fetch(url.href);
    return await res.json();
  } catch (message) {
    return console.error(message);
  }
}

type CreateComplaintOptions = {
  overrider?: ComplaintPropertyOverrider;
  status?: ComplaintStatus;
  currentIndex?: number;
};
