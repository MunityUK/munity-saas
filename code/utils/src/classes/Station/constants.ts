import { ExtendedTimePenalty, ExtendedTimeType, PenaltyStatus } from './types';

export const PenaltyFactors: Record<PenaltyStatus, number> = {
  Unaddressed: 0.2,
  Unresolved: 0.5
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
