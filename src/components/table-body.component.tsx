import React, { ReactNode, HTMLAttributes, useCallback } from 'react';
import clsx from 'classnames';
import { BASE_CLASS } from 'constants/classes.const';

export interface TableBodyPropsInterface extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const tableBodyClassName = BASE_CLASS + '__body';

export const TableBody = (props: TableBodyPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <tbody role="rowgroup" className={clsx(tableBodyClassName)} {...getProps()}>
      {children}
    </tbody>
  )
}