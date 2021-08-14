import React, {
  Fragment,
  SetStateAction,
  useEffect,
  useReducer,
  useState
} from 'react';

import {
  CheckboxGroup,
  CheckboxGroupProps,
  Collapsible,
  CollapsibleIcon,
  DatePicker,
  Label
} from 'src/components/form';
import { FilterInitialState, FilterReducer } from 'src/reducers/filters';
import {
  Complaint,
  ComplaintDateProperty,
  ComplaintFilterFields,
  ComplaintFilters,
  ListItemGroups,
  MapFiltersDateValues
} from 'types';

export default function MapFiltersBar({
  allComplaints,
  setComplaints
}: MapFiltersProps) {
  const [filters, dispatch] = useReducer(FilterReducer, FilterInitialState);

  useEffect(() => {
    filterComplaints();
  }, [filters]);

  /** Filter the list of complaints by specified property. */
  const filterComplaints = () => {
    const filteredComplaints = ComplaintFilters.filter(allComplaints, filters);
    setComplaints(filteredComplaints);
  };

  /**
   * Set a new filter on check.
   * @param e The change event.
   */
  const onFilterCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    const key = name as Exclude<keyof ComplaintFilters, ComplaintDateProperty>;
    const values = filters[key] || new Set();

    if (checked) {
      values.add(value);
    } else {
      values.delete(value);
    }

    dispatch({ name: key, payload: values });
  };

  /**
   * Handle selection of dates from datepicker.
   * @param selectedDate The selected date.
   * @param name The name of the input.
   */
  const onDateChange = (selectedDate: Date, name: string) => {
    const [, property, position] = name.match(/(\w+)-(\w+)/)!;
    const key = property as ComplaintDateProperty;
    const dates = filters[key]!;

    dispatch({
      name: key,
      payload: {
        ...dates,
        [position]: selectedDate
      }
    });
  };

  return (
    <div className={'map-filters'}>
      {ComplaintFilterFields.map(({ label, name, items, itemGroups }, key) => {
        const filterValues = filters[name];
        if (ComplaintFilters.isDateProperty(name)) {
          return (
            <FilterDateField
              label={label}
              name={name}
              dates={filterValues as MapFiltersDateValues}
              onChange={onDateChange}
              key={key}
            />
          );
        } else {
          return (
            <FilterCheckboxField
              label={label}
              name={name}
              items={items!}
              itemGroups={itemGroups}
              checkedValues={Array.from(filterValues as Set<string>)}
              onChange={onFilterCheck}
              key={key}
            />
          );
        }
      })}
    </div>
  );
}

/** A field for the dropdown menu to filter map markers by property. */
const FilterCheckboxField = (props: FilterCheckboxFieldProps) => {
  const { label, name, items, itemGroups, onChange, checkedValues } = props;
  const [isCollapsed, setCollapsed] = useState(true);

  const Options = () => {
    if (items) {
      return (
        <CheckboxGroup
          name={name}
          items={items!}
          onChange={onChange}
          checkedValues={checkedValues}
        />
      );
    } else if (itemGroups) {
      return (
        <Fragment>
          {Object.entries(itemGroups).map(([supergroup, ethnicGroups], key) => {
            return (
              <div className={'map-filters__checkbox-group'} key={key}>
                <Label className={'map-filters__checkbox-group-label'}>
                  {supergroup}
                </Label>
                <CheckboxGroup
                  name={name}
                  items={ethnicGroups}
                  onChange={onChange}
                  checkedValues={checkedValues}
                />
              </div>
            );
          })}
        </Fragment>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={'map-filters-field'}>
      <Label
        className={'map-filters-field__label'}
        onClick={() => setCollapsed(!isCollapsed)}>
        <span>{label}</span>
        <CollapsibleIcon isCollapsed={isCollapsed} />
      </Label>
      <Collapsible isCollapsed={isCollapsed}>
        <Options />
      </Collapsible>
    </div>
  );
};

/** A field for the date ranges to filter map markers by date properties. */
const FilterDateField = (props: FilterDateFieldProps) => {
  const { label, name, dates, onChange } = props;
  const { startDate, endDate } = dates;
  const [isCollapsed, setCollapsed] = useState(true);

  const startInputName = `${name}-startDate`;
  const endInputName = `${name}-endDate`;

  return (
    <div className={'map-filters-field'}>
      <Label
        className={'map-filters-field__label'}
        onClick={() => setCollapsed(!isCollapsed)}>
        <span>{label}</span>
        <CollapsibleIcon isCollapsed={isCollapsed} />
      </Label>
      <Collapsible isCollapsed={isCollapsed}>
        <DatePicker
          name={startInputName}
          value={startDate}
          placeholderText={'Select start date...'}
          onChange={(date) => onChange(date, startInputName)}
          maxDate={endDate || new Date()}
          className={'map-filters__datepicker'}
        />
        <DatePicker
          name={endInputName}
          value={endDate}
          placeholderText={'Select end date...'}
          onChange={(date) => onChange(date, endInputName)}
          minDate={startDate}
          maxDate={new Date()}
          className={'map-filters__datepicker'}
        />
      </Collapsible>
    </div>
  );
};

interface MapFiltersProps {
  allComplaints: Array<Complaint>;
  setComplaints: React.Dispatch<SetStateAction<Array<Complaint>>>;
}

interface FilterCheckboxFieldProps extends CheckboxGroupProps {
  label: string;
  name: keyof ComplaintFilters;
  itemGroups?: ListItemGroups;
}

interface FilterDateFieldProps {
  label: string;
  name: keyof ComplaintFilters;
  dates: MapFiltersDateValues;
  onChange: (date: Date, name: string) => void;
}
