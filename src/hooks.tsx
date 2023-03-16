import { useReducer, useMemo, Reducer, useCallback, useContext, Context, useState, ChangeEvent, useRef, useEffect } from 'react';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import merge from 'lodash/merge';
import { ChudoTableColumnContext, ChudoTableContext, TableStyleContext } from 'context';
import { chudoTableReducer } from 'reducer';
import {
  ChudoTableContextType,
  ChudoTableState,
  ChudoTableAction,
  ChudoTableHelpers,
  ChudoTableConfig,
  ChudoTableRow,
  ChudoTableColumn,
  ChudoTablePaginationState,
  ChudoTablePaginationHelpers,
  ChudoTableMetaConfig,
  DataFetcherParserResult,
  TableStyleContextType,
  EntityID,
  AccessorKey,
  ChudoTableColumnMetaConfig,
  ChudoTableColumnSortDirection,
  ChudotTableSortState
} from "types";
import { generateRowId, getRowIndex, isAllRowsSelected, widthToStyleValue } from 'utils';

/**
 * 
 */
export function useChudoTableContext<Entity, RemoteData = Entity[]>() {
  const chudoTable = useContext<ChudoTableContextType<Entity, RemoteData>>(
    ChudoTableContext as unknown as Context<ChudoTableContextType<Entity, RemoteData>>,
  );

  return chudoTable;
}

/**
 * 
 */
export interface UseChudoTableHook<Entity> extends ChudoTableConfig<Entity> {

}

export function useChudoTable<Entity = any, RemoteData = Entity[]>(
  props: UseChudoTableHook<Entity>
): ChudoTableContextType<Entity, RemoteData> {
  const {
    idAccessor,
    id: tableId
  } = props

  const [state, dispatch] = useReducer<
    Reducer<ChudoTableState<Entity, RemoteData>, ChudoTableAction<Entity, RemoteData>>
  >(chudoTableReducer, {
    isLoading: false,
    error: null,
    columns: [],
    rows: [],
    response: null,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
    selectedIds: [],
    sorting: {} as ChudotTableSortState<Entity>
  });

  const getRowId = useCallback((data: Entity): EntityID => {
    const id: string | number = isFunction(idAccessor)
      ? idAccessor(data)
      : get(data, [idAccessor as string]);

    return id as EntityID;
  }, [idAccessor])

  const createTableRowsFromData = useCallback((data: Entity[]) => {
    return data.map((row, index) => ({
      id: getRowId(row) ?? generateRowId(tableId, state.currentPage, index),
      index: getRowIndex(state.currentPage, index),
      _raw: row,
    }))
  }, [tableId, state.currentPage, getRowId])

  const initializeColumns = useCallback((columns: ChudoTableColumn<Entity>[]) => {
    dispatch({
      type: "INITIALIZE_COLUMNS",
      payload: {
        columns
      }
    })
  }, []);

  const updateColumn = useCallback((accessor: AccessorKey<Entity>, meta: Partial<ChudoTableColumnMetaConfig>) => {
    dispatch({
      type: "UPDATE_COLUMN",
      payload: {
        accessor,
        meta
      }
    })
  }, []);

  const setIsLoading = useCallback(() => {
    return;
  }, []);

  const setError = useCallback(() => {
    return;
  }, []);

  const setRows = useCallback((data: Entity[]) => {
    const rows = createTableRowsFromData(data);

    dispatch({
      type: "SET_ROWS",
      payload: {
        rows
      }
    });
  }, [createTableRowsFromData]);

  const setRemoteData = useCallback((remoteData: DataFetcherParserResult<Entity>) => {
    const { data, ...rest } = remoteData;

    const rows = createTableRowsFromData(data);

    dispatch({
      type: "SET_REMOTE_DATA",
      payload: {
        rows,
        ...rest
      }
    });
  }, [createTableRowsFromData]);

  const setCurrentPage = useCallback((currentPage: number) => {
    dispatch({
      type: "SET_CURRENT_PAGE",
      payload: {
        currentPage
      }
    });
  }, []);

  const setTotalPages = useCallback((totalPages: number) => {
    dispatch({
      type: "SET_TOTAL_PAGES",
      payload: {
        totalPages
      }
    });
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    dispatch({
      type: "SET_PAGE_SIZE",
      payload: {
        pageSize
      }
    });
  }, []);

  const setTotalCount = useCallback((totalCount: number) => {
    dispatch({
      type: "SET_TOTAL_COUNT",
      payload: {
        totalCount
      }
    });
  }, []);

  const toggleColumnSort = useCallback((accessor: AccessorKey<Entity>) => {
    dispatch({
      type: "TOGGLE_COLUMN_SORT",
      payload: {
        accessor
      }
    });
  }, []);

  const toggleAllRowsSelection = useCallback(() => {
    dispatch({
      type: "TOGGLE_ALL_ROWS_SELECTION"
    });
  }, []);

  const toggleRowSelection = useCallback((id: string) => {
    dispatch({
      type: "TOGGLE_ROW_SELECTION",
      payload: {
        id
      }
    });
  }, []);

  const helpers: ChudoTableHelpers<Entity, RemoteData> = {
    initializeColumns,
    updateColumn,
    getRowId,
    setIsLoading,
    setError,
    setRows,
    setRemoteData,
    setCurrentPage,
    setTotalPages,
    setPageSize,
    setTotalCount,
    toggleColumnSort,
    toggleAllRowsSelection,
    toggleRowSelection,
  }

  const ctx = {
    ...state,
    ...helpers,
    ...props,
  }

  return ctx;
}

