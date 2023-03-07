import { useCallback, useContext, useEffect, useMemo } from 'react';
import { ChudoTableContext, TableColumnConfigInterface } from 'chudo-table';

export interface UseColumnsHookInterface {
  initialize: (columns: TableColumnConfigInterface[]) => void;
}

export const useColumns = (): UseColumnsHookInterface => {
  const { initalizeColumns } = useContext(ChudoTableContext);

  const initialize = useCallback(
    (columns: TableColumnConfigInterface[]) => initalizeColumns(columns),
    [initalizeColumns]
  );

  return {
    initialize,
  };
};
