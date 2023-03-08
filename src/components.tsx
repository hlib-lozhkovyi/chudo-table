import React, { ElementType, HTMLAttributes, ReactNode, useEffect } from 'react';
import isFunction from 'lodash/isFunction';
import { useColumns, useFetchData, useTable } from 'hooks';
import {
  TableWrapperPropsInterface,
  TableWrapper,
  TableRootPropsInterface,
  TableRoot,
  TableHeaderPropsInterface,
  TableHeader,
  TableHeaderRowPropsInterface,
  TableHeaderRow,
  TableColumnPropsInterface,
  TableColumn,
  TableBodyPropsInterface,
  TableBody,
  TableRowPropsInterface,
  TableRow,
  TableCellPropsInterface,
  TableCell,
} from 'elements'
import { createColumnsFromChildren } from 'utils';


/**
 * Table
 */
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

export function Table<Record = any>(props: TablePropsInterface<Record>) {
  const {
    children,
    Root = TableRoot,
    Header = TableHeader,
    HeaderRow = TableHeaderRow,
    Column = TableColumn,
    Body = TableBody,
    Row = TableRow,
    Cell = TableCell,
  } = props;

  const { columns, rows } = useTable<Record>()

  return (
    <>
      <Root>
        <Header>
          <HeaderRow>
            {columns.map((column) => (
              <Column key={column.accessor} type={column.type}>
                <column.Header />
              </Column>
            ))}
          </HeaderRow>
        </Header>
        <Body>
          {rows.map((row) => (
            <Row key={row.id}>
              {columns.map((column) => {
                const value = row.getCellValue(column.accessor);

                return (
                  <Cell>
                    <column.Cell value={value} {...row} />
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

/**
 * Columns
 */
export interface ColumnsPropsInterface<Record> {
  children: ReactNode
}

export function Columns<Record = any,>(props: ColumnsPropsInterface<Record>) {
  const {
    children,
  } = props;

  const { initializeColumns } = useColumns();
  const columns = createColumnsFromChildren<Record>(children);

  useEffect(() => {
    initializeColumns(columns);
  }, [])

  return null;
};

/**
 * Column
 */
export interface ColumnPropsInterface<Record = any, K extends Extract<keyof Record, string> = Extract<keyof Record, string>> {
  accessor: K;
  testType?: string;
  Header?: ReactNode;
  children?: (value: Record) => ReactNode | ReactNode;
}

export function Column<Record = any>(props: ColumnPropsInterface<Record>) {
  return null;
}

/**
 * MetaTable
 */

export interface MetaTable<Record = any> extends Omit<ColumnPropsInterface<Record>, 'accessor'> {

}


/**
 * Action Column
 */
export interface ActionColumnPropsInterface<Record = any> extends MetaTable<Record> {

}

export function ActionColumn<Record = any>(props: ActionColumnPropsInterface<Record>) {
  return null;
}


/**
 * Select Column
 */
export interface SelectColumnPropsInterface<Record = any> extends ColumnPropsInterface<Record> {

}

export function SelectColumn<Record = any>(props: SelectColumnPropsInterface<Record>) {
  return null;
}

/**
 * Data Source
 */

export interface DataSourcePropsInterface<T> {
  data?: T[];
  fetcher?: () => Promise<T[]>;
}

export function DataSource<Record = any>(props: DataSourcePropsInterface<Record>) {
  const { data, fetcher } = props;

  const { startFetching, setData, handleFetchError } = useFetchData();

  const fetch = async () => {
    if (!fetcher) {
      return;
    }

    startFetching();

    try {
      const result = await fetcher();
      setData(result)
    } catch (error) {
      handleFetchError(error)
    }
  }

  useEffect(function initializeWithDataSource() {
    if (!fetcher) {
      return;
    }

    fetch();
  }, [])

  useEffect(function initializeWithData() {
    if (!data) {
      return;
    }

    setData(data)
  }, [data])

  return null;
};



/**
 * Pagination
 */
export interface PaginationPropsInterface {

}

export function Pagination(props: PaginationPropsInterface) {
  return null;
}