/**
 * 
 */
export function useChudoTableColumnContext<Entity>() {
  const chudoTableColumn = useContext<ChudoTableColumn<Entity>>(
    ChudoTableColumnContext as unknown as Context<ChudoTableColumn<Entity>>,
  );

  return chudoTableColumn;
}

/**
 * 
 */
export function useTableLayoutContext() {
  const tableLayout = useContext<TableStyleContextType>(
    TableStyleContext as unknown as Context<TableStyleContextType>,
  );

  return tableLayout;
}

/**
 * 
 */
export function useControlledTableLayout(props?: Partial<TableStyleContextType>) {
  const tableLayout = useTableLayoutContext();

  const layout = useMemo(() => merge({}, tableLayout, props), [tableLayout, props])

  return layout;
}

/**
 * 
 */
export interface UseTableMetaHook {
  id?: ChudoTableMetaConfig["id"];
}

export function useTableMeta<Entity, RemoteData>(): UseTableMetaHook {
  const { id } = useChudoTableContext<Entity, RemoteData>() ?? {};

  return {
    id
  }
}

/**
 * 
 */
export interface UseColumnsHook<Entity, RemoteData> {
  initializeColumns: ChudoTableHelpers<Entity, RemoteData>["initializeColumns"]
}

export function useColumns<Entity, RemoteData = Entity[]>(): UseColumnsHook<Entity, RemoteData> {
  const { initializeColumns } = useChudoTableContext<Entity, RemoteData>();

  return { initializeColumns }
}

/**
 * 
 */
export interface UseFetchDataHook<Entity, RemoteData> {
  startFetching: () => void;
  stopFetching: () => void;
  setRemoteData: (data: DataFetcherParserResult<Entity>) => void;
  handleFetchError: (error: Error) => void;
}

export function useFetchData<Entity = Object, RemoteData = Entity[]>(): UseFetchDataHook<Entity, RemoteData> {
  const { setIsLoading, setRemoteData, setError } = useChudoTableContext<Entity, RemoteData>();

  const startFetching = useCallback(() => setIsLoading(true), [setIsLoading]);

  const stopFetching = useCallback(() => setIsLoading(false), [setIsLoading]);

  const handleFetchError = useCallback((error: Error) => {
    stopFetching();
    setError(error)
  }, [stopFetching, setError])

  return {
    startFetching,
    stopFetching,
    setRemoteData,
    handleFetchError
  };
};

/**
 * Use
 */
export interface UseResponseHook<Entity, RemoteData> {
  response: ChudoTableContextType<Entity, RemoteData>["response"];
}

export function useResponse<Entity = any, RemoteData = Entity[]>(): UseResponseHook<Entity, RemoteData> {
  const { response } = useChudoTableContext<Entity, RemoteData>()

  return { response }
}

/**
 * 
 */
export interface UseTableHook<Entity, RemoteData> {
  totalCount: ChudoTableState<Entity, RemoteData>['totalCount'];
  rows: ChudoTableState<Entity, RemoteData>['rows'];
  columns: ChudoTableState<Entity, RemoteData>['columns'];
}

export function useTable<Entity = any, RemoteData = Entity[]>(): UseTableHook<Entity, RemoteData> {
  const { rows, columns, totalCount } = useChudoTableContext<Entity, RemoteData>();

  return {
    totalCount,
    rows,
    columns
  }
}

/**
 * 
 */
