import React from 'react';

export function Select(props: SelectProps) {
  const { items, name, placeholder, value, onChange } = props;
  return (
    <select
      className={'select'}
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

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name?: string;
  items: Array<
    | string
    | {
        label: string;
        value: string | number;
      }
  >;
}
