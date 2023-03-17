import React, { ElementType, PropsWithRef, HTMLAttributes, ReactNode, useEffect, useCallback, useMemo, MouseEvent, ComponentType, Provider, useRef } from 'react';
import clsx from 'classnames';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';

import { useChudoTableColumnContext, useColumnResize, useColumnSort, useColumns, useFetchData, usePagination, useResponse, useRowSelection, useSetRows, useSorting, useTable, useTableComputedStyles, useTableMeta, useControlledTableLayout } from 'hooks';
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
  SortArrow,
  SortArrowProps,
} from 'elements'
import { createColumnsFromChildren, getCellValue } from 'utils';
import { AccessorKey, ChudoTableColumn, ChudoTablePaginationState, DataFetcherParserResult, DataFetcherProps, TableStyleContextType } from 'types';
import { columnSorterClassName, headerCaptionClassName, headerClassName, paginationBorderClassName, paginationCaptionClassName, paginationCaptionNumberClassName, paginationClassName, paginationMetaClassName, paginationNavigationClassName, paginationNavigationItemClassName, paginationNavigationPageActiveClassName, paginationNavigationPageClassName, selectionPanelClassName, tableHeadColumnActionWrapperClassName, tableHeadColumnResizerClassName, tableHeadColumnSimpleWrapperClassName, tableHeadColumnWrapperClassName } from 'config';
import { ChudoTableColumnProvider } from 'context';

/**
 * Table
 */
export interface TableProps<T> extends HTMLAttributes<HTMLTableElement>, TableStyleContextType {
  Wrapper?: ElementType<TableWrapperProps>;
  Root?: ElementType<PropsWithRef<TableRootProps>>;
  Head?: ElementType<TableHeadProps>;
  HeadRow?: ElementType<TableHeadRowProps>;
  Column?: ElementType<TableColumnProps>;
  Resizer?: ElementType<TableColumnResizerProps>;
  Body?: ElementType<TableBodyProps>;
  Row?: ElementType<TableRowProps<T>>;
  Cell?: ElementType<TableCellProps>;
}

