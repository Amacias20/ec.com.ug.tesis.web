import { ToastError } from 'components/Messages/Toast';
import { ErrorHandler } from 'constants/Global';
import { useState, useCallback } from 'react';

export interface SearchParams {
  status?: string;
  PageSize?: number;
  [key: string]: any;
}

export type FetchDataFunction = (params: SearchParams) => Promise<any>;

const useSearch = (
  initialSearchParams: SearchParams, 
  fetchDataFunction: FetchDataFunction
) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const executeSearch = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    try {
      const queryParams: SearchParams = { ...params };

      if (queryParams.status === 'TODOS') {
        delete queryParams.status;
      }
      if (!queryParams.PageSize) {
        queryParams.PageSize = 1000;
      }

      const response = await fetchDataFunction(queryParams);
      const responseData = response.data.data || response;
      setData(responseData);
    } catch (error) {
      ToastError(await ErrorHandler(error));
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchDataFunction]);

  const handleSearch = useCallback(async () => {
    await executeSearch(initialSearchParams);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearchParams]);

  return {
    handleSearch,
    executeSearch,
    data,
    isLoading, 
  };
};

export default useSearch;