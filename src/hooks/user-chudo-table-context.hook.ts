import { useContext } from 'react';
import { ChudoTableContext, ChudoTableContextInteface } from 'chudo-table';

export const useChudoTableContext = <T>(): ChudoTableContextInteface<T> => {
  const chudoTable = useContext<ChudoTableContextInteface<T>>(ChudoTableContext);

  // TODO: invariant

  return chudoTable;
};
