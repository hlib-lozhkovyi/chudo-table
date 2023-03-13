import { FunctionComponent, ElementType } from 'react';

export type ChudoTableColumnType = 'common' | 'select' | 'action';

export type AccessorKey<Record = any> = Extract<keyof Record, string>;

export type RecordID = string;

export interface ChudoTableColumnMetaConfig {
  resizable: boolean;
  width: number;
  minWidth?: number;
  maxWidth?: number;
}

export interface ChudoTableColumnConfig<Record, Key = AccessorKey<Record>> extends ChudoTableColumnMetaConfig {
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
  _id: RecordID;
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
  selectedIds: RecordID[];
}

export interface DataFetcherProps {
  page: ChudoTablePaginationState['currentPage'];
  pageSize?: ChudoTablePaginationState['pageSize'];
}

export interface DataFetcherParserResult<Record> {
  data: Record[];
  totalPages?: ChudoTablePaginationState['totalPages'];
  totalCount?: ChudoTablePaginationState['totalCount'];
}

export type ChudoTableAction<Record, RemoteData> =
  | { type: 'INITIALIZE_COLUMNS'; payload: { columns: ChudoTableColumn<Record>[] } }
  | { type: 'UPDATE_COLUMN'; payload: { accessor: AccessorKey<Record>; meta: ChudoTableColumnMetaConfig } }
  | { type: 'SET_ROWS'; payload: { rows: ChudoTableRow<Record>[] } }
  | {
      type: 'SET_REMOTE_DATA';
      payload: Omit<DataFetcherParserResult<Record>, 'data'> & {
        rows: ChudoTableRow<Record>[];
      };
    }
  | { type: 'SET_RESPONSE'; payload: { response: RemoteData } }
  | { type: 'SET_IS_LOADING' }
  | { type: 'SET_ERROR'; payload: { error: Error } }
  | { type: 'SET_CURRENT_PAGE'; payload: { currentPage: ChudoTablePaginationState['currentPage'] } }
  | { type: 'SET_TOTAL_PAGES'; payload: { totalPages: ChudoTablePaginationState['totalPages'] } }
  | { type: 'SET_PAGE_SIZE'; payload: { pageSize: ChudoTablePaginationState['pageSize'] } }
  | { type: 'SET_TOTAL_COUNT'; payload: { totalCount: ChudoTablePaginationState['totalCount'] } }
  | { type: 'TOGGLE_ALL_ROWS_SELECTION' }
  | { type: 'TOGGLE_ROW_SELECTION'; payload: { id: string } };

export interface ChudoTablePaginationHelpers {
  setCurrentPage: (currentPage: number) => void;
  setTotalPages: (totalPages: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotalCount: (totalCount: number) => void;
}

export interface ChudoTableHelpers<Record, RemoteData> extends ChudoTablePaginationHelpers {
  initializeColumns: (columns: ChudoTableState<Record, RemoteData>['columns']) => void;
  updateColumn: (accessor: AccessorKey<Record>, meta: Partial<ChudoTableColumnMetaConfig>) => void;
  getRowId: (data: Record) => RecordID;
  setIsLoading: (isLoading: ChudoTableState<Record, RemoteData>['isLoading']) => void;
  setError: (error: ChudoTableState<Record, RemoteData>['error']) => void;
  setRows: (rows: ChudoTableRow<Record>[]) => void;
  setRemoteData: (daata: DataFetcherParserResult<Record>) => void;
  toggleAllRowsSelection: () => void;
  toggleRowSelection: (id: RecordID) => void;
}

export interface ChudoTableMetaConfig {
  id?: string;
}

export interface ChudoTableConfig<Record, Key extends AccessorKey<Record> = AccessorKey<Record>>
  extends ChudoTableMetaConfig {
  idAccessor?: ((data: Record) => RecordID) | RecordID;
}

export type ChudoTableContextType<Record, RemoteData> = ChudoTableState<Record, RemoteData> &
  ChudoTableHelpers<Record, RemoteData> &
  ChudoTableConfig<Record>;

export interface TableStyleContextType {
  border?: boolean;
  rounded?: boolean;
  stripe?: boolean;
  rowBorder?: boolean;
  compact?: boolean;
  highlightRow?: boolean;
  highlightColumn?: boolean;
}
