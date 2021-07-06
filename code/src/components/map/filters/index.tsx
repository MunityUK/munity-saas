import classnames from 'classnames';
import React, { SetStateAction, useEffect, useState } from 'react';

import { Label } from 'src/components/form';
import {
  CheckboxGroup,
  CheckboxGroupProps
} from 'src/components/form/lib/checkbox';
import { Complaint } from 'types';

import FILTER_FIELDS from './fields';

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

  return (
    <div className={'map-sidebar'}>
      {FILTER_FIELDS.map((props, key) => {
        return (
          <FilterField
            {...props}
            checkedValues={filters[props.name]!}
            onChange={onFilterCheck}
            key={key}
          />
        );
      })}
    </div>
  );
}

/** A field for the dropdown menu to filter map markers by property. */
const FilterField = (props: FilterFieldProps) => {
  const { label, name, items, onChange, checkedValues } = props;
  const [isFolded, setFolded] = useState(true);

  const classes = classnames('map-sidebar-field-checkboxes', {
    'map-sidebar-field-checkboxes--visible': !isFolded
  });
  return (
    <div className={'map-sidebar-field'}>
      <Label
        className={'map-sidebar-field__label'}
        onClick={() => setFolded(!isFolded)}>
        {label}
        {isFolded && (
          <span className={'map-sidebar-field__label-drop'}>&#8964;</span>
        )}
      </Label>
      <CheckboxGroup
        name={name}
        items={items}
        onChange={onChange}
        checkedValues={checkedValues}
        className={classes}
      />
    </div>
  );
};

interface MapFiltersProps {
  allComplaints: Array<Complaint>;
  setComplaints: React.Dispatch<SetStateAction<Array<Complaint>>>;
}

interface FilterFieldProps extends CheckboxGroupProps {
  label: string;
  name: keyof Complaint;
}

type MapFilters = {
  [key in keyof Complaint]: Array<string>;
};
