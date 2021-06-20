import classnames from 'classnames';
import React from 'react';

export function Select(props: SelectProps) {
  const { items, name, placeholder, value, onChange, className } = props;
  const classes = classnames('select', className);
  return (
    <select
      className={classes}
      name={name}
      value={value}
      onChange={onChange}>
      <option value={''}>{placeholder}</option>
      {items.map((item, key) => {
        let label, value;

        if (typeof item === 'string') {
          label = value = item;
        } else {
          ({ label, value } = item);
        }

        return (
          <option value={value} key={key}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** The name of the field. */
  name?: string;

  /** The list of options to select from. */
  items: Array<
    | string
    | {
        label: string;
        value: string | number;
      }
  >;
}