export function Table<Entity = any>(props: TableProps<Entity>) {
  const {
    children,
    fixed,
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

  const tableRef = useRef<HTMLTableElement | null>(null);
  const { id } = useTableMeta();
  const { columns, rows, totalCount } = useTable<Entity>();
  const { columnWidth } = useTableComputedStyles<Entity>();

  const ColumnProvider = (
    ChudoTableColumnProvider as unknown
  ) as Provider<ChudoTableColumn<Entity>>;



  const gridColumnsWidth = useMemo(() => {
    return columnWidth
      .map(([min, max]) => min ? `minmax(${min}, ${max})` : max)
      .join(' ')
  }, [columnWidth])

  useEffect(() => {
    if (!tableRef.current) {
      return;
    }

    tableRef.current.style.gridTemplateColumns = gridColumnsWidth;
  }, [gridColumnsWidth]);

  return (
    <Wrapper tableId={id} fixed={fixed}>
      <Root ref={tableRef} id={id} rowCount={totalCount} fixed={fixed}>
        {/* todo hide columns / set height 0 if headless */}
        <Head>
          <HeadRow>
            {columns.map((column) => (
              <ColumnProvider value={column}>
                <Column
                  key={column.accessor}
                  type={column.type}
                  alignment={column.alignment}
                  sortable={column.sortable}
                >
                  <column.HeaderWrapper>
                    <column.Header />

                    {column.sortable && (
                      <ColumnSorter Arrow={SortArrow} />
                    )}
                  </column.HeaderWrapper>

                  {(column.resizable) && (
                    <ColumnResizer>
                      <Resizer />
                    </ColumnResizer>
                  )}
                </Column>
              </ColumnProvider>
            ))}
          </HeadRow>
        </Head>
        <Body>
          {rows.map((row) => (
            <Row key={row.id} rowId={row.id} rowIndex={row.index} row={row._raw}>
              {columns.map((column) => {
                const value = getCellValue(row, column.accessor);

                return (
                  <Cell
                    type={column.type}
                    rowId={row.id}
                    rowIndex={row.index}
                    alignment={column.alignment}
                  >
                    <column.Wrapper>
                      <column.Cell
                        value={value}
                        {...row._raw}
                      />
                    </column.Wrapper>
                  </Cell>
                )
              })}
            </Row>
          ))}
        </Body>
      </Root >
      {children}
    </Wrapper >
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
export interface ColumnsProps<Entity> {
  children: ReactNode;
}

export function Columns<Entity = any,>(props: ColumnsProps<Entity>) {
  const {
    children,
  } = props;

  const { initializeColumns } = useColumns<Entity>();
  const columns = createColumnsFromChildren<Entity>(children);

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
  sortable?: boolean;
}

/**
 * Column
 */
export interface ColumnProps<Entity = any, K extends Extract<keyof Entity, string> = Extract<keyof Entity, string>> extends ColumnMetaDefinition {
  accessor: K;
  Header?: ReactNode;
  Wrapper?: ElementType;
  children?: (value: Entity) => ReactNode | ReactNode;
}

export function Column<Entity = any>(props: ColumnProps<Entity>) {
  return null;
}

/**
 * MetaTable
 */

export interface MetaTable<Entity = any> extends Omit<ColumnProps<Entity>, 'accessor'> {

}


/**
 * Action Column
 */
export interface ActionColumnProps<Entity = any> extends MetaTable<Entity> {

}

export function ActionColumn<Entity = any>(props: ActionColumnProps<Entity>) {
  return null;
}


/**
 * Select Column
 */
export interface SelectColumnProps<Entity = any> extends ColumnProps<Entity> {

}

export function SelectColumn<Entity = any>(props: SelectColumnProps<Entity>) {
  return null
}


/**
 * 
 */

export interface TableColumnSimpleWrapperProps<Entity, Key> extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accessor?: Key;
}


export function TableColumnSimpleWrapper<Entity = any, K extends Extract<keyof Entity, string> = Extract<keyof Entity, string>>(props: TableColumnSimpleWrapperProps<Entity, K>) {
  const { children, accessor: propAccessor } = props;

  return <div className={clsx(tableHeadColumnWrapperClassName, tableHeadColumnSimpleWrapperClassName)}>{children}</div>
}



/**
 * 
 */

export interface TableColumnActionWrapperProps<Entity, Key> extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  accessor?: Key;
}


export function TableColumnActionWrapper<Entity = any, K extends Extract<keyof Entity, string> = Extract<keyof Entity, string>>(props: TableColumnActionWrapperProps<Entity, K>) {
  const { children, accessor: propAccessor } = props

  const { sortable, accessor: columnAccessor } = useChudoTableColumnContext();
  const accessor = columnAccessor ?? propAccessor;

  const { toggleSort } = useColumnSort(accessor)

  const handleColumnClick = useCallback(() => {
    if (!sortable) {
      return
    }

    toggleSort();
  }, [sortable, toggleSort])

  return <button onClick={handleColumnClick} className={clsx(tableHeadColumnWrapperClassName, tableHeadColumnActionWrapperClassName)}>{children}</button>
}



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

export interface CheckboxInputProps {
  id: string;
}

export function CheckboxInput(props: CheckboxInputProps) {
  const { id } = props;
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

/**
 * Data Source
 */

export interface DataSourceProps<Entity, RemoteData> {
  data?: Entity[];
  fetcher?: (props: DataFetcherProps<Entity>) => Promise<RemoteData>;
  parse?: (response: RemoteData) => DataFetcherParserResult<Entity>;
}

export function DataSource<Entity = any, RemoteData = Entity[]>(props: DataSourceProps<Entity, RemoteData>) {
  const { data, fetcher, parse } = props;

  const [sorting] = useSorting<Entity, RemoteData>();
  const { currentPage: page, pageSize } = usePagination<Entity, RemoteData>();
  const { startFetching, setRemoteData, handleFetchError } = useFetchData<Entity, RemoteData>();
  const { setRows } = useSetRows<Entity, RemoteData>()

  const fetch = async () => {
    if (!fetcher) {
      return;
    }

    startFetching();

    try {
      const limit = pageSize;
      const offset = (page - 1) * pageSize

      const result = await fetcher({
        page,
        pageSize,
        limit,
        offset,
        sorting,
      });

      const remoteData = isFunction(parse)
        ? parse(result)
        : { data: result } as DataFetcherParserResult<Entity>;

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
  }, [page, sorting]);

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
export interface DataTransformerProps<Entity, RemoteData> {
  getRows: ((response: RemoteData) => Entity[]) | string;
}

export function DataTransformer<Entity = any, RemoteData = Entity[]>(props: DataTransformerProps<Entity, RemoteData>) {
  const { getRows } = props;

  const { response } = useResponse<Entity, RemoteData>()
  const { setRows } = useSetRows<Entity, RemoteData>()

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
 * Column Resizer
 */

export interface ColumnResizerProps<Entity> {
  accessor?: AccessorKey<Entity>;
  children: ReactNode;
}

export function ColumnResizer<Entity = any>(props: ColumnResizerProps<Entity>) {
  const { children, accessor: propAccessor } = props

  const { accessor: columnAccessor } = useChudoTableColumnContext();
  const accessor = columnAccessor ?? propAccessor;

  const { isResizing, startResize, stopResize } = useColumnResize<Entity>(accessor);

  const handleMouseClick = (e) => e.preventDefault();

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
    <div className={tableHeadColumnResizerClassName} onClick={handleMouseClick} onMouseDown={handleMouseDown}>
      {children}
    </div>
  )
}

/**
 * Column Sorter
 */

export interface ColumnSorterProps<Entity> {
  accessor?: AccessorKey<Entity>;
  Arrow: ComponentType<SortArrowProps>;
}

export function ColumnSorter<Entity = any>(props: ColumnSorterProps<Entity>) {
  const { Arrow, accessor: propAccessor } = props

  const { accessor: columnAccessor } = useChudoTableColumnContext();
  const accessor = columnAccessor ?? propAccessor;

  const { sort } = useColumnSort(accessor)

  return (
    <div className={columnSorterClassName}>
      <Arrow sortDir={sort} isCurrent={!!sort} />
    </div>
  )
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
    <div
      className={selectionPanelClassName}
      style={{
        ...(isHidden && {
          visibility: 'hidden'
        })
      }}
    >
      <span className="css-1wwxqgk">{selectedCount} selected</span>
    </div >
  )
}

/**
 * Pagination
 */
export interface PaginationProps<Entity, RemoteData> extends Pick<TableStyleContextType, 'border'> {
  pageSize: ChudoTablePaginationState["pageSize"];
  getTotalCount?: ((response: RemoteData) => number) | string;
  getTotalPages?: ((response: RemoteData) => number) | string;
}

export function Pagination<Entity = any, RemoteData = Entity[]>(props: PaginationProps<Entity, RemoteData>) {
  const { pageSize, getTotalCount, getTotalPages, border } = props;

  const {
    border: paginationBorder,
  } = useControlledTableLayout({ border });

  const { response } = useResponse<Entity, RemoteData>()
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
  } = usePagination<Entity, RemoteData>();

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

  const from = ((currentPage - 1) * pageSize ?? 1) + 1;
  const to = currentPage * pageSize

  return (
    <nav aria-label="Table navigation" className={
      clsx(paginationClassName, {
        [paginationBorderClassName]: paginationBorder,
      })
    }>
      <SelectedPanel />

      <div className={paginationMetaClassName}>
        <div className={paginationCaptionClassName}>
          <span >
            Showing <span className={paginationCaptionNumberClassName}>{from}</span> to <span className={paginationCaptionNumberClassName}>{to}</span> of <span className={paginationCaptionNumberClassName}>{totalCount}</span>
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