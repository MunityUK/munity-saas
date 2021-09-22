import { ComplaintFilters, DateRangeValues } from '@munity/utils';

export const FilterInitialState = new ComplaintFilters();

export const FilterReducer: Reducer<State, Action> = (state, action) => {
  return Object.assign({}, state, {
    [action.name]: action.payload
  });
};

type State = ComplaintFilters;
type Action = {
  name: keyof ComplaintFilters;
  payload: DateRangeValues | Set<string>;
};
type Reducer<State, Action> = (state: State, action: Action) => State;
