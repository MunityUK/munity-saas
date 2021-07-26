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

export const SexDistribution = [
  { sex: Sex.UNKNOWN, probability: 2 },
  { sex: Sex.MALE, probability: 49 },
  { sex: Sex.FEMALE, probability: 48 },
  { sex: Sex.INDETERMINATE, probability: 1 }
].flatMap(({ sex, probability }) => {
  return Array(probability).fill(parseInt(sex));
});