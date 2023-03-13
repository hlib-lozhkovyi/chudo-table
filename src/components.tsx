import React, { ElementType, HTMLAttributes, ReactNode, useEffect, useCallback, useMemo, MouseEvent } from 'react';
import clsx from 'classnames';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';

import { useColumnResize, useColumns, useFetchData, usePagination, useResponse, useRowSelection, useSetRows, useTable, useTableLayoutContext, useTableMeta } from 'hooks';
import {
  TableWrapperProps,
  TableWrapper,
  TableRootProps,
  TableRoot,
  TableHeadProps,
  TableHead,
  TableHeadRowProps,
  TableHeadRow,
  TableColumnProps,
  TableColumn,
  TableBodyProps,
  TableBody,
  TableRowProps,
  TableRow,
  TableCellProps,
  TableCell,
  IndeterminateCheckbox,
  TableColumnResizer,
  TableColumnResizerProps,
} from 'elements'
import { createColumnsFromChildren } from 'utils';
import { AccessorKey, ChudoTablePaginationState, DataFetcherParserResult, DataFetcherProps, TableStyleContextType } from 'types';
import { headerCaptionClassName, headerClassName, paginationBorderClassName, paginationCaptionClassName, paginationCaptionNumberClassName, paginationClassName, paginationMetaClassName, paginationNavigationClassName, paginationNavigationItemClassName, paginationNavigationPageActiveClassName, paginationNavigationPageClassName, selectionPanelClassName, tableHeadColumnResizerClassName } from 'config';

/**
 * Table
 */
export interface TableProps<T> extends HTMLAttributes<HTMLTableElement>, TableStyleContextType {
  Wrapper?: ElementType<TableWrapperProps>;
  Root?: ElementType<TableRootProps>;
  Head?: ElementType<TableHeadProps>;
  HeadRow?: ElementType<TableHeadRowProps>;
  Column?: ElementType<TableColumnProps>;
  Resizer?: ElementType<TableColumnResizerProps>;
  Body?: ElementType<TableBodyProps>;
  Row?: ElementType<TableRowProps>;
  Cell?: ElementType<TableCellProps>;
}

export function Table<Record = any>(props: TableProps<Record>) {
  const {
    children,
    Wrapper = TableWrapper,
    Root = TableRoot,
    Head = TableHead,
    HeadRow = TableHeadRow,
    Column = TableColumn,
    Resizer = TableColumnResizer,
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
              <Column key={column.accessor} type={column.type} width={column.width ?? column.minWidth}>
                <column.Header />

                {(column.resizable) && (
                  <ColumnResizer accessor={column.accessor}>
                    <Resizer />
                  </ColumnResizer>
                )}
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
export interface ColumnsProps<Record> {
  children: ReactNode
}

export function Columns<Record = any,>(props: ColumnsProps<Record>) {
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

export interface ColumnMetaDefinition {
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  fixed?: boolean;
  resizable?: boolean;
}

/**
 * Column
 */
export interface ColumnProps<Record = any, K extends Extract<keyof Record, string> = Extract<keyof Record, string>> extends ColumnMetaDefinition {
  accessor: K;
  Header?: ReactNode;
  Wrapper?: ElementType;
  children?: (value: Record) => ReactNode | ReactNode;
}

export function Column<Record = any>(props: ColumnProps<Record>) {
  return null;
}

/**
 * MetaTable
 */

export interface MetaTable<Record = any> extends Omit<ColumnProps<Record>, 'accessor'> {

}


/**
 * Action Column
 */
export interface ActionColumnProps<Record = any> extends MetaTable<Record> {

}

export function ActionColumn<Record = any>(props: ActionColumnProps<Record>) {
  return null;
}


/**
 * Select Column
 */
export interface SelectColumnProps<Record = any> extends ColumnProps<Record> {

}

export function SelectColumn<Record = any>(props: SelectColumnProps<Record>) {
  return null
}

/**
 * Data Source
 */

export interface DataSourceProps<Record, RemoteData> {
  data?: Record[];
  fetcher?: (props: DataFetcherProps) => Promise<RemoteData>;
  parse?: (response: RemoteData) => DataFetcherParserResult<Record>;
}

export function DataSource<Record = any, RemoteData = Record[]>(props: DataSourceProps<Record, RemoteData>) {
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
 * 
 */

export interface ColumnResizerProps<Record> {
  accessor: AccessorKey<Record>;
  children: ReactNode;
}

export function ColumnResizer<Record = any>(props: ColumnResizerProps<Record>) {
  const { children, accessor } = props

  const { isResizing, startResize, stopResize } = useColumnResize<Record>(accessor);

  const handleMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;

    // TODO: add data-column-header-attr 
    const columnEl = target.closest<HTMLDivElement>('[role="columnheader"]');

    if (!columnEl) {
      return;
    }

    const startOffset = (columnEl.offsetWidth - event.pageX);

    startResize(startOffset)
  }, [])

  return (
    <div className={tableHeadColumnResizerClassName} onMouseDown={handleMouseDown}>
      {children}
    </div>
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
    toggleRowSelection(id)
  }, [toggleRowSelection, id])

  return (
    <IndeterminateCheckbox
      checked={checked}
      onChange={handleChange}
    />
  )
}