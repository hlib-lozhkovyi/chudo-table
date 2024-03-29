import xor from 'lodash.xor';
import { ChudoTableAction, ChudoTableState } from './types';
import { getNextColumnSortValue } from './utils';

export const chudoTableReducer = <Record, RemoteData>(
  state: ChudoTableState<Record, RemoteData>,
  action: ChudoTableAction<Record, RemoteData>,
): ChudoTableState<Record, RemoteData> => {
  switch (action.type) {
    case 'INITIALIZE_COLUMNS':
      return { ...state, columns: action.payload.columns };
    case 'UPDATE_COLUMN':
      return {
        ...state,
        columns: state.columns.map((column) => {
          if (column.accessor === action.payload.accessor) {
            return {
              ...column,
              ...action.payload.meta,
            };
          }

          return { ...column };
        }),
      };
    case 'SET_RESPONSE':
      return { ...state, response: action.payload.response };
    case 'SET_ROWS':
      return {
        ...state,
        isLoading: false,
        error: null,
        rows: action.payload.rows,
        totalPages: 1,
        totalCount: action.payload.rows.length,
      };
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
    case 'TOGGLE_COLUMN_SORT':
      return {
        ...state,
        sorting: {
          ...state.sorting,
          [action.payload.accessor]: getNextColumnSortValue(state.sorting[action.payload.accessor]),
        },
      };
    case 'TOGGLE_ALL_ROWS_SELECTION':
      return {
        ...state,
        selectedIds: state.selectedIds.length > 0 ? [] : state.rows.map(({ id }) => id),
      };
    case 'TOGGLE_ROW_SELECTION':
      return { ...state, selectedIds: xor(state.selectedIds, [action.payload.id]) };
    default:
      return state;
  }
};
