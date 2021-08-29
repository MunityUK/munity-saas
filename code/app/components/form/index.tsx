import classnames from 'classnames';
import React from 'react';

export * from './lib/checkbox';
export * from './lib/collapsible';
export * from './lib/datepicker';
export * from './lib/select';

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const classes = classnames('label', props.className);
  return <label {...props} className={classes} />;
}
