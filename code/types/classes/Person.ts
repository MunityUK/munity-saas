import { capitalCase } from 'capital-case';
import faker from 'faker';

import { randomElement, randomEnumValue } from '../../utils/functions';

enum EthnicGroup {
  WHITE_BRITISH = 'British',
  WHITE_IRISH = 'Irish',
  WHITE_GYPSY = 'Gypsy or Irish Traveller',
  WHITE_OTHER = 'White Other',
  MIXED_CARIBBEAN = 'White & Black Caribbean',
  MIXED_AFRICAN = 'White & Black African',
  MIXED_ASIAN = 'White & Asian',
  MIXED_OTHER = 'Mixed Other',
  ASIAN_INDIAN = 'Indian',
  ASIAN_PAKISTANI = 'Pakistani',
  ASIAN_BANGLADESHI = 'Bangladeshi',
  ASIAN_CHINESE = 'Chinese',
  ASIAN_OTHER = 'Asian Other',
  BLACK_AFRICAN = 'African',
  BLACK_CARIBBEAN = 'Caribbean',
  BLACK_OTHER = 'Black Other',
  ARAB = 'Arab',
  OTHER = 'Other'
}

enum Sex {
  MALE = '1',
  FEMALE = '2',
  INDETERMINATE = '9',
  UNKNOWN = '0'
}

export class Person {
  age?: number;
  ethnicGroup?: EthnicGroup;
  sex?: Sex;
}

export class Officer extends Person {
  officerId?: string;

  /**
   * Generates a random officer.
   * @returns The generated officer.
   */
  static random() {
    const officer = new Officer();
    officer.officerId =
      'OI' + faker.datatype.number().toString().padStart(5, '0');
    officer.age = faker.datatype.number({ min: 25, max: 55 });
    officer.ethnicGroup = randomEnumValue(EthnicGroup, 2);
    officer.sex = randomElement(SexDistribution);
    return officer;
  }

  /**
   * Generates a random set of officers.
   * @param quantity The number of officers to generate.
   * @returns The random set of officers.
   */
  static randomSet(quantity: number) {
    const officers = [];
    for (let i = 0; i < quantity; i++) {
      const officer = Officer.random();
      officers.push(officer);
    }
    return officers;
  }
}

export class Complainant extends Person {
  /**
   * Generates a random complainant.
   * @returns The generated complainant.
   */
  static random() {
    const complainant = new Complainant();
    complainant.age = faker.datatype.number({ min: 25, max: 55 });
    complainant.ethnicGroup = randomEnumValue(EthnicGroup, 2);
    complainant.sex = randomElement(SexDistribution);
    return complainant;
  }

  /**
   * Generates a random set of complainants.
   * @param quantity The number of complainants to generate.
   * @returns The random set of complainants.
   */
  static randomSet(quantity: number) {
    const complainants = [];
    for (let i = 0; i < quantity; i++) {
      const complainant = Complainant.random();
      complainants.push(complainant);
    }
    return complainants;
  }
}

export const SexLookup = {
  '1': 'Male',
  '2': 'Female',
  '9': 'Indeterminate',
  '0': 'Unknown'
};

export const EthnicGroupOptions = {
  White: [
    EthnicGroup.WHITE_BRITISH,
    EthnicGroup.WHITE_GYPSY,
    EthnicGroup.WHITE_IRISH,
    EthnicGroup.WHITE_OTHER
  ],
  Mixed: [
    EthnicGroup.MIXED_AFRICAN,
    EthnicGroup.MIXED_CARIBBEAN,
    EthnicGroup.MIXED_ASIAN,
    EthnicGroup.MIXED_OTHER
  ],
  Asian: [
    EthnicGroup.ASIAN_INDIAN,
    EthnicGroup.ASIAN_PAKISTANI,
    EthnicGroup.ASIAN_BANGLADESHI,
    EthnicGroup.ASIAN_CHINESE,
    EthnicGroup.ASIAN_OTHER
  ],
  Black: [
    EthnicGroup.BLACK_AFRICAN,
    EthnicGroup.BLACK_CARIBBEAN,
    EthnicGroup.BLACK_OTHER
  ],
  Other: [EthnicGroup.ARAB, EthnicGroup.OTHER]
};

export const SexOptions = Object.entries(Sex).map(([key, value]) => {
  return {
    label: capitalCase(key),
    value: value
  };
});

const SexDistribution = [
  { sex: Sex.UNKNOWN, probability: 2 },
  { sex: Sex.MALE, probability: 49 },
  { sex: Sex.FEMALE, probability: 48 },
  { sex: Sex.INDETERMINATE, probability: 1 }
].flatMap(({ sex, probability }) => {
  return Array(probability).fill(parseInt(sex));
});
