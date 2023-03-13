import './styles.scss';

import React, { ElementType, Provider, ReactNode } from 'react';
import { TableContainerPropsInterface, TableContainer } from 'elements';

import { UseChudoTableHook, useChudoTable } from 'hooks';
import { ChudoTableProvider, TableStyleProvider } from 'context';
import { ChudoTableContextType, TableStyleContextType } from 'types';

export interface ChudoTableProps<Record> extends UseChudoTableHook<Record>, TableContainerPropsInterface, TableStyleContextType {
  children: ReactNode;
  Container?: ElementType<TableContainerPropsInterface>;
}

export function ChudoTable<Record = any, RemoteData = any>(props: ChudoTableProps<Record>) {
  const {
    children,
    Container = TableContainer,
    border,
    stripe,
    rowBorder,
    compact,
    highlightRow,
    highlightColumn,
    ...rest
  } = props;

  const {
    id,
    idAccessor,

    ...containerProps
  } = rest

  const hookProps = {
    id,
    idAccessor,
  }

  const chudoTable = useChudoTable<Record, RemoteData>(hookProps);

  const TableProvider = (
    ChudoTableProvider as unknown
  ) as Provider<ChudoTableContextType<Record, RemoteData>>;


  const tableStyle: TableStyleContextType = {
    border,
    stripe,
    rowBorder,
    compact,
    highlightRow,
    highlightColumn,
  }

  return (
    <TableProvider value={chudoTable}>
      <TableStyleProvider value={tableStyle}>
        <Container {...containerProps}>
          {children}
        </Container>
      </TableStyleProvider>
    </TableProvider>
  )
};