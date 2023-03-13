import { ChudoTableAction, ChudoTableState } from 'types';
import { isAllRowsSelected } from 'utils';
import xor from 'lodash/xor';

export const chudoTableReducer = <Record, RemoteData>(
  state: ChudoTableState<Record, RemoteData>,
  action: ChudoTableAction<Record, RemoteData>,
): ChudoTableState<Record, RemoteData> => {
  switch (action.type) {
    case 'INITIALIZE_COLUMNS':
      return { ...state, columns: action.payload.columns };
    case 'SET_RESPONSE':
      return { ...state, response: action.payload.response };
    case 'SET_ROWS':
      return { ...state, isLoading: false, error: null, rows: action.payload.rows };
    case 'SET_REMOTE_DATA':
      return {
        ...state,
        isLoading: false,
        error: null,
        rows: action.payload.rows,
        totalPages: action.payload.totalPages ?? state.totalPages,
        totalCount: action.payload.totalCount ?? state.totalCount,
      };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: true };
    case 'SET_ERROR':
      return { ...state, error: action.payload.error };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload.currentPage };
    case 'SET_TOTAL_PAGES':
      return { ...state, totalPages: action.payload.totalPages };
    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.payload.pageSize };
    case 'SET_TOTAL_COUNT':
      return { ...state, totalCount: action.payload.totalCount };
    case 'TOGGLE_ALL_ROWS_SELECTION':
      return {
        ...state,
        selectedIds: state.selectedIds.length > 0 ? [] : state.rows.map(({ _id }) => _id),
      };
    case 'TOGGLE_ROW_SELECTION':
      return { ...state, selectedIds: xor(state.selectedIds, [action.payload.id]) };
    default:
      return state;
  }
};
