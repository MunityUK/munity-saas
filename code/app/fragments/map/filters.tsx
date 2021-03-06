import {
  Complaint,
  ComplaintDateProperty,
  ComplaintFilterFields,
  ComplaintFilters,
  ListItem,
  ListItemGroups,
  DateRangeValues
} from '@munity/utils';
import React, {
  Fragment,
  SetStateAction,
  useEffect,
  useReducer,
  useState
} from 'react';

import {
  CheckboxGroup,
  Collapsible,
  CollapsibleIcon,
  DatePicker,
  Label
} from 'components/form';
import { FilterInitialState, FilterReducer } from 'reducers/filters';

export default function MapFiltersBar({
  allComplaints,
  setComplaints
}: MapFiltersProps) {
  const [filters, dispatch] = useReducer(FilterReducer, FilterInitialState);

  /** Filter the list of complaints by specified property. */
  useEffect(() => {
    const filteredComplaints = ComplaintFilters.filter(allComplaints, filters);
    setComplaints(filteredComplaints);
  }, [filters, allComplaints, setComplaints]);

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
    <aside className={'map-filters'}>
      {ComplaintFilterFields.map((filterField, key) => {
        const { label, name } = filterField;
        const filterValues = filters[name];
        if (filterField.type === 'date') {
          return (
            <FilterDateField
              label={label}
              name={name}
              dates={filterValues as DateRangeValues}
              onChange={onDateChange}
              key={key}
            />
          );
        } else {
          const checkedValues = Array.from(filterValues as Set<string>);
          if (filterField.type === 'list') {
            return (
              <FilterCheckboxField
                label={label}
                name={name}
                items={filterField.items}
                checkedValues={checkedValues}
                onChange={onFilterCheck}
                key={key}
              />
            );
          } else {
            return (
              <FilterCheckboxField
                label={label}
                name={name}
                itemGroups={filterField.itemGroups}
                checkedValues={checkedValues}
                onChange={onFilterCheck}
                key={key}
              />
            );
          }
        }
      })}
    </aside>
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
              <fieldset className={'map-filters__checkbox-group'} key={key}>
                <legend className={'map-filters__checkbox-group-legend'}>
                  {supergroup}
                </legend>
                <CheckboxGroup
                  name={name}
                  items={ethnicGroups}
                  onChange={onChange}
                  checkedValues={checkedValues}
                />
              </fieldset>
            );
          })}
        </Fragment>
      );
    } else {
      return null;
    }
  };

  return (
    <fieldset className={'map-filters-field'}>
      <Label
        className={'map-filters-field__label'}
        onClick={() => setCollapsed(!isCollapsed)}>
        <span>{label}</span>
        <CollapsibleIcon isCollapsed={isCollapsed} />
      </Label>
      <Collapsible isCollapsed={isCollapsed}>
        <Options />
      </Collapsible>
    </fieldset>
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
    <fieldset className={'map-filters-field'}>
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
    </fieldset>
  );
};

interface MapFiltersProps {
  allComplaints: Array<Complaint>;
  setComplaints: React.Dispatch<SetStateAction<Array<Complaint>>>;
}

interface FilterCheckboxFieldProps
  extends React.InputHTMLAttributes<HTMLDivElement> {
  label: string;
  name: keyof ComplaintFilters;
  items?: readonly ListItem[];
  itemGroups?: ListItemGroups;
  checkedValues?: string[];
}

interface FilterDateFieldProps {
  label: string;
  name: keyof ComplaintFilters;
  dates: DateRangeValues;
  onChange: (date: Date, name: string) => void;
}
