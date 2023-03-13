import * as React from 'react';
import { ChudoTableContextType, TableStyleContextType } from './types';

export const ChudoTableContext = React.createContext<ChudoTableContextType<any, any>>(
  undefined as any
);
ChudoTableContext.displayName = 'ChudoTableContext';

export const ChudoTableProvider = ChudoTableContext.Provider;
export const ChudoTableConsumer = ChudoTableContext.Consumer;

export const TableStyleContext = React.createContext<TableStyleContextType>({});
TableStyleContext.displayName = 'TableStyleContext';

export const TableStyleProvider = TableStyleContext.Provider;
export const TableStyleConsumer = TableStyleContext.Consumer;