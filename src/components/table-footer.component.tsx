import React, { ReactNode, HTMLAttributes, useCallback } from 'react';
import clsx from 'classnames';
import { BASE_CLASS } from 'constants/classes.const';

export interface TableFooterPropsInterface extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableFooterClassName = BASE_CLASS + '__footer';

export const TableFooter = (props: TableFooterPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <tfoot role="rowgroup" className={clsx(TableFooterClassName)} {...getProps()}>
      {children}
    </tfoot>
  )
}