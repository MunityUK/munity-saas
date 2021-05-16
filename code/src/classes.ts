import * as faker from 'faker';

export default class Complaint {
  reportId?: string;
  station?: string;
  startDate?: Date;
  endDate?: Date;
  incidentType?: IncidentType;
  incidentDescription?: string;
  outcome?: Outcome;
  outcomeDescription?: string;
  city?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  victimAge?: number;
  victimRace?: string;
  victimSex?: Sex;
  officerId?: string | number;
  officerAge?: number;
  officerRace?: string;
  officerSex?: Sex;

  static random() {
    const complaint = new Complaint();
    complaint.reportId = faker.datatype
      .number(10000)
      .toString()
      .padStart(5, '0');
    complaint.station =
      PoliceStations[Math.floor(Math.random() * PoliceStations.length)];
    complaint.startDate = faker.date.past();

    if (faker.datatype.boolean()) {
      complaint.endDate = faker.date.past(undefined, complaint.startDate);
    }

    complaint.incidentType = randomEnum(IncidentType);
    complaint.incidentDescription = faker.lorem.sentence();
    complaint.outcome = randomEnum(Outcome);
    complaint.outcomeDescription = faker.lorem.sentence();
    complaint.city = 'Bristol';
    complaint.county = 'Avon';
    complaint.latitude = parseFloat(faker.address.latitude(51.475, 51.445, 15));
    complaint.longitude = parseFloat(faker.address.longitude(-2.57, -2.62, 15));
    complaint.victimAge = faker.datatype.number({ min: 18, max: 65 });
    complaint.victimSex = randomElement(SexDistribution);
    complaint.victimRace = randomEnum(Race);
    complaint.officerId = 'OI' + faker.datatype.number().toString().padStart(5, '0');
    complaint.officerAge = faker.datatype.number({ min: 25, max: 55 });
    complaint.officerSex = randomElement(SexDistribution);
    complaint.officerRace = randomEnum(Race);

    return complaint;
  }
}

export enum IncidentType {
  ASSAULT = 'Assault',
  FELONY = 'Felony',
  MISCONDUCT = 'Misconduct'
}

export enum Outcome {
  RESOLVED = 'Resolved',
  UNRESOLVED = 'Unresolved'
}

export enum Race {
  BLACK = 'Black',
  HISPANIC = 'Hispanic',
  ASIAN = 'Asian',
  WHITE = 'White'
}

export enum Sex {
  UNKNOWN = '0',
  MALE = '1',
  FEMALE = '2',
  INDETERMINATE = '9'
}

export const PoliceStations = [
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

function randomEnum<T>(anEnum: T): T[keyof T] {
  return randomElement(Object.values(anEnum));
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
