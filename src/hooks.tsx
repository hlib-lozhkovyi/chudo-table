import { useReducer, useMemo, Reducer, useCallback, useContext, Context, useState, ChangeEvent, useRef, useEffect } from 'react';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import { ChudoTableContext, TableStyleContext } from 'context';
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
  DataFetcherParserResultInterface,
  TableStyleContextType,
  RecordID,
  AccessorKey,
  ChudoTableColumnMetaConfig
} from "types";
import { generateRowId, getRowIndex, isAllRowsSelected } from 'utils';

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
export function useChudoTableContext<Record, RemoteData>() {
  const chudoTable = useContext<ChudoTableContextType<Record, RemoteData>>(
    ChudoTableContext as unknown as Context<ChudoTableContextType<Record, RemoteData>>,
  );

  return chudoTable;
}

/**
 * 
 */
export interface UseChudoTableHook<Record> extends ChudoTableConfig<Record> {

}

export function useChudoTable<Record = any, RemoteData = Record[]>(
  props: UseChudoTableHook<Record>
): ChudoTableContextType<Record, RemoteData> {
  const {
    idAccessor,
    id: tableId
  } = props

  const [state, dispatch] = useReducer<
    Reducer<ChudoTableState<Record, RemoteData>, ChudoTableAction<Record, RemoteData>>
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
    selectedIds: []
  });

  const getRowId = useCallback((data: Record): RecordID => {
    const id: string | number = isFunction(idAccessor)
      ? idAccessor(data)
      : get(data, [idAccessor as string]);

    return id as RecordID;
  }, [idAccessor])

  const createTableRowsFromData = useCallback((data: Record[]) => {
    return data.map((row, index) => ({
      id: getRowId(row) ?? generateRowId(tableId, state.currentPage, index),
      index: getRowIndex(state.currentPage, index),
      _raw: row,
    }))
  }, [tableId, state.currentPage, getRowId])

  const initializeColumns = useCallback((columns: ChudoTableColumn<Record>[]) => {
    dispatch({
      type: "INITIALIZE_COLUMNS",
      payload: {
        columns
      }
    })
  }, []);

  const updateColumn = useCallback((accessor: AccessorKey<Record>, meta: Partial<ChudoTableColumnMetaConfig>) => {
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

  const setRows = useCallback((data: Record[]) => {
    const rows = createTableRowsFromData(data);

    dispatch({
      type: "SET_ROWS",
      payload: {
        rows
      }
    });
  }, [createTableRowsFromData]);

  const setRemoteData = useCallback((remoteData: DataFetcherParserResultInterface<Record>) => {
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

  const helpers: ChudoTableHelpers<Record, RemoteData> = {
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
    toggleAllRowsSelection,
    toggleRowSelection
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
export function useTableLayoutContext() {
  const tableLayout = useContext<TableStyleContextType>(
    TableStyleContext as unknown as Context<TableStyleContextType>,
  );

  return tableLayout;
}

export interface UseTableMetaHook {
  id?: ChudoTableMetaConfig["id"];
}

export function useTableMeta<Record, RemoteData>(): UseTableMetaHook {
  const { id } = useChudoTableContext<Record, RemoteData>() ?? {};

  return {
    id
  }
}

/**
 * 
 */
export interface UseColumnsHook<Record, RemoteData> {
  initializeColumns: ChudoTableHelpers<Record, RemoteData>["initializeColumns"]
}

export function useColumns<Record, RemoteData = Record[]>(): UseColumnsHook<Record, RemoteData> {
  const { initializeColumns } = useChudoTableContext<Record, RemoteData>();

  return { initializeColumns }
}

/**
 * 
 */
export interface UseFetchDataHook<Record, RemoteData> {
  startFetching: () => void;
  stopFetching: () => void;
  setRemoteData: (data: DataFetcherParserResultInterface<Record>) => void;
  handleFetchError: (error: Error) => void;
}

export function useFetchData<Record = Object, RemoteData = Record[]>(): UseFetchDataHook<Record, RemoteData> {
  const { setIsLoading, setRemoteData, setError } = useChudoTableContext<Record, RemoteData>();

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
export interface UseResponseHook<Record, RemoteData> {
  response: ChudoTableContextType<Record, RemoteData>["response"];
}

export function useResponse<Record = any, RemoteData = Record[]>(): UseResponseHook<Record, RemoteData> {
  const { response } = useChudoTableContext<Record, RemoteData>()

  return { response }
}

/**
 * 
 */
export interface UseTableHook<Record, RemoteData> {
  totalCount: ChudoTableState<Record, RemoteData>['totalCount'];
  rows: ChudoTableState<Record, RemoteData>['rows'];
  columns: ChudoTableState<Record, RemoteData>['columns'];
}

export function useTable<Record = any, RemoteData = Record[]>(): UseTableHook<Record, RemoteData> {
  const { rows, columns, totalCount } = useChudoTableContext<Record, RemoteData>();

  return {
    totalCount,
    rows,
    columns
  }
}

/**
 * 
 */
export function useTableId<Record = any, RemoteData = Record[]>(): string | undefined {
  const { id } = useChudoTableContext<Record, RemoteData>();

  return id
}
/**
 * 
 */
export interface UseSetRowsHook<Record, RemoteData> {
  setRows: ChudoTableHelpers<Record, RemoteData>['setRows'];
}

export function useSetRows<Record = any, RemoteData = Record[]>(): UseSetRowsHook<Record, RemoteData> {
  const { setRows } = useChudoTableContext<Record, RemoteData>();

  return {
    setRows
  }
}

/**
 * 
 */
export interface UsePaginationHook<Record, RemoteData> extends ChudoTablePaginationState, ChudoTablePaginationHelpers {
  hasMorePages: boolean;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: () => void;
  prevPage: () => void;
}

export function usePagination<Record = any, RemoteData = Record[]>(): UsePaginationHook<Record, RemoteData> {
  const {
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    setCurrentPage,
    setTotalPages,
    setPageSize,
    setTotalCount,
  } = useChudoTableContext<Record, RemoteData>();

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
export interface UseRowSelectionHook<Record, RemoteData> {
  isSomeSelected: boolean;
  isAllSelected: boolean;
  selectedCount: number;
  selectedIds: RecordID[];
  toggleAllRowsSelection: ChudoTableHelpers<Record, RemoteData>["toggleAllRowsSelection"];
  toggleRowSelection: ChudoTableHelpers<Record, RemoteData>["toggleRowSelection"];
  isRowSelected: (id: RecordID) => boolean;
}

export function useRowSelection<Record = any, RemoteData = Record[]>(): UseRowSelectionHook<Record, RemoteData> {
  const { pageSize, selectedIds, toggleAllRowsSelection, toggleRowSelection } = useChudoTableContext<Record, RemoteData>();

  const selectedCount = useMemo(() => selectedIds?.length, [selectedIds])

  const isSomeSelected = useMemo(() => selectedCount > 0, [selectedCount])

  const isAllSelected = useMemo(() => isAllRowsSelected(selectedCount, pageSize), [selectedCount, pageSize])

  const isRowSelected = useCallback((id: RecordID) => selectedIds.includes(id), [selectedIds])

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
  Record = any, RemoteData = Record[]
>(accessor: AccessorKey<Record>): [ChudoTableColumn<Record>, (meta: Partial<ChudoTableColumnMetaConfig>) => void] {
  const { columns, updateColumn } = useChudoTableContext<Record, RemoteData>();

  const column = useMemo(() => columns.find((column) =>
    column.accessor === accessor
  ), [columns])

  const setColumnMeta = useCallback((meta: Partial<ChudoTableColumnMetaConfig>) => {
    updateColumn(accessor, meta)
  }, [updateColumn])

  return [column as ChudoTableColumn<Record>, setColumnMeta];
}

/**
 * 
 */

export function useColumnWidth<Record = any>(accessor: AccessorKey<Record>): [number, (width: number) => void] {
  const [column, updateColumn] = useColumn<Record>(accessor);
  const { width, minWidth = 0, maxWidth = Number.MAX_SAFE_INTEGER } = column;

  const setWidth = useCallback((nextWidth: number) => {
    if (nextWidth < minWidth || nextWidth > maxWidth) {
      return;
    }

    updateColumn({ width: nextWidth });
  }, [updateColumn, minWidth, maxWidth])

  return [width, setWidth];
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


export function useColumnResize<Record = any>(accessor: AccessorKey<Record>): UseColumnResizeHook {
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