import React, { Fragment } from 'react';

import { extractLabelValue } from '@utils/functions/common';
import { ListItems } from '@utils/types';

export function CheckboxGroup(props: CheckboxGroupProps) {
  const { name, items, onChange, checkedValues } = props;
  return (
    <Fragment>
      {items.map((item, key) => {
        const { label, value } = extractLabelValue(item);
        const checked = checkedValues?.includes(value.toString()) ?? false;

        return (
          <ICheckbox
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            checked={checked}
            key={key}
          />
        );
      })}
    </Fragment>
  );
}

function Checkbox(props: CheckboxProps) {
  const { name, label, value, onChange, checked } = props;

  return (
    <label className={'checkbox'}>
      <input
        type={'checkbox'}
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
      />
      <span>{label}</span>
    </label>
  );
}

const ICheckbox = React.memo(Checkbox);

export interface CheckboxGroupProps
  extends React.InputHTMLAttributes<HTMLDivElement> {
  name: string;
  items: ListItems;
  checkedValues?: Array<string>;
}

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
