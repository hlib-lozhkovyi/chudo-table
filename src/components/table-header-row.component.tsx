import React, { ReactNode, HTMLAttributes, useCallback } from 'react';
import clsx from 'classnames';

import { tableHeaderRowClassName } from 'constants/classes.const';

export interface TableHeaderRowPropsInterface extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

export const TableHeaderRow = (props: TableHeaderRowPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <tr role="row" className={clsx(tableHeaderRowClassName)} {...getProps()}>
      {children}
    </tr>
  )
}