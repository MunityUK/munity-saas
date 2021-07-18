import classnames from 'classnames';
import { compareAsc } from 'date-fns';
import React, { SetStateAction, useEffect, useState } from 'react';

import {
  CheckboxGroup,
  CheckboxGroupProps,
  Collapsible,
  DatePicker,
  Label
} from 'src/components/form';
import { Complaint } from 'types';

import FILTER_FIELDS from './fields';

export default function MapFilters({
  allComplaints,
  setComplaints
}: MapFiltersProps) {
  const [filters, setFilters] = useState<MapFilters>(() => {
    const mapFilters: MapFilters = {};
    FILTER_FIELDS.forEach(({ name }) => {
      if (isDateProperty(name)) {
        mapFilters[name] = {
          startDate: undefined,
          endDate: undefined
        };
      } else {
        mapFilters[name] = [];
      }
    });
    return mapFilters;
  });

  useEffect(() => {
    filterComplaints();
  }, [JSON.stringify(filters)]);

  /** Filter the list of complaints by specified property. */
  const filterComplaints = () => {
    const filteredComplaints = allComplaints.filter((complaint) => {
      return Object.entries(filters).every(([property, values]) => {
        const key = property as keyof Complaint;
        if (isDateProperty(key, values)) {
          const { startDate, endDate } = values;

          const date = new Date(complaint[key]!);
          const isAfterStart = !startDate || compareAsc(date, startDate!) === 1;
          const isBeforeEnd = !endDate || compareAsc(date, endDate!) === -1;
          return isAfterStart && isBeforeEnd;
        } else {
          if (!values || !values.length) return true;
          return values.includes(complaint[key]!.toString());
        }
      });
    });

    setComplaints(filteredComplaints);
  };

  /**
   * Set a new filter on check.
   * @param e The change event.
   */
  const onFilterCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;

    setFilters((filters) => {
      const key = name as keyof Complaint;
      const values = (filters[key] || []) as string[];
      if (checked) {
        if (!values.includes(value)) {
          values.push(value);
        }
      } else {
        const index = values.indexOf(value);
        if (index > -1) {
          values.splice(index, 1);
        }
      }
      return { ...filters, [key]: values };
    });
  };

  const onDateChange = (selectedDate: Date, name: string) => {
    const [, property, position] = name.match(/(\w+)-(\w+)/)!;
    const key = property as keyof Complaint;

    const dates = filters[key]!;
    setFilters((filters) => {
      return {
        ...filters,
        [key]: {
          ...dates,
          [position]: selectedDate
        }
      };
    });
  };

  return (
    <div className={'map-filters'}>
      {FILTER_FIELDS.map(({ label, name, items }, key) => {
        const filterValues = filters[name];
        if (isDateProperty(name, filterValues)) {
          return (
            <FilterDateField
              label={label}
              name={name}
              dates={filterValues}
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
              checkedValues={filterValues}
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
  const { label, name, items, onChange, checkedValues } = props;
  const [isCollapsed, setCollapsed] = useState(true);

  return (
    <div className={'map-filters-field'}>
      <Label
        className={'map-filters-field__label'}
        onClick={() => setCollapsed(!isCollapsed)}>
        <span>{label}</span>
        <DropButton isCollapsed={isCollapsed} />
      </Label>
      <Collapsible isCollapsed={isCollapsed}>
        <CheckboxGroup
          name={name}
          items={items!}
          onChange={onChange}
          checkedValues={checkedValues}
        />
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
        <DropButton isCollapsed={isCollapsed} />
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

/** TODO: Rename to CollapsibleIcon and put with {@link Collapsible} */
const DropButton = ({ isCollapsed }: DropButtonProps) => {
  const classes = classnames('map-filters-field__label-drop', {
    'map-filters-field__label-drop--open': !isCollapsed
  });
  return <span className={classes}>&#8964;</span>;
};

/**
 * A type guard which verifies if the property is a Date type.
 * @param key The property to verify.
 * @param _values The values to determine types for.
 * @returns True if the property is a date type.
 */
function isDateProperty(
  key: keyof Complaint,
  _values?: MapFiltersValues
): _values is MapFiltersDateValues {
  return (
    key === 'dateOfAddressal' ||
    key === 'dateOfComplaint' ||
    key === 'dateOfResolution'
  );
}

interface MapFiltersProps {
  allComplaints: Array<Complaint>;
  setComplaints: React.Dispatch<SetStateAction<Array<Complaint>>>;
}

interface FilterCheckboxFieldProps extends CheckboxGroupProps {
  label: string;
  name: keyof Complaint;
}

interface FilterDateFieldProps {
  label: string;
  name: keyof Complaint;
  dates: MapFiltersDateValues;
  onChange: (date: Date, name: string) => void;
}

interface DropButtonProps {
  isCollapsed: boolean;
}

type MapFilters = {
  [key in keyof Complaint]: MapFiltersValues;
};

type MapFiltersValues = Array<string> | MapFiltersDateValues;

type MapFiltersDateValues = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};
