import './styles.scss';

import React, { ElementType, Provider, ReactNode, useMemo } from 'react';
import { TableContainerProps, TableContainer } from 'elements';

import { UseChudoTableHook, useChudoTable } from 'hooks';
import { ChudoTableProvider, TableStyleProvider } from 'context';
import { ChudoTableContextType, TableStyleContextType } from 'types';

export interface ChudoTableProps<Record> extends UseChudoTableHook<Record>, TableContainerProps, TableStyleContextType {
  children: ReactNode;
  Container?: ElementType<TableContainerProps>;
}

export function ChudoTable<Record = any, RemoteData = any>(props: ChudoTableProps<Record>) {
  const {
    children,
    Container = TableContainer,
    fixed,
    rounded,
    border,
    stripe,
    rowBorder,
    columnBorder,
    compact,
    highlightRow,
    ...rest
  } = props;

  // TODO: add invariaint if DataSource isn't the latest children

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

  const tableStyle: TableStyleContextType = useMemo(() => ({
    fixed,
    border,
    rounded,
    stripe,
    rowBorder,
    columnBorder,
    compact,
    highlightRow,
  }),
    [
      fixed,
      border,
      rounded,
      stripe,
      rowBorder,
      columnBorder,
      compact,
      highlightRow,
    ]);

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