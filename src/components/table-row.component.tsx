import React, { ReactNode, HTMLAttributes, useCallback } from 'react';
import clsx from 'classnames';

import { tableBodyRowClassName } from 'constants/classes.const';

export interface TableRowPropsInterface extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

export const TableRow = (props: TableRowPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <tr role="row" className={clsx(tableBodyRowClassName)} {...getProps()}>
      {children}
    </tr>
  )
}