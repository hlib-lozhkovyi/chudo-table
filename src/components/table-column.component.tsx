import React, { ReactNode, HTMLAttributes, useCallback } from 'react';
import clsx from 'classnames';

import { tableHeaderColumnClassName } from 'constants/classes.const';

export interface TableColumnPropsInterface extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export const TableColumn = (props: TableColumnPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <th role="columnheader" className={clsx(tableHeaderColumnClassName)} {...getProps()}>
      {children}
    </th>
  )
}