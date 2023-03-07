import React, { ReactNode } from 'react';
import { ChudoTableColumnInterface, Item } from 'chudo-table';

export interface ColumnPropsInterface<T extends Item, K extends Extract<keyof T, string> = Extract<keyof T, string>> {
  accessor: K;
  Header?: ReactNode;
  children?: (value: T) => ReactNode;
}

export const Column = <T extends Item = Item>(props: ColumnPropsInterface<T>) => null