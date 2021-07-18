import * as faker from 'faker';

import { MapFiltersDateValues, MapFiltersValues } from 'types';

export class Complaint {
  id?: number;
  reportId?: string;
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
  complainantAge?: number;
  complainantRace?: string;
  complainantSex?: Sex;
  officerId?: string | number;
  officerAge?: number;
  officerRace?: string;
  officerSex?: Sex;

  /**
   * Generates a random complaint.
   * @returns The generated complaint.
   */
  static random() {
    const complaint = new Complaint();
    complaint.reportId = faker.datatype
      .number(10000)
      .toString()
      .padStart(5, '0');
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
    complaint.complainantAge = faker.datatype.number({ min: 18, max: 65 });
    complaint.complainantSex = randomElement(SexDistribution);
    complaint.complainantRace = randomEnumValue(Race, 3);
    complaint.officerId =
      'OI' + faker.datatype.number().toString().padStart(5, '0');
    complaint.officerAge = faker.datatype.number({ min: 25, max: 55 });
    complaint.officerSex = randomElement(SexDistribution);
    complaint.officerRace = randomEnumValue(Race, 2);
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

    return complaint;
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

export enum Race {
  BLACK = 'Black',
  MIXED = 'Mixed',
  ASIAN = 'Asian',
  WHITE = 'White',
  OTHER = 'Other'
}

export enum Sex {
  MALE = '1',
  FEMALE = '2',
  INDETERMINATE = '9',
  UNKNOWN = '0'
}

export const SexLookup = {
  '1': 'Male',
  '2': 'Female',
  '9': 'Indeterminate',
  '0': 'Unknown'
};

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

const SexDistribution = [
  { sex: Sex.UNKNOWN, probability: 2 },
  { sex: Sex.MALE, probability: 49 },
  { sex: Sex.FEMALE, probability: 48 },
  { sex: Sex.INDETERMINATE, probability: 1 }
].flatMap(({ sex, probability }) => {
  return Array(probability).fill(parseInt(sex));
});

/**
 * Produces a random value from an enum.
 * @param enumeration The enum.
 * @param randSum The number of times random is summed.
 * @returns The random enum value.
 */
function randomEnumValue<T>(enumeration: T, randSum = 1): T[keyof T] {
  return randomElement(Object.values(enumeration), randSum);
}

/**
 * Produces a random element from an array. Uses Gaussian randomness.
 * @param array The array.
 * @param randSum The number of times random is summed.
 * @returns The random element.
 */
function randomElement<T>(array: T[], randSum = 1): T {
  let r = 0;
  for (let i = randSum; i > 0; i--) r += Math.random();
  const randomness = r / randSum;
  return array[Math.floor(randomness * array.length)];
}
