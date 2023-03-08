import React, { ElementType, HTMLAttributes, ReactNode, useEffect, useCallback } from 'react';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import { useChudoTable, useColumns, useFetchData, usePagination, useResponse, useSetRows, useTable } from 'hooks';
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
import { ChudoTablePaginationState, DataFetcherPropsInterface } from 'types';

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
                    <column.Wrapper>
                      <column.Cell value={value} {...row} />
                    </column.Wrapper>
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
  Wrapper?: ElementType;
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

export interface DataSourcePropsInterface<RemoteData> {
  data?: RemoteData;
  fetcher?: (props: DataFetcherPropsInterface) => Promise<RemoteData>;
}

export function DataSource<Record = any, RemoteData = Record[]>(props: DataSourcePropsInterface<RemoteData>) {
  const { data, fetcher } = props;

  const { currentPage: page } = usePagination<Record, RemoteData>();
  const { startFetching, setResponse, handleFetchError } = useFetchData<Record, RemoteData>();

  const fetch = async () => {
    if (!fetcher) {
      return;
    }

    startFetching();

    try {
      const result = await fetcher({
        page,
      });

      setResponse(result)
    } catch (error) {
      handleFetchError(error as any as Error)
    }
  }

  useEffect(function initializeWithData() {
    if (!data) {
      return;
    }

    setResponse(data)
  }, [data]);


  useEffect(function refetchDataOnPageChange() {
    if (!fetcher) {
      return;
    }

    fetch();
  }, [page])


  return null;
};

/**
 * Data Transformer
 */
export interface DataTransformerProps<Record, RemoteData> {
  getData: ((response: RemoteData) => Record[]) | string;
}

export function DataTransformer<Record = any, RemoteData = Record[]>(props: DataTransformerProps<Record, RemoteData>) {
  const { getData } = props;

  const { response } = useResponse<Record, RemoteData>()
  const { setRows } = useSetRows<Record, RemoteData>()

  useEffect(function handleResponseChanged() {
    if (!response) {
      return;
    }

    const rows = isFunction(getData)
      ? getData(response)
      : get(response, [getData as string])

    setRows(rows)
  }, [response])

  return null;
}

/**
 * Pagination
 */
export interface PaginationProps<Record, RemoteData> {
  pageSize?: ChudoTablePaginationState["pageSize"];
  getTotalCount?: ((response: RemoteData) => number) | string;
  getTotalPages?: ((response: RemoteData) => number) | string;
}

export function Pagination<Record = any, RemoteData = Record[]>(props: PaginationProps<Record, RemoteData>) {
  const { pageSize, getTotalCount, getTotalPages } = props;

  const { response } = useResponse<Record, RemoteData>()
  const {
    setTotalPages,
    setPageSize,
    setTotalCount,
    totalPages,
    currentPage,
    hasMorePages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
  } = usePagination<Record, RemoteData>();

  useEffect(function handlePageSizeChanged() {
    if (!pageSize) {
      return;
    }

    setPageSize(pageSize)
  }, [pageSize]);

  useEffect(function handleResponseChanged() {
    if (response && getTotalPages) {
      const totalCount = isFunction(getTotalPages)
        ? getTotalPages(response)
        : get(response, [getTotalPages as string])

      setTotalPages(totalCount)
    }

    if (response && getTotalCount) {
      const totalCount = isFunction(getTotalCount)
        ? getTotalCount(response)
        : get(response, [getTotalCount as string])

      setTotalCount(totalCount)
    }
  }, [response])

  const handlePrevPageClick = useCallback(() => {
    prevPage();
  }, [prevPage])

  const handleNextPageClick = useCallback(() => {
    nextPage();
  }, [nextPage])

  return (
    <>
      <code>{
        JSON.stringify({
          totalPages,
          currentPage,
          hasMorePages,
          hasNextPage,
          hasPrevPage
        })
      }</code>
      <div>
        <button onClick={handlePrevPageClick} disabled={!hasPrevPage}>prev</button>

        <button onClick={handleNextPageClick} disabled={!hasNextPage}>next</button>
      </div>
    </>
  )
};