export function useTableId<Entity = any, RemoteData = Entity[]>(): string | undefined {
  const { id } = useChudoTableContext<Entity, RemoteData>() ?? {};

  return id
}
/**
 * 
 */
export interface UseSetRowsHook<Entity, RemoteData> {
  setRows: ChudoTableHelpers<Entity, RemoteData>['setRows'];
}

export function useSetRows<Entity = any, RemoteData = Entity[]>(): UseSetRowsHook<Entity, RemoteData> {
  const { setRows } = useChudoTableContext<Entity, RemoteData>();

  return {
    setRows
  }
}

/**
 * 
 */
export interface UsePaginationHook<Entity, RemoteData> extends ChudoTablePaginationState, ChudoTablePaginationHelpers {
  hasMorePages: boolean;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: () => void;
  prevPage: () => void;
}

export function usePagination<Entity = any, RemoteData = Entity[]>(): UsePaginationHook<Entity, RemoteData> {
  const {
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    setCurrentPage,
    setTotalPages,
    setPageSize,
    setTotalCount,
  } = useChudoTableContext<Entity, RemoteData>();

  const hasMorePages = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);

  const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);

  const hasNextPage = useMemo(() => hasMorePages, [hasMorePages]);

  const nextPage = useCallback(() => {
    if (!hasNextPage) {
      return;
    }

    setCurrentPage(currentPage + 1)
  }, [hasNextPage, currentPage, setCurrentPage])

  const prevPage = useCallback(() => {
    if (!hasPrevPage) {
      return;
    }

    setCurrentPage(currentPage - 1)
  }, [hasPrevPage, currentPage, setCurrentPage])

  return {
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    setCurrentPage,
    setTotalPages,
    setPageSize,
    setTotalCount,
    hasMorePages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage
  }
}

/**
 * 
 */
export interface UseRowSelectionHook<Entity, RemoteData> {
  isSomeSelected: boolean;
  isAllSelected: boolean;
  selectedCount: number;
  selectedIds: EntityID[];
  toggleAllRowsSelection: ChudoTableHelpers<Entity, RemoteData>["toggleAllRowsSelection"];
  toggleRowSelection: ChudoTableHelpers<Entity, RemoteData>["toggleRowSelection"];
  isRowSelected: (id: EntityID) => boolean;
}

export function useRowSelection<Entity = any, RemoteData = Entity[]>(): UseRowSelectionHook<Entity, RemoteData> {
  const { pageSize, selectedIds, toggleAllRowsSelection, toggleRowSelection } = useChudoTableContext<Entity, RemoteData>();

  const selectedCount = useMemo(() => selectedIds?.length, [selectedIds])

  const isSomeSelected = useMemo(() => selectedCount > 0, [selectedCount])

  const isAllSelected = useMemo(() => isAllRowsSelected(selectedCount, pageSize), [selectedCount, pageSize])

  const isRowSelected = useCallback((id: EntityID) => selectedIds.includes(id), [selectedIds])

  return {
    isSomeSelected,
    isAllSelected,
    selectedCount,
    selectedIds,
    toggleAllRowsSelection,
    toggleRowSelection,
    isRowSelected
  }
}

export function useColumn<
  Entity = any, RemoteData = Entity[]
>(accessor: AccessorKey<Entity>): [ChudoTableColumn<Entity>, (meta: Partial<ChudoTableColumnMetaConfig>) => void] {
  const { columns, updateColumn } = useChudoTableContext<Entity, RemoteData>();

  const column = useMemo(() => columns.find((column) =>
    column.accessor === accessor
  ), [columns])

  const setColumnMeta = useCallback((meta: Partial<ChudoTableColumnMetaConfig>) => {
    updateColumn(accessor, meta)
  }, [updateColumn])

  return [column as ChudoTableColumn<Entity>, setColumnMeta];
}

/**
 * 
 */

export function useColumnWidth<Entity = any>(accessor: AccessorKey<Entity>): [number, (width: number) => void] {
  const [column, updateColumn] = useColumn<Entity>(accessor);
  const { computedWidth, minWidth = 0, maxWidth = Number.MAX_SAFE_INTEGER } = column;

  const setWidth = useCallback((nextWidth: number) => {
    if (isNumber(minWidth) && nextWidth < minWidth) {
      return;
    }

    if (isNumber(maxWidth) && nextWidth > maxWidth) {
      return;
    }

    updateColumn({ computedWidth: nextWidth });
  }, [updateColumn, minWidth, maxWidth])

  return [computedWidth, setWidth];
}


