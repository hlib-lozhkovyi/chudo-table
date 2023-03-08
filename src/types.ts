import { FunctionComponent } from 'react';

export type ChudoTableColumnType = 'common' | 'select' | 'action';

export type AccessorKey<Record = any> = Extract<keyof Record, string>;

export interface ChudoTableColumnConfig<Record, Key = AccessorKey<Record>> {
  type: ChudoTableColumnType;
  accessor: Key;
}

export interface ChudoTableColumn<Record, Key extends AccessorKey<Record> = AccessorKey<Record>>
  extends ChudoTableColumnConfig<Record> {
  Header: FunctionComponent<{}>;
  Cell: FunctionComponent<{ value: Record[Key] } & Record>;
}

export type ChudoTableRow<Record, Key extends AccessorKey<Record> = AccessorKey<Record>> = Record & {
  id: any;
  getCellValue: (accessor: Key) => Record[Key];
};

export interface ChudoTableState<Record> {
  isLoading: boolean;
  error: Error | null;
  columns: ChudoTableColumn<Record>[];
  rows: ChudoTableRow<Record>[];
}

export type ChudoTableAction<Record> =
  | { type: 'INITIALIZE_COLUMNS'; payload: { columns: ChudoTableColumn<Record>[] } }
  | { type: 'SET_ROWS'; payload: { rows: ChudoTableRow<Record>[] } }
  | { type: 'SET_IS_LOADING' }
  | { type: 'SET_ERROR'; payload: { error: Error } };

export interface ChudoTableHelpers<Record> {
  initializeColumns: (columns: ChudoTableState<Record>['columns']) => void;
  getRowId: (data: Record) => string | number;
  setIsLoading: (isLoading: ChudoTableState<Record>['isLoading']) => void;
  setError: (error: ChudoTableState<Record>['error']) => void;
  setRows: (rows: ChudoTableRow<Record>[]) => void;
}

export interface ChudoTableConfig<Record, Key extends AccessorKey<Record> = AccessorKey<Record>> {
  idAccessor?: ((data: Record) => string | number) | string;
}

export type ChudoTableContextType<Record> = ChudoTableState<Record> &
  ChudoTableHelpers<Record> &
  ChudoTableConfig<Record>;
