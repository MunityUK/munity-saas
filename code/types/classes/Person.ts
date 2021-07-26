import faker from 'faker';

import { randomElement, randomEnumValue } from '../../utils/functions';
import { Race, Sex, SexDistribution } from '../enums';

export class Person {
  age?: number;
  race?: string;
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
    officer.race = randomEnumValue(Race, 2);
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
    complainant.race = randomEnumValue(Race, 2);
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
