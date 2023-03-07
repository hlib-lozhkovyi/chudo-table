import React, { ElementType, Provider, ReactNode, Reducer, ReducerWithoutAction, createContext, useEffect, useMemo, useReducer } from 'react';
import { WrapperPropsInterface, Wrapper as DefaultWrapper } from 'components';

import './table.css'

export interface Item {
  id: string;
}

export interface ChudoTableColumnInterface<T extends Item> {
  accessor: Extract<keyof T, string>;
  renderHeader: () => ReactNode,
  renderCell: <K extends keyof T>(value: T[K], row: T) => ReactNode;
}

export interface ChudoTableRowInterface<T extends Item, K extends keyof T = keyof T> {
  id: string;
  _raw: T;
  getValue: (key: K) => T[K];
}

export interface ChudoTableDataContextInteface<T extends Item> {
  id?: string | null;
  columns: ChudoTableColumnInterface<T>[];
  error: Error | null;
  isLoading: boolean;
  data: T[];
}

export interface ChudoTableApiContextInteface<T extends Item> {
  initalizeColumns: (columns: ChudoTableColumnInterface<T>[]) => void,
  updateData: (data: T[]) => void;
  startFetching: () => void,
  handleFetchError: (error: Error) => void
}

export interface ChudoTableContextInteface<T extends Item> extends ChudoTableDataContextInteface<T>,
  ChudoTableApiContextInteface<T> { }

export interface ChudoTableProps<T extends Item,> {
  children: ReactNode;
  Wrapper?: ElementType<WrapperPropsInterface>;
  wrapperProps?: Partial<WrapperPropsInterface>;
}

const initialDataState = {
  id: null,
  columns: [],
  data: [],
  error: null,
  isLoading: false,
}

const initalApiState: ChudoTableApiContextInteface<Item> = {
  initalizeColumns: () => { },
  updateData: () => { },
  startFetching: () => { },
  handleFetchError: (error) => { },
}

const intialState: ChudoTableContextInteface<Item> = {
  ...initialDataState,
  ...initalApiState
}

export const ChudoTableContext = createContext<ChudoTableContextInteface<any>>(intialState);

type InitializeColumnsAction<T> = { type: 'initializeColumns', payload: { columns: ChudoTableColumnInterface<T>[] } }
type UpdateDataAction<T> = { type: 'updateData', payload: { data: T[] } }
type DataLoadingAction = { type: 'dataLoading' }
type DataLoadingFailedAction = { type: 'dataLoadingFailed' }

type TableAction<T> =
  InitializeColumnsAction<T> |
  UpdateDataAction<T> |
  DataLoadingAction |
  DataLoadingFailedAction

type ChudoTableReducer<T extends Item> = Reducer<
  ChudoTableDataContextInteface<T>,
  TableAction<T>
>

const tableReducer = <T extends Item,>(state: ChudoTableDataContextInteface<T>, action: TableAction<T>): ChudoTableDataContextInteface<T> => {
  switch (action.type) {
    case 'initializeColumns':
      return { ...state, columns: action.payload.columns }
    case 'updateData':
      return { ...state, isLoading: false, error: null, data: action.payload.data }
    case 'dataLoading':
      return { ...state, isLoading: true };
    case 'dataLoadingFailed':
      return { ...state, data: [] };
    default:
      return state
  }
}

export const ChudoTable = <T extends Item>(props: ChudoTableProps<T>) => {
  const {
    children,
    Wrapper = DefaultWrapper,
    wrapperProps
  } = props;

  const [state, dispatch] = useReducer<ChudoTableReducer<T>>(
    tableReducer,
    initialDataState as ChudoTableDataContextInteface<T>
  );

  const initalizeColumns = (columns: ChudoTableColumnInterface<T>[]): void => {
    dispatch({ type: 'initializeColumns', payload: { columns } })
  }

  const startFetching = (): void => dispatch({ type: 'dataLoading' });

  const handleFetchError = (): void => dispatch({ type: 'dataLoadingFailed' });

  const updateData = (data: T[]): void => dispatch({ type: 'updateData', payload: { data } })

  const value = useMemo<ChudoTableContextInteface<T>>(() => ({
    ...state,
    initalizeColumns,
    updateData,
    startFetching,
    handleFetchError
  }), [state, initalizeColumns, updateData])

  const ChudoProvider = (ChudoTableContext.Provider as unknown) as Provider<ChudoTableContextInteface<T>>

  return (
    <ChudoProvider value={value}>
      <Wrapper {...wrapperProps}>
        {children}
      </Wrapper>
    </ChudoProvider>
  )
};