import React, { ElementType, HTMLAttributes, ReactNode, useEffect, useCallback, useMemo } from 'react';
import clsx from 'classnames';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';

import { useChudoTable, useColumns, useFetchData, usePagination, useResponse, useRowSelection, useSetRows, useTable, useTableLayoutContext, useTableMeta } from 'hooks';
import {
  TableWrapperPropsInterface,
  TableWrapper,
  TableRootPropsInterface,
  TableRoot,
  TableHeadPropsInterface,
  TableHead,
  TableHeadRowPropsInterface,
  TableHeadRow,
  TableColumnPropsInterface,
  TableColumn,
  TableBodyPropsInterface,
  TableBody,
  TableRowPropsInterface,
  TableRow,
  TableCellPropsInterface,
  TableCell,
  IndeterminateCheckbox,
} from 'elements'
import { createColumnsFromChildren } from 'utils';
import { ChudoTablePaginationState, DataFetcherParserResultInterface, DataFetcherPropsInterface, TableStyleContextType } from 'types';
import { headerCaptionClassName, headerClassName, paginationBorderClassName, paginationCaptionClassName, paginationCaptionNumberClassName, paginationClassName, paginationMetaClassName, paginationNavigationClassName, paginationNavigationItemClassName, paginationNavigationLinkClassName, paginationNavigationPageActiveClassName, paginationNavigationPageClassName, selectionPanelClassName } from 'config';
import { TableStyleProvider } from 'context';

/**
 * Table
 */
export interface TablePropsInterface<T> extends HTMLAttributes<HTMLTableElement>, TableStyleContextType {
  Wrapper?: ElementType<TableWrapperPropsInterface>;
  Root?: ElementType<TableRootPropsInterface>;
  Head?: ElementType<TableHeadPropsInterface>;
  HeadRow?: ElementType<TableHeadRowPropsInterface>;
  Column?: ElementType<TableColumnPropsInterface>;
  Body?: ElementType<TableBodyPropsInterface>;
  Row?: ElementType<TableRowPropsInterface>;
  Cell?: ElementType<TableCellPropsInterface>;
}

export function Table<Record = any>(props: TablePropsInterface<Record>) {
  const {
    children,
    Wrapper = TableWrapper,
    Root = TableRoot,
    Head = TableHead,
    HeadRow = TableHeadRow,
    Column = TableColumn,
    Body = TableBody,
    Row = TableRow,
    Cell = TableCell,
  } = props;

  const { columns, rows } = useTable<Record>();
  const { id } = useTableMeta();

  return (
    <Wrapper tableId={id}>
      <Root id={id}>
        {/* todo hide columns / set height 0 if headless */}
        <Head>
          <HeadRow>
            {columns.map((column) => (
              <Column key={column.accessor} type={column.type}>
                <column.Header />
              </Column>
            ))}
          </HeadRow>
        </Head>
        <Body>
          {rows.map((row, index) => (
            <Row key={row._id} rowId={row._id} index={index}>
              {columns.map((column) => {
                const value = row.getCellValue(column.accessor);

                return (
                  <Cell type={column.type} rowId={row._id}>
                    <column.Wrapper>
                      <column.Cell
                        value={value}
                        {...row}
                      />
                    </column.Wrapper>
                  </Cell>
                )
              })}
            </Row>
          ))}
        </Body>
      </Root>
      {children}
    </Wrapper>
  )
};

/**
 * Table Header
 */
export interface TableHeaderProps {
  caption?: ReactNode;
  children?: ReactNode;
}

export function TableHeader(props: TableHeaderProps) {
  const { id } = useTableMeta();
  const { caption, children } = props;

  const tableCaption = useMemo(() => id ? `${id}-caption` : undefined, [id])

  return (
    <figcaption id={tableCaption} className={clsx(headerClassName)}>
      <h2 className={clsx(headerCaptionClassName)}>{caption}</h2>
      <div>{children}</div>
    </figcaption>
  )
}

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
  return null
}

/**
 * Data Source
 */

export interface DataSourcePropsInterface<Record, RemoteData> {
  data?: Record[];
  fetcher?: (props: DataFetcherPropsInterface) => Promise<RemoteData>;
  parse?: (response: RemoteData) => DataFetcherParserResultInterface<Record>;
}

export function DataSource<Record = any, RemoteData = Record[]>(props: DataSourcePropsInterface<Record, RemoteData>) {
  const { data, fetcher, parse } = props;

  const { currentPage: page, pageSize } = usePagination<Record, RemoteData>();
  const { startFetching, setRemoteData, handleFetchError } = useFetchData<Record, RemoteData>();
  const { setRows } = useSetRows<Record, RemoteData>()

  const fetch = async () => {
    if (!fetcher) {
      return;
    }

    startFetching();

    try {
      const result = await fetcher({
        page,
        pageSize
      });

      const remoteData = isFunction(parse)
        ? parse(result)
        : { data: result } as DataFetcherParserResultInterface<Record>;

      setRemoteData(remoteData)
    } catch (error) {
      handleFetchError(error as any as Error)
    }
  }

  useEffect(function refetchDataOnPageChange() {
    if (!fetcher) {
      return;
    }

    fetch();
  }, [page]);

  useEffect(function initializeWithData() {
    if (!data) {
      return;
    }

    setRows(data)
  }, [data]);

  return null;
};

