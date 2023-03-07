import React from 'react';
import { HTMLAttributes, ReactNode, ElementType } from 'react';
import { useTable } from 'hooks/use-table.hook';

import { TableWrapper as DefaultWrapper, TableWrapperPropsInterface } from 'components/table-wrapper.component'
import { TableRoot as DefaultRoot, TableRootPropsInterface } from 'components/table-root.component'
import { TableHeader as DefaultHeader, TableHeaderPropsInterface } from 'components/table-header.component'
import { TableHeaderRow as DefaultHeaderRow, TableHeaderRowPropsInterface } from 'components/table-header-row.component'
import { TableColumn as DefaultColumn, TableColumnPropsInterface } from 'components/table-column.component'
import { TableBody as DefaultBody, TableBodyPropsInterface } from 'components/table-body.component'
import { TableRow as DefaultRow, TableRowPropsInterface } from 'components/table-row.component'
import { TableCell as DefaultCell, TableCellPropsInterface } from 'components/table-cell.component'
import { Item } from 'chudo-table';

export interface TablePropsInterface<T> extends HTMLAttributes<HTMLTableElement> {
  Wrapper?: ElementType<TableWrapperPropsInterface>;
  Root?: ElementType<TableRootPropsInterface>;
  Header?: ElementType<TableHeaderPropsInterface>;
  HeaderRow?: ElementType<TableHeaderRowPropsInterface>;
  Column?: ElementType<TableColumnPropsInterface>;
  Body?: ElementType<TableBodyPropsInterface>;
  Row?: ElementType<TableRowPropsInterface>;
  Cell?: ElementType<TableCellPropsInterface>;
}

export const Table = <T extends Item>(props: TablePropsInterface<T>) => {
  const {
    children,
    Wrapper = DefaultWrapper,
    Root = DefaultRoot,
    Header = DefaultHeader,
    HeaderRow = DefaultHeaderRow,
    Column = DefaultColumn,
    Body = DefaultBody,
    Row = DefaultRow,
    Cell = DefaultCell,
    ...rest
  } = props;

  const { columns, rows } = useTable<T>()

  return (
    <>
      <Root>
        <Header>
          <HeaderRow>
            {columns.map((column) => (
              <Column key={column.accessor}>{column.renderHeader()}</Column>
            ))}
          </HeaderRow>
        </Header>
        <Body>
          {rows.map((row) => (
            <Row key={row.id}>
              {columns.map((column) => {
                const value = row.getValue(column.accessor);

                return (
                  <Cell>
                    {column.renderCell(value, row._raw)}
                  </Cell>
                )
              })}
            </Row>
          ))}
        </Body>
      </Root>
      {children}
    </>
  )
};
