import { format } from 'date-fns';

import { ListItem } from '../../types';

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
export function isEnumValue<T>(enumeration: T, value: unknown): boolean {
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
export function randomElement<T>(array: T[], randSum = 1): T {
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
 * @returns The formatted state.
 */
export function formatDate(date: Date): string {
  if (!date) return 'N/A';
  return format(new Date(date!), 'HH:mm, E do MMMM yyyy');
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
