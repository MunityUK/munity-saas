import { capitalCase } from 'capital-case';

import { Race, Sex } from 'types';

export const MAP_ATTRIBUTION =
  '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
export const MAP_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

export const RACE_OPTIONS = Object.values(Race);
export const SEX_OPTIONS = Object.entries(Sex).map(([key, value]) => {
  return {
    label: capitalCase(key),
    value: value
  };
});