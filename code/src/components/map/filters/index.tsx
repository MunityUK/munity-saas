import classnames from 'classnames';
import React, { SetStateAction, useEffect, useState } from 'react';

import {
  CheckboxGroup,
  CheckboxGroupProps,
  Label,
  DatePicker,
  Collapsible
} from 'src/components/form';
import { Complaint } from 'types';

import FILTER_FIELDS, { FilterType } from './fields';

export default function MapFilters({
  allComplaints,
  setComplaints
}: MapFiltersProps) {
  const [filters, setFilters] = useState<MapFilters>({});

  useEffect(() => {
    filterComplaints();
  }, [JSON.stringify(filters)]);

  /** Filter the list of complaints by specified property. */
  const filterComplaints = () => {
    const filteredComplaints = allComplaints.filter((complaint) => {
      return Object.entries(filters).every(([property, values]) => {
        if (!values || !values.length) return true;
        const key = property as keyof Complaint;
        return values.includes(complaint[key]!.toString());
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
      const values = filters[name as keyof Complaint] || [];
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
      return { ...filters, [name]: values };
    });
  };

  const onDateChange = () => {
    // hello
  };

  return (
    <div className={'map-filters'}>
      {FILTER_FIELDS.map(({ label, name, items, type }, key) => {
        const isCheckboxFilter = type === FilterType.CHECKBOXES;
        return isCheckboxFilter ? (
          <FilterCheckboxField
            label={label}
            name={name}
            items={items!}
            checkedValues={filters[name]!}
            onChange={onFilterCheck}
            key={key}
          />
        ) : (
          <FilterDateField
            label={label}
            name={name}
            onChange={onDateChange}
            key={key}
          />
        );
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
  const { label } = props;
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
        <DatePicker placeholderText={'Select start date...'} />
        <DatePicker placeholderText={'Select end date...'} />
      </Collapsible>
    </div>
  );
};

const DropButton = ({ isCollapsed }: DropButtonProps) => {
  const classes = classnames('map-filters-field__label-drop', {
    'map-filters-field__label-drop--open': !isCollapsed
  });
  return <span className={classes}>&#8964;</span>;
};

interface MapFiltersProps {
  allComplaints: Array<Complaint>;
  setComplaints: React.Dispatch<SetStateAction<Array<Complaint>>>;
}

interface FilterCheckboxFieldProps extends CheckboxGroupProps {
  label: string;
  name: keyof Complaint;
}

interface FilterDateFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: keyof Complaint;
}

interface DropButtonProps {
  isCollapsed: boolean;
}

type MapFilters = {
  [key in keyof Complaint]: Array<string>;
};
