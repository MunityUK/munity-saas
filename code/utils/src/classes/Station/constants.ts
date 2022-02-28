import { ExtendedTimePenalty, ExtendedTimeType, PenaltyStatus } from './types';

import { IncidentType } from '..';

export const PenaltyFactors: Record<PenaltyStatus, number> = {
  Unaddressed: 0.2,
  Unresolved: 0.5
};

export const IncidentTypeFactors: Record<IncidentType, number> = {
  [IncidentType.ID_REFUSAL]: 0.1,
  [IncidentType.VERBAL_ABUSE]: 0.3,
  [IncidentType.HARASSMENT]: 0.4,
  [IncidentType.EXCESSIVE_FORCE]: 0.4,
  [IncidentType.BRUTALITY]: 0.7
};

export const ExtendedTimePenaltyFactors: Record<
  ExtendedTimeType,
  ExtendedTimePenalty
> = {
  Investigation: {
    maxPenalty: 30,
    penaltyFactor: 0.8
  },
  Resolution: {
    maxPenalty: 60,
    penaltyFactor: 0.4
  }
};
