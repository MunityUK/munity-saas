import Record from 'airtable/lib/record';
import * as faker from 'faker';

export default class Complaint {
  reportId?: string;
  station?: string;
  startDate?: string;
  endDate?: string;
  incidentType?: IncidentType;
  incidentDescription?: string;
  outcome?: Outcome;
  outcomeDescription?: string;
  city?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  victimAge?: number;
  victimGender?: string;
  victimRace?: string;
  victimReligion?: string;
  officerId?: string | number;
  officerAge?: number;
  officerGender?: string;
  officerRace?: string;
  officerReligion?: string;

  static parseComplaint(data: Record) {
    const complaint: Complaint = {};

    Object.entries(DatabaseField).forEach(([key, value]) => {
      const field = value as string;
      complaint[key as keyof Complaint] = data.fields[field];
    });

    return complaint;
  }

  static random() {
    const complaint = new Complaint();
    complaint.reportId = faker.datatype
      .number(10000)
      .toString()
      .padStart(5, '0');
    complaint.station =
      PoliceStations[Math.floor(Math.random() * PoliceStations.length)];
    complaint.startDate = faker.date.past().toISOString();

    if (faker.datatype.boolean()) {
      complaint.endDate = faker.date
        .past(undefined, complaint.startDate)
        .toISOString();
    }

    complaint.incidentType = randomEnum(IncidentType);
    complaint.incidentDescription = faker.lorem.sentence();
    complaint.outcome = randomEnum(Outcome);
    complaint.outcomeDescription = faker.lorem.sentence();
    complaint.city = 'Bristol';
    complaint.county = 'Avon';
    complaint.latitude = parseFloat(faker.address.latitude(51.475, 51.445, 5));
    complaint.longitude = parseFloat(faker.address.longitude(-2.57, -2.62, 5));
    complaint.victimAge = faker.datatype.number({ min: 18, max: 65 });
    complaint.victimGender = randomEnum(Gender);
    complaint.victimRace = randomEnum(Race);
    complaint.victimReligion = randomElement(Religions);
    complaint.officerId = faker.datatype.number().toString();
    complaint.officerAge = faker.datatype.number({ min: 25, max: 55 });
    complaint.officerGender = randomEnum(Gender);
    complaint.officerRace = randomEnum(Race);
    complaint.officerReligion = randomElement(Religions);

    return complaint;
  }
}

export const DatabaseField: { [key: string]: string } = {
  reportId: 'Report ID',
  station: 'Station',
  startDate: 'Report Start Date',
  endDate: 'Report End Date',
  incidentType: 'Incident Type',
  incidentDescription: 'Incident Description',
  outcome: 'Outcome',
  outcomeDescription: 'Outcome Description',
  city: 'City',
  county: 'County',
  latitude: 'Latitude',
  longitude: 'Longitude',
  victimAge: 'Victim Age',
  victimGender: 'Victim Gender',
  victimRace: 'Victim Race',
  victimReligion: 'Victim Religion',
  officerId: 'Officer ID',
  officerAge: 'Officer Age',
  officerGender: 'Officer Gender',
  officerRace: 'Officer Race',
  officerReligion: 'Officer Religion'
};

export enum IncidentType {
  ASSAULT = 'Assault',
  FELONY = 'Felony',
  MISCONDUCT = 'Misconduct'
}

export enum Outcome {
  RESOLVED = 'Resolved',
  UNRESOLVED = 'Unresolved'
}

const PoliceStations = [
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

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  NEITHER = 'Neither'
}

export enum Race {
  BLACK = 'Black',
  HISPANIC = 'Hispanic',
  ASIAN = 'Asian',
  WHITE = 'White'
}

const Religions = [
  { name: 'Christian', probability: 47 },
  { name: 'Muslim', probability: 5 },
  { name: 'Buddhist', probability: 1 },
  { name: 'Hindu', probability: 1 },
  { name: 'Sikh', probability: 1 },
  { name: 'Jewish', probability: 1 },
  { name: 'None', probability: 45 }
].flatMap(({ name, probability }) => {
  return Array(probability).fill(name);
});

function randomEnum<T>(anEnum: T): T[keyof T] {
  return randomElement(Object.values(anEnum));
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
