import { useReducer, Reducer, useCallback, useContext, Context } from 'react';
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
  ChudoTableColumn
} from "types";

/**
 * 
 */
export function useChudoTableContext<Record = any,>() {
  const chudoTable = useContext<ChudoTableContextType<Record>>(
    ChudoTableContext as unknown as Context<ChudoTableContextType<Record>>,
  );

  return chudoTable;
}

/**
 * 
 */
export interface UseChudoTableHook<Record> extends ChudoTableConfig<Record> {

}

export function useChudoTable<Record = any,>(props: UseChudoTableHook<Record>): ChudoTableContextType<Record> {
  const {
    idAccessor
  } = props

  const [state, dispatch] = useReducer<
    Reducer<ChudoTableState<Record>, ChudoTableAction<Record>>
  >(chudoTableReducer, {
    isLoading: false,
    error: null,
    columns: [],
    rows: []
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


  const helpers: ChudoTableHelpers<Record> = {
    initializeColumns,
    getRowId,
    setIsLoading,
    setError,
    setRows
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
export interface UseFetchDataHook<Record = any> {
  startFetching: any;
  setData: any;
  handleFetchError: any;
}

export function useFetchData<Record = Object,>(): UseFetchDataHook<Record> {
  const { setIsLoading, setRows, getRowId } = useChudoTableContext<Record>();

  const startFetching = useCallback(() => setIsLoading(true), [setIsLoading]);

  const setData = useCallback((data: Record[]) => {
    const rows: ChudoTableRow<Record>[] = data.map((_row, index) => {
      const data = { id: getRowId(_row) ?? index, ..._row }

      return ({
        ...data,
        getCellValue: function (key) {
          return get(data, [key])
        }
      })
    })

    setRows(rows)
    setIsLoading(false);
  }, [setRows, getRowId]);

  const handleFetchError = useCallback(() => { }, []);


  return {
    startFetching,
    setData,
    handleFetchError,
  };
};

/**
 * 
 */
export interface UseTableHook<Record = any> {
  rows: ChudoTableState<Record>['rows'];
  columns: ChudoTableState<Record>['columns'];
}

export function useTable<Record = any,>(): UseTableHook<Record> {
  const { rows, columns } = useChudoTableContext<Record>();

  return {
    rows,
    columns
  }
}