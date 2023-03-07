import React, { ReactNode, HTMLAttributes, useCallback } from 'react';
import clsx from 'classnames';
import { BASE_CLASS } from 'constants/classes.const';

export interface TableHeaderPropsInterface extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const tableHeaderClassName = BASE_CLASS + '__wrapper__root__header';

export const TableHeader = (props: TableHeaderPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <thead role="rowgroup" className={clsx(tableHeaderClassName)} {...getProps()}>
      {children}
    </thead>
  )
}