import { useReducer, useMemo, Reducer, useCallback, useContext, Context } from 'react';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import { ChudoTableContext } from 'context';
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
  ChudoTablePaginationHelpers
} from "types";

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
    idAccessor
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
    totalCount: 0
  });

  const initializeColumns = useCallback((columns: ChudoTableColumn<Record>[]) => {
    dispatch({
      type: "INITIALIZE_COLUMNS",
      payload: {
        columns
      }
    })
  }, []);

  const getRowId = useCallback((data: Record): string | number => {
    const id: string | number = isFunction(idAccessor)
      ? idAccessor(data)
      : get(data, [idAccessor as string]);

    return id;
  }, [idAccessor])

  const setIsLoading = useCallback(() => {
    return;
  }, []);

  const setError = useCallback(() => {
    return;
  }, []);

  const setRows = useCallback((rows: ChudoTableRow<Record>[]) => {
    dispatch({
      type: "SET_ROWS",
      payload: {
        rows
      }
    });
  }, []);

  const setResponse = useCallback((response: RemoteData) => {
    dispatch({
      type: "SET_RESPONSE",
      payload: {
        response
      }
    });
  }, []);

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

  const helpers: ChudoTableHelpers<Record, RemoteData> = {
    initializeColumns,
    getRowId,
    setIsLoading,
    setError,
    setRows,
    setResponse,
    setCurrentPage,
    setTotalPages,
    setPageSize,
    setTotalCount,
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
export interface UseColumnsHook<Record> {
  initializeColumns: ChudoTableHelpers<Record>["initializeColumns"]
}

export function useColumns<Record = any,>(): UseColumnsHook<Record> {
  const { initializeColumns } = useChudoTableContext<Record>();

  return { initializeColumns }
}

/**
 * 
 */
export interface UseFetchDataHook<Record, RemoteData> {
  startFetching: () => void;
  stopFetching: () => void;
  setResponse: (response: RemoteData) => void;
  handleFetchError: (error: Error) => void;
}

export function useFetchData<Record = Object, RemoteData = Record[]>(): UseFetchDataHook<Record, RemoteData> {
  const { setIsLoading, setResponse, setError } = useChudoTableContext<Record, RemoteData>();

  const startFetching = useCallback(() => setIsLoading(true), [setIsLoading]);

  const stopFetching = useCallback(() => setIsLoading(false), [setIsLoading]);

  const handleFetchError = useCallback((error: Error) => {
    stopFetching();
    setError(error)
  }, [stopFetching, setError])

  return {
    startFetching,
    stopFetching,
    setResponse,
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
  rows: ChudoTableState<Record, RemoteData>['rows'];
  columns: ChudoTableState<Record, RemoteData>['columns'];
}

export function useTable<Record = any, RemoteData = Record[]>(): UseTableHook<Record, RemoteData> {
  const { rows, columns, response } = useChudoTableContext<Record, RemoteData>();

  return {
    rows,
    columns
  }
}

/**
 * 
 */
export interface UseSetRowsHook<Record, RemoteData> {
  setRows: (data: Record[]) => void;
}

export function useSetRows<Record = any, RemoteData = Record[]>(): UseSetRowsHook<Record, RemoteData> {
  const { getRowId, setRows: setTableRaws, currentPage } = useChudoTableContext<Record, RemoteData>();

  const setRows = useCallback((data: Record[]) => {
    const rows: ChudoTableRow<Record>[] = data.map((_row, index) => {
      const data = { id: getRowId(_row) ?? currentPage + index, ..._row }

      return ({
        ...data,
        getCellValue: function (key) {
          return get(data, [key])
        }
      })
    })

    setTableRaws(rows)
  }, [getRowId, setTableRaws, currentPage])

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