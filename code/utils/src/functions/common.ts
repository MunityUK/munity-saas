import { compareAsc, format } from 'date-fns';

import { DateRangeValues, ListItem } from '../types';

/**
 * Determines if a specified date is within a range of values.
 * @param dateValue The specified date.
 * @param values The range of values.
 * @param options Options for the date ranges.
 * @returns True if the date is within range.
 */
export function isDateInRange(
  dateValue: Date | number,
  values: DateRangeValues,
  options?: DateRangeVerificationOptions
) {
  const { startDate, endDate } = values;
  const date = new Date(dateValue);

  const isWithinStartBound = isWithinBound(date, startDate, 'start', options);
  const isWithinEndBound = isWithinBound(date, endDate, 'end', options);
  return isWithinStartBound && isWithinEndBound;
}

/**
 * Write a list of strings out as a comma-separated string.
 * @param items The array of string items.
 * @returns The comma-separated English string.
 */
export function writeAsList(items: string[]): string {
  if (items.length < 2) return items[0];

  return items.reduce((acc, item, key, { length }) => {
    if (key === 0) {
      acc += `${item}`;
    } else if (key < length - 1) {
      acc += `, ${item}`;
    } else {
      acc += ` and ${item}`;
    }
    return acc;
  }, '');
}

/**
 * Validates if a specified value is a member of an enum.
 * @param enumeration The enum to check against.
 * @param value The value to validate.
 * @returns True if value is part of enum.
 */
export function isEnumMember<T>(enumeration: T, value: unknown): boolean {
  return Object.values(enumeration).includes(value);
}

/**
 * Produces a random value from an enum.
 * @param enumeration The enum.
 * @param randSum The number of times random is summed.
 * @returns The random enum value.
 */
export function randomEnumValue<T>(enumeration: T, randSum = 1): T[keyof T] {
  return randomElement(Object.values(enumeration), randSum);
}

/**
 * Produces a random element from an array. Uses Gaussian randomness.
 * @param array The array.
 * @param randSum The number of times random is summed.
 * @returns The random element.
 */
export function randomElement<T>(array: readonly T[], randSum = 1): T {
  let r = 0;
  for (let i = randSum; i > 0; i--) r += Math.random();
  const randomness = r / randSum;
  return array[Math.floor(randomness * array.length)];
}

/**
 * Parses server-side JSON for the client.
 * @param json The JSON coming from the server.
 * @returns The hydrated JSON.
 */
export function hydrate<T>(json: T): T {
  return JSON.parse(JSON.stringify(json));
}

/**
 * Transforms a date to a user-friendly format.
 * @param date The date to transform.
 * @param dateFormat The date-fns format.
 * @returns The formatted state.
 */
export function formatDate(
  date: Date | number,
  dateFormat = 'HH:mm, E do MMMM yyyy'
): string {
  if (!date) return 'N/A';
  return format(new Date(date!), dateFormat);
}

/**
 * Extracts the label and value from a list item.
 * @param item The list item.
 * @returns The label and value of the item.
 */
export function extractLabelValue(item: ListItem) {
  let label, value;

  if (typeof item === 'string') {
    label = value = item;
  } else {
    ({ label, value } = item);
  }

  return { label, value };
}

/**
 * Helper function for {@link isDateInRange}.
 * @param date The date to check.
 * @param boundDate The upper or lower bound date.
 * @param boundType Literal for start or end.
 * @param options The {@link DateRangeVerificationOptions}.
 * @returns True if date is within bounds.
 */
function isWithinBound(
  date: Date,
  boundDate: Date | null | undefined,
  boundType: 'start' | 'end',
  options?: DateRangeVerificationOptions
) {
  const comparisonResult = compareAsc(date, boundDate!);
  const isStartBound = boundType === 'start';

  if (!options?.strict) {
    if (!boundDate) {
      return true;
    }
  }

  if (options?.inclusive) {
    return isStartBound ? comparisonResult > -1 : comparisonResult < 1;
  } else {
    return isStartBound ? comparisonResult === 1 : comparisonResult === -1;
  }
}

export interface DateRangeVerificationOptions {
  /** If true, dates at the upper or lower bound pass checks. */
  inclusive?: boolean;
  /** If true, undefined or null dates will not pass checks. */
  strict?: boolean;
}
