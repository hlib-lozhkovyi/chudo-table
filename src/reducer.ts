import { ChudoTableAction, ChudoTableState } from 'types';

export const chudoTableReducer = <Record>(
  state: ChudoTableState<Record>,
  action: ChudoTableAction<Record>,
): ChudoTableState<Record> => {
  switch (action.type) {
    case 'INITIALIZE_COLUMNS':
      return { ...state, columns: action.payload.columns };
    case 'SET_ROWS':
      return { ...state, isLoading: false, error: null, rows: action.payload.rows };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: true };
    case 'SET_ERROR':
      return { ...state, error: action.payload.error };
    default:
      return state;
  }
};