/**
 * 
 */

export interface UseColumnResizeHook {
  isResizing: boolean;
  startResize: (startOffset: number) => void;
  resize: (offset: number) => void;
  stopResize: (startOffset: number) => void;
  breakResize: () => void;
}


export function useColumnResize<Entity = any>(accessor: AccessorKey<Entity>): UseColumnResizeHook {
  const [, setWidth] = useColumnWidth(accessor);

  const offset = useRef<Number | null>(null);

  const isResizing = useMemo(() => !!offset.current, [offset.current])

  const resize = useCallback((offset: number) => {

  }, []);

  const stopResize = useCallback((endOffset: number) => {
    offset.current = null;
  }, []);

  const breakResize = useCallback(() => {
    offset.current = null;
  }, []);


  const mouseMoveHandler = useCallback((e) => {
    if (!offset.current) {
      return;
    }

    const nextWidth = offset.current + e.pageX;

    setWidth(nextWidth)
  }, [])

  const mouseUpHandler = () => {
    offset.current = null;
  }

  const startResize = useCallback((startOffset: number) => {
    offset.current = startOffset;

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }, []);

  useEffect(function cleanUpListeners() {
    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    }
  }, [])

  return {
    isResizing,
    startResize,
    resize,
    stopResize,
    breakResize
  }
}

/**
 * 
 */
export function useTableCaption(customTableId?: string): string | undefined {
  const id = useTableId();

  const tableId = useMemo(() => customTableId ?? id, [customTableId, id])

  const caption = useMemo(() => tableId ? `${tableId}-caption` : undefined, [tableId]);

  return caption;
}


/**
 * 
 */
export interface UseIndeterminateCheckboxState {
  checked: boolean;
  indeterminate: boolean;
}

export interface UseIndeterminateCheckboxHook extends UseIndeterminateCheckboxState {
  handleCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleIndeterminateChange: () => void;
}

export function useIndeterminateCheckbox(): UseIndeterminateCheckboxHook {
  const [state, dispatch] = useReducer(
    (state: UseIndeterminateCheckboxState, action: { type: 'CHECKED'; payload: { checked: boolean } }
      | { type: 'INDETERMINATE' }) => {
      switch (action.type) {
        case 'CHECKED':
          return {
            ...state,
            checked: action.payload.checked,
            indeterminate: false,
          };
        case 'INDETERMINATE':
          return {
            ...state,
            checked: false,
            indeterminate: true,
          };
        default:
          return state;
      }
    }, {
    checked: false,
    indeterminate: false,
  });

  const handleCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    dispatch({ type: 'CHECKED', payload: { checked } });
  }, []);

  const handleIndeterminateChange = useCallback(() => {
    dispatch({ type: 'INDETERMINATE' });
  }, []);

  return {
    ...state,
    handleCheckboxChange,
    handleIndeterminateChange
  }
}

/**
 * 
 */
export interface UseSortingHook<Entity, RemoteData> {

}

export function useSorting<Entity = any, RemoteData = Entity[]>(): [
  ChudoTableContextType<Entity, RemoteData>['sorting'],
  ChudoTableContextType<Entity, RemoteData>['toggleColumnSort']
] {
  const { sorting, toggleColumnSort } = useChudoTableContext<Entity, RemoteData>();

  return [sorting, toggleColumnSort];
}

/**
 * 
 */
export interface UseColumnSortHook {
  sort: ChudoTableColumnSortDirection | undefined;
  toggleSort: () => void;
}

export function useColumnSort<Entity = any, RemoteData = Entity[]>(accessor: AccessorKey<Entity>): UseColumnSortHook {
  const [sorting, toggleColumnSort] = useSorting<Entity, RemoteData>();

  const sort = useMemo(() => get(sorting, [accessor]), [sorting])

  const toggleSort = useCallback(() => {
    toggleColumnSort(accessor)
  }, [accessor, toggleColumnSort])

  return {
    sort,
    toggleSort
  }
}

/**
 * 
 */
export interface UseTableComputedStylesHook {
  columnWidth: string[][];
}

export function useTableComputedStyles<Entity, RemoteData = Entity[]>(): UseTableComputedStylesHook {
  const { columns } = useChudoTableContext<Entity, RemoteData>();

  const columnWidth = useMemo(() => columns.map(({ minWidth, computedWidth, maxWidth }) => [
    widthToStyleValue(minWidth), widthToStyleValue(computedWidth ?? maxWidth)
  ]), [columns])

  return {
    columnWidth,
  }
}