/**
 * Data Transformer
 */
export interface DataTransformerProps<Record, RemoteData> {
  getRows: ((response: RemoteData) => Record[]) | string;
}

export function DataTransformer<Record = any, RemoteData = Record[]>(props: DataTransformerProps<Record, RemoteData>) {
  const { getRows } = props;

  const { response } = useResponse<Record, RemoteData>()
  const { setRows } = useSetRows<Record, RemoteData>()

  useEffect(function handleResponseChanged() {
    if (!response) {
      return;
    }

    const rows = isFunction(getRows)
      ? getRows(response)
      : get(response, [getRows as string])

    setRows(rows)
  }, [response])

  return null;
}


/**
 * SelectedRow
 */

export interface SelectedPanelProps {

}

export function SelectedPanel(props: SelectedPanelProps) {
  const { isSomeSelected, selectedCount, isAllSelected, selectedIds } = useRowSelection();

  const isHidden = useMemo(() => !isSomeSelected, [isSomeSelected])

  return (
    <div className={selectionPanelClassName} style={{
      ...(isHidden && {
        visibility: 'hidden'
      })
    }}>
      <span className="css-1wwxqgk">{selectedCount} selected</span>
    </div >
  )
}

/**
 * Pagination
 */
export interface PaginationProps<Record, RemoteData> extends Pick<TableStyleContextType, 'border'> {
  pageSize?: ChudoTablePaginationState["pageSize"];
  getTotalCount?: ((response: RemoteData) => number) | string;
  getTotalPages?: ((response: RemoteData) => number) | string;
}

export function Pagination<Record = any, RemoteData = Record[]>(props: PaginationProps<Record, RemoteData>) {
  const { pageSize, getTotalCount, getTotalPages, border } = props;

  const {
    border: tableBorder,
  } = useTableLayoutContext();

  const { response } = useResponse<Record, RemoteData>()
  const {
    setTotalPages,
    setPageSize,
    setTotalCount,
    setCurrentPage,
    totalCount,
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
  }, [prevPage]);

  const handleNextPageClick = useCallback(() => {
    nextPage();
  }, [nextPage]);


  const isPageSelected = useCallback((page: number) => page === currentPage, [currentPage])

  const handlePageClick = useCallback((page: number) => () => setCurrentPage(page), [setCurrentPage])

  const pages = useMemo(() =>
    Array(totalPages).fill(-1).map((_v, index) => index + 1)
    , [totalPages])

  const layoutStyles = {
    border: border ?? tableBorder,
  }

  return (
    <nav aria-label="Table navigation" className={
      clsx(paginationClassName, {
        [paginationBorderClassName]: layoutStyles.border,
      })
    }>
      <SelectedPanel />

      <div className={paginationMetaClassName}>
        <div className={paginationCaptionClassName}>
          <span >
            Showing <span className={paginationCaptionNumberClassName}>{currentPage}</span> to <span className={paginationCaptionNumberClassName}>{currentPage * pageSize}</span> of <span className={paginationCaptionNumberClassName}>{totalCount}</span>
          </span>
        </div>

        <ul className={paginationNavigationClassName}>
          <li className={paginationNavigationItemClassName}>
            <button
              type="button"
              className={paginationNavigationPageClassName}
              onClick={handlePrevPageClick}
              disabled={!hasPrevPage}
              aria-disabled={!hasPrevPage}
            >
              <caption>Previous page</caption>
              <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            </button>
          </li>

          {pages.map(page => (
            <li key={page} className={paginationNavigationItemClassName}>
              <button
                type="button"
                className={clsx(paginationNavigationPageClassName, isPageSelected(page) && paginationNavigationPageActiveClassName)}
                onClick={handlePageClick(page)}
              >
                {page}
              </button>
            </li>
          ))}

          <li className={paginationNavigationItemClassName}>
            <button
              type="button"
              className={paginationNavigationPageClassName}
              onClick={handleNextPageClick}
              disabled={!hasNextPage}
              aria-disabled={!hasNextPage}
            >
              <caption>Next page</caption>
              <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
            </button>
          </li>
        </ul>
      </div>
    </nav >
  )
};


/**
 * IndeterminateCheckboxInput
 */

export function IndeterminateCheckboxInput() {
  const { isSomeSelected, isAllSelected, toggleAllRowsSelection } = useRowSelection();

  return (
    <IndeterminateCheckbox
      checked={isAllSelected}
      indeterminate={isAllSelected ? false : isSomeSelected}
      onClick={toggleAllRowsSelection}
    />
  )
}

/**
 * CheckboxInput
 */

export function CheckboxInput(props) {
  const { _id: id } = props;
  const { isRowSelected, toggleRowSelection } = useRowSelection();

  const checked = useMemo(() => isRowSelected(id), [id, isRowSelected])

  const handleChange = useCallback(() => {
    debugger;
    toggleRowSelection(id)
  }, [toggleRowSelection, id])

  return (
    <IndeterminateCheckbox
      checked={checked}
      onChange={handleChange}
    />
  )
}