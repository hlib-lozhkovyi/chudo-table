import { ChudoTableApiContextInteface, Item } from 'chudo-table';
import { useChudoTableContext } from './user-chudo-table-context.hook';

export interface UseFetchData<T extends Item> {
  startFetching: ChudoTableApiContextInteface<T>['startFetching'];
  updateData: ChudoTableApiContextInteface<T>['updateData'];
  handleFetchError: ChudoTableApiContextInteface<T>['handleFetchError'];
}

export const useFetchData = <T extends Item>(): UseFetchData<T> => {
  const { startFetching, updateData, handleFetchError } = useChudoTableContext<T>();

  return {
    startFetching,
    updateData,
    handleFetchError,
  };
};
