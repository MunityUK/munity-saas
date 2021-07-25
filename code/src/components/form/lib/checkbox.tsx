import classnames from 'classnames';
import React from 'react';

import { extractLabelValue } from 'src/utils/functions';
import { ListItem } from 'types';

export function CheckboxGroup(props: CheckboxGroupProps) {
  const { name, items, onChange, checkedValues, className } = props;
  const classes = classnames('checkbox-group', className);
  return (
    <div className={classes}>
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
    </div>
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
  /** The name of the field. */
  name: string;

  /** The list of options as checkboxes. */
  items: Array<ListItem>;

  /** The list of values which are checked. */
  checkedValues?: Array<string>;
}

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The label for the checkbox. */
  label: string;
}
