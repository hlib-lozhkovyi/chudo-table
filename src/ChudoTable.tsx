import './styles.css'

import React, { ElementType, Provider, ReactNode } from 'react';
import { TableWrapperPropsInterface, TableWrapper } from 'elements';

import { UseChudoTableHook, useChudoTable } from 'hooks';
import { ChudoTableProvider } from 'context';
import { ChudoTableContextType } from 'types';

export interface ChudoTableProps<Record> extends UseChudoTableHook<Record> {
  children: ReactNode;
  Wrapper?: ElementType<TableWrapperPropsInterface>;
  wrapperProps?: Partial<TableWrapperPropsInterface>;
}

export function ChudoTable<Record = any>(props: ChudoTableProps<Record>) {
  const {
    children,
    Wrapper = TableWrapper,
    wrapperProps,
    ...hookProps
  } = props;

  const chudoTable = useChudoTable<Record>(hookProps);

  const TableProvider = (
    ChudoTableProvider as unknown
  ) as Provider<ChudoTableContextType<Record>>;

  return (
    <TableProvider value={chudoTable}>
      <Wrapper {...wrapperProps}>
        {children}
      </Wrapper>
    </TableProvider>
  )
};