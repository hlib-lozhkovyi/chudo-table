import React, { ReactNode, useEffect } from 'react';
import { useColumns } from 'hooks/use-columns.hook'
import { createColumnsFromChildren } from 'utils/create-columns-from-childrens.utils';
import { Item } from 'chudo-table';

export interface ColumnsPropsInterface<T> {
  children: ReactNode
}

export const Columns = <T extends Item,>(props: ColumnsPropsInterface<T>) => {
  const {
    children,
  } = props;

  const { initialize } = useColumns();
  const columns = createColumnsFromChildren<T>(children);

  useEffect(() => {
    initialize(columns);
  }, [])

  return null;
};
