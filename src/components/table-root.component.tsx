import React, { ReactNode, HTMLAttributes, useCallback } from 'react';
import clsx from 'classnames';
import { BASE_CLASS } from 'constants/classes.const';


export interface TableRootPropsInterface extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export const tableRootClassName = BASE_CLASS + '__wrapper__root';

export const TableRoot = (props: TableRootPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <table role="table" className={clsx(tableRootClassName)} {...getProps()}>
      {children}
    </table>
  )
}