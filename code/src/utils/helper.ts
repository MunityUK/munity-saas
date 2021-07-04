import { format } from 'date-fns';

import { ListItem } from 'types';

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
