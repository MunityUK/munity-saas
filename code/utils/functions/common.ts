import { format } from 'date-fns';

import { ListItem } from 'types';

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

export function parse(value: unknown) {
  return JSON.parse(JSON.stringify(value));
}

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
