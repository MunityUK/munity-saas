import classnames from 'classnames';
import React from 'react';

export function Collapsible(props: CollapsibleProps) {
  const { className, children, isCollapsed } = props;
  const classes = classnames('collapsible', className, {
    'collapsible--visible': !isCollapsed
  });
  return <div className={classes}>{children}</div>;
}

export const CollapsibleIcon = ({ isCollapsed }: CollapsibleIconProps) => {
  const classes = classnames('collapsible-icon', {
    'collapsible-icon--open': !isCollapsed
  });
  return <span className={classes}>&#8964;</span>;
};

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
}


interface CollapsibleIconProps {
  isCollapsed: boolean;
}
