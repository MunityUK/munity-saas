import React, { SetStateAction, useEffect, useState } from 'react';

import {
  CheckboxGroup,
  CheckboxGroupProps,
  Collapsible,
  CollapsibleIcon,
  DatePicker,
  Label
} from 'src/components/form';
import {
  Complaint,
  ComplaintFilters,
  FilterFields,
  MapFilters,
  MapFiltersDateValues
} from 'types';

export default function MapFiltersBar({
  allComplaints,
  setComplaints
}: MapFiltersProps) {
  const [filters, setFilters] = useState<MapFilters>(new ComplaintFilters());

  useEffect(() => {
    filterComplaints();
  }, [JSON.stringify(filters)]);

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

  /**
   * Handle selection on dates from datepicker.
   * @param selectedDate The selected date.
   * @param name The name of the input.
   */
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
      {FilterFields.map(({ label, name, items }, key) => {
        const filterValues = filters[name];
        if (Complaint.isDateProperty(name, filterValues)) {
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
        <CollapsibleIcon isCollapsed={isCollapsed} />
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
  name: keyof Complaint;
}

interface FilterDateFieldProps {
  label: string;
  name: keyof Complaint;
  dates: MapFiltersDateValues;
  onChange: (date: Date, name: string) => void;
}
