import React, { ReactNode, HTMLAttributes, useCallback } from 'react';
import clsx from 'classnames';

import { BASE_CLASS } from 'constants/classes.const';

export interface TableWrapperPropsInterface extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const tableWrapperClassName = BASE_CLASS + '__wrapper';

export const TableWrapper = (props: TableWrapperPropsInterface) => {
  const { className, children, ...rest } = props;

  const getProps = useCallback(() => rest, [rest])

  return (
    <div
      tabIndex={0}
      className={clsx(tableWrapperClassName)}
      role="group"
      {...getProps()}
    >
      {children}
    </div>
  )
}