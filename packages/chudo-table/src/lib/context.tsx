import { createContext } from 'react';
import { ChudoTableColumn, ChudoTableContextType, TableStyleContextType } from './types';

export const ChudoTableContext = createContext<ChudoTableContextType<any, any>>(
  undefined as any
);
ChudoTableContext.displayName = 'ChudoTableContext';

export const ChudoTableProvider = ChudoTableContext.Provider;
export const ChudoTableConsumer = ChudoTableContext.Consumer;

export const ChudoTableColumnContext = createContext<ChudoTableColumn<any>>(
  undefined as any
);
ChudoTableContext.displayName = 'ChudoTableColumnContext';

export const ChudoTableColumnProvider = ChudoTableColumnContext.Provider;
export const ChudoTableColumnConsumer = ChudoTableColumnContext.Consumer;

export const TableStyleContext = createContext<TableStyleContextType>({});
TableStyleContext.displayName = 'TableStyleContext';

export const TableStyleProvider = TableStyleContext.Provider;
export const TableStyleConsumer = TableStyleContext.Consumer;