import * as React from 'react';
import { ChudoTableColumn, ChudoTableContextType, TableStyleContextType } from './types';

export const ChudoTableContext = React.createContext<ChudoTableContextType<any, any>>(
  undefined as any
);
ChudoTableContext.displayName = 'ChudoTableContext';

export const ChudoTableProvider = ChudoTableContext.Provider;
export const ChudoTableConsumer = ChudoTableContext.Consumer;

export const ChudoTableColumnContext = React.createContext<ChudoTableColumn<any>>(
  undefined as any
);
ChudoTableContext.displayName = 'ChudoTableColumnContext';

export const ChudoTableColumnProvider = ChudoTableColumnContext.Provider;
export const ChudoTableColumnConsumer = ChudoTableColumnContext.Consumer;

export const TableStyleContext = React.createContext<TableStyleContextType>({});
TableStyleContext.displayName = 'TableStyleContext';

export const TableStyleProvider = TableStyleContext.Provider;
export const TableStyleConsumer = TableStyleContext.Consumer;