import { useMemo } from 'react';
import get from 'lodash/get';
import { ChudoTableColumnInterface, ChudoTableRowInterface, Item } from 'chudo-table';
import { useChudoTableContext } from 'hooks/user-chudo-table-context.hook';

export interface UseTableHookInterface<T extends Item> {
  rows: ChudoTableRowInterface<T>[];
  columns: ChudoTableColumnInterface<T>[];
}

export const useTable = <T extends Item>(): UseTableHookInterface<T> => {
  const state = useChudoTableContext<T>();

  const columns = useMemo(() => state.columns.map((column) => column), [state.columns]);

  const rows = useMemo(
    () =>
      state.data.map((_raw, index) => ({
        id: _raw.id ?? index,
        _raw,
        getValue: (key: keyof T) => get(_raw, key),
      })),
    [state.data]
  );

  return {
    rows,
    columns,
  };
};
