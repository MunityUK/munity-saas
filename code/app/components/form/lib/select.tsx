import { MunityCommon, ListItem } from '@munity/utils';
import classnames from 'classnames';
import React from 'react';

export function Select(props: SelectProps) {
  const { items, name, placeholder, value, onChange, className } = props;
  const classes = classnames('select', className);
  return (
    <select className={classes} name={name} value={value} onChange={onChange}>
      <option value={''}>{placeholder}</option>
      {items.map((item, key) => {
        const { label, value } = MunityCommon.extractLabelValue(item);
        return (
          <option value={value} key={key}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name?: string;
  items: ListItem[];
}
