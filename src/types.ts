import { FunctionComponent, ElementType } from 'react';

export type ChudoTableColumnType = 'common' | 'select' | 'action';

export type AccessorKey<Record = any> = Extract<keyof Record, string>;

export interface ChudoTableColumnConfig<Record, Key = AccessorKey<Record>> {
  type: ChudoTableColumnType;
  accessor: Key;
}

export interface ChudoTableColumn<Record, Key extends AccessorKey<Record> = AccessorKey<Record>>
  extends ChudoTableColumnConfig<Record> {
  Header: FunctionComponent<{}>;
  Wrapper: ElementType;
  Cell: FunctionComponent<{ value: Record[Key] } & Record>;
}

export type ChudoTableRow<Record, Key extends AccessorKey<Record> = AccessorKey<Record>> = Record & {
  id: any;
  getCellValue: (accessor: Key) => Record[Key];
};

export interface ChudoTablePaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export interface ChudoTableState<Record, RemoteData> extends ChudoTablePaginationState {
  isLoading: boolean;
  error: Error | null;
  response: RemoteData | null;
  columns: ChudoTableColumn<Record>[];
  rows: ChudoTableRow<Record>[];
}

export type ChudoTableAction<Record, RemoteData> =
  | { type: 'INITIALIZE_COLUMNS'; payload: { columns: ChudoTableColumn<Record>[] } }
  | { type: 'SET_ROWS'; payload: { rows: ChudoTableRow<Record>[] } }
  | { type: 'SET_RESPONSE'; payload: { response: RemoteData } }
  | { type: 'SET_IS_LOADING' }
  | { type: 'SET_ERROR'; payload: { error: Error } }
  | { type: 'SET_CURRENT_PAGE'; payload: { currentPage: ChudoTablePaginationState['currentPage'] } }
  | { type: 'SET_TOTAL_PAGES'; payload: { totalPages: ChudoTablePaginationState['totalPages'] } }
  | { type: 'SET_PAGE_SIZE'; payload: { pageSize: ChudoTablePaginationState['pageSize'] } }
  | { type: 'SET_TOTAL_COUNT'; payload: { totalCount: ChudoTablePaginationState['totalCount'] } };

export interface ChudoTablePaginationHelpers {
  setCurrentPage: (currentPage: number) => void;
  setTotalPages: (totalPages: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotalCount: (totalCount: number) => void;
}

export interface ChudoTableHelpers<Record, RemoteData = any> extends ChudoTablePaginationHelpers {
  initializeColumns: (columns: ChudoTableState<Record, RemoteData>['columns']) => void;
  getRowId: (data: Record) => string | number;
  setIsLoading: (isLoading: ChudoTableState<Record, RemoteData>['isLoading']) => void;
  setError: (error: ChudoTableState<Record, RemoteData>['error']) => void;
  setRows: (rows: ChudoTableRow<Record>[]) => void;
  setResponse: (response: RemoteData) => void;
}

export interface ChudoTableConfig<Record, Key extends AccessorKey<Record> = AccessorKey<Record>> {
  idAccessor?: ((data: Record) => string | number) | string;
}

export type ChudoTableContextType<Record, RemoteData> = ChudoTableState<Record, RemoteData> &
  ChudoTableHelpers<Record> &
  ChudoTableConfig<Record>;

export interface DataFetcherPropsInterface {
  page?: number;
}
