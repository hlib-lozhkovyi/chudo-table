import { ChudoTable, ChudoTableProps, Item } from 'chudo-table';
import { DataSource, DataSourcePropsInterface } from 'data-source.component';
import { Table, TablePropsInterface } from 'table.component';
import { Columns, ColumnsPropsInterface } from 'columns.component';
import { Column, ColumnPropsInterface } from 'column.component';
import { FunctionComponent } from 'react';

interface UseChudoTableHookInterface<T extends Item> {
  ChudoTable: FunctionComponent<ChudoTableProps<T>>;
  DataSource: FunctionComponent<DataSourcePropsInterface<T>>;
  Table: FunctionComponent<TablePropsInterface<T>>;
  Columns: FunctionComponent<ColumnsPropsInterface<T>>;
  Column: FunctionComponent<ColumnPropsInterface<T>>;
}

export const useChudoTable = <T extends Item>(): UseChudoTableHookInterface<T> => {
  return {
    ChudoTable,
    DataSource,
    Table,
    Columns,
    Column,
  };
};
