import React, { useEffect } from 'react';
import { Item } from 'chudo-table';
import { useFetchData } from 'hooks/use-fetch-data.hook';
import { ReactNode } from 'react';

export interface DataSourcePropsInterface<T> {
  data?: T[];
  fetcher?: () => Promise<T[]>;
}

export const DataSource = <T extends Item>(props: DataSourcePropsInterface<T>) => {
  const { data, fetcher } = props;

  const { startFetching, updateData, handleFetchError } = useFetchData();

  const fetch = async () => {
    if (!fetcher) {
      return;
    }

    startFetching();

    try {
      const data = await fetcher();
      updateData(data)

    } catch (error) {
      handleFetchError(error)
    }
  }

  useEffect(function initializeWithDataSource() {
    if (!fetcher) {
      return;
    }

    fetch();
  }, [])

  useEffect(function initializeWithData() {
    if (!data) {
      return;
    }

    updateData(data)
  }, [data])

  return null;
};
