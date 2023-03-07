import React, { ReactNode, HTMLAttributes, useCallback } from 'react';
import { tableBodyCellClassName } from 'constants/classes.const';

export interface TableCellPropsInterface extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export const TableCell = (props: TableCellPropsInterface) => {
  const { children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <td role="cell" className={tableBodyCellClassName} {...getProps()}>
      {children}
    </td>
  )
}