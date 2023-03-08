import * as React from 'react';
import { ChudoTableContextType } from './types';

export const ChudoTableContext = React.createContext<ChudoTableContextType<any>>(
  undefined as any
);
ChudoTableContext.displayName = 'ChudoTableContext';

export const ChudoTableProvider = ChudoTableContext.Provider;
export const ChudoTableConsumer = ChudoTableContext.Consumer;