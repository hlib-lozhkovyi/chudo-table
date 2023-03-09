import './styles.scss';

import React, { ElementType, Provider, ReactNode } from 'react';
import { TableContainerPropsInterface, TableContainer } from 'elements';

import { UseChudoTableHook, useChudoTable } from 'hooks';
import { ChudoTableProvider } from 'context';
import { ChudoTableContextType } from 'types';

export interface ChudoTableProps<Record> extends UseChudoTableHook<Record>, TableContainerPropsInterface {
  children: ReactNode;
  Container?: ElementType<TableContainerPropsInterface>;
}

export function ChudoTable<Record = any, RemoteData = any>(props: ChudoTableProps<Record>) {
  const {
    children,
    Container = TableContainer,
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

  return (
    <TableProvider value={chudoTable}>
      <Container {...containerProps}>
        {children}
      </Container>
    </TableProvider>
  )
};