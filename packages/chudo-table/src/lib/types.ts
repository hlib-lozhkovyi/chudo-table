import { FunctionComponent, ReactNode } from 'react';

export type AccessorKey<Entity = any> = Extract<keyof Entity, string>;

export type EntityID = string;

export type ChudoTableColumnType = 'common' | 'select' | 'action';

export type ChudoTableColumnAlignment = 'left' | 'center' | 'right';

export type ChudoTableColumnWidth = number | 'min-content' | 'max-content';

export interface ChudoTableColumnMetaConfig {
  resizable: boolean;
  computedWidth: number;
  width: number;
  minWidth: ChudoTableColumnWidth;
  maxWidth: ChudoTableColumnWidth;
  sortable: boolean;
  alignment: ChudoTableColumnAlignment;
}

export interface ChudoTableColumnConfig<Entity, Key = AccessorKey<Entity>> extends ChudoTableColumnMetaConfig {
  type: ChudoTableColumnType;
  accessor: Key;
}

export interface ChudoTableColumn<Entity, Key extends AccessorKey<Entity> = AccessorKey<Entity>>
  extends ChudoTableColumnConfig<Entity> {
  Header: FunctionComponent<{}>;
  HeaderWrapper: FunctionComponent<{ accessor?: Key; children: ReactNode }>;
  Wrapper: FunctionComponent<{ children: ReactNode }>;
  Cell: FunctionComponent<{ value: unknown } & Entity>;
}

export type ChudoTableRow<Entity> = {
  id: EntityID;
  index: number;
  _raw: Entity;
};

export interface ChudoTablePaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export type ChudoTableColumnSortDirection = 'ascending' | 'desceding';

export type ChudotTableSortState<Entity, Key extends AccessorKey<Entity> = AccessorKey<Entity>> = Record<
  Key,
  ChudoTableColumnSortDirection
>;

export interface ChudoTableState<Entity, RemoteData> extends ChudoTablePaginationState {
  isLoading: boolean;
  error: Error | null;
  response: RemoteData | null;
  columns: ChudoTableColumn<Entity>[];
  rows: ChudoTableRow<Entity>[];
  selectedIds: EntityID[];
  sorting: ChudotTableSortState<Entity>;
}

export interface TableStyleContextType {
  fixed?: boolean;
  border?: boolean;
  rounded?: boolean;
  stripe?: boolean;
  rowBorder?: boolean;
  columnBorder?: boolean;
  compact?: boolean;
  highlightRow?: boolean;
}

export interface DataFetcherProps<Entity> {
  page: ChudoTablePaginationState['currentPage'];
  pageSize: ChudoTablePaginationState['pageSize'];
  limit: number;
  offset: number;
  sorting: ChudotTableSortState<Entity>;
}

export interface DataFetcherParserResult<Entity> {
  data: Entity[];
  totalPages?: ChudoTablePaginationState['totalPages'];
  totalCount?: ChudoTablePaginationState['totalCount'];
}

export type ChudoTableAction<Entity, RemoteData> =
  | { type: 'INITIALIZE_COLUMNS'; payload: { columns: ChudoTableColumn<Entity>[] } }
  | { type: 'UPDATE_COLUMN'; payload: { accessor: AccessorKey<Entity>; meta: Partial<ChudoTableColumnMetaConfig> } }
  | { type: 'SET_ROWS'; payload: { rows: ChudoTableRow<Entity>[] } }
  | {
      type: 'SET_REMOTE_DATA';
      payload: Omit<DataFetcherParserResult<Entity>, 'data'> & {
        rows: ChudoTableRow<Entity>[];
      };
    }
  | { type: 'SET_RESPONSE'; payload: { response: RemoteData } }
  | { type: 'SET_IS_LOADING' }
  | { type: 'SET_ERROR'; payload: { error: Error } }
  | { type: 'SET_CURRENT_PAGE'; payload: { currentPage: ChudoTablePaginationState['currentPage'] } }
  | { type: 'SET_TOTAL_PAGES'; payload: { totalPages: ChudoTablePaginationState['totalPages'] } }
  | { type: 'SET_PAGE_SIZE'; payload: { pageSize: ChudoTablePaginationState['pageSize'] } }
  | { type: 'SET_TOTAL_COUNT'; payload: { totalCount: ChudoTablePaginationState['totalCount'] } }
  | { type: 'TOGGLE_COLUMN_SORT'; payload: { accessor: AccessorKey<Entity> } }
  | { type: 'TOGGLE_ALL_ROWS_SELECTION' }
  | { type: 'TOGGLE_ROW_SELECTION'; payload: { id: string } };

export interface ChudoTablePaginationHelpers {
  setCurrentPage: (currentPage: number) => void;
  setTotalPages: (totalPages: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotalCount: (totalCount: number) => void;
}

export interface ChudoTableHelpers<Entity, RemoteData> extends ChudoTablePaginationHelpers {
  initializeColumns: (columns: ChudoTableState<Entity, RemoteData>['columns']) => void;
  updateColumn: (accessor: AccessorKey<Entity>, meta: Partial<ChudoTableColumnMetaConfig>) => void;
  getRowId: (data: Entity) => EntityID;
  setIsLoading: (isLoading: ChudoTableState<Entity, RemoteData>['isLoading']) => void;
  setError: (error: ChudoTableState<Entity, RemoteData>['error']) => void;
  setRows: (rows: Entity[]) => void;
  setRemoteData: (data: DataFetcherParserResult<Entity>) => void;
  toggleColumnSort: (accessor: AccessorKey<Entity>) => void;
  toggleAllRowsSelection: () => void;
  toggleRowSelection: (id: EntityID) => void;
}

export interface ChudoTableMetaConfig {
  id?: string;
}

export interface ChudoTableConfig<Entity, Key extends AccessorKey<Entity> = AccessorKey<Entity>>
  extends ChudoTableMetaConfig {
  idAccessor?: ((data: Entity) => EntityID) | EntityID;
}

export type ChudoTableContextType<Entity, RemoteData> = ChudoTableState<Entity, RemoteData> &
  ChudoTableHelpers<Entity, RemoteData> &
  ChudoTableConfig<Entity>;
