import classnames from 'classnames';
import React from 'react';

export * from './lib/checkbox';
export * from './lib/datepicker';
export * from './lib/select';

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const classes = classnames('label', props.className);
  return <label {...props} className={classes} />;
}

export function Collapsible(props: CollapsibleProps) {
  const { className, children, isCollapsed } = props;
  const classes = classnames('collapsible', className, {
    'collapsible--visible': !isCollapsed
  });
  return <div className={classes}>{children}</div>;
}

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
}
