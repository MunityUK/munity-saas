import classnames from 'classnames';
import React from 'react';

import { extractLabelValue } from 'src/utils/helper';
import { ListItem } from 'types';

export function CheckboxGroup(props: CheckboxGroupProps) {
  const { name, items, onChange, className } = props;
  const classes = classnames('checkbox-group', className);
  return (
    <div className={classes}>
      {items.map((item, key) => {
        const { label, value } = extractLabelValue(item);

        return (
          <label className={'checkbox'} key={key}>
            <input
              type={'checkbox'}
              name={name}
              value={value}
              onChange={onChange}
            />
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
}

export interface CheckboxGroupProps
  extends React.InputHTMLAttributes<HTMLDivElement> {
  /** The name of the field. */
  name: string;

  /** The list of options as checkboxes. */
  items: Array<ListItem>;
}
