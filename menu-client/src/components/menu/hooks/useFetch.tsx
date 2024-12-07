import { useCallback, useEffect, useState } from "react";

const cache = new Map<string, unknown>();

/*
  We could use react query here but setting up the queryClient for every menu is not ideal if the user
  already has a queryClient setup somewhere above the menu component.
  We could however use swr instead, but this useFetch is simple and works well for our use case.
*/

type UseFetchParams = {
  enabled?: boolean;
};

export function useFetch<T>(url: string, options: UseFetchParams = {}) {
  const [data, setData] = useState<T | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (cache.has(url)) {
      setData(cache.get(url) as T);
      return;
    }

    try {
      setIsFetching(true);
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
      cache.set(url, data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsFetching(false);
    }
  }, [url]);

  useEffect(() => {
    if (options.enabled) {
      fetchData();
    }
  }, [fetchData, options.enabled]);

  return { data, isFetching, fetchData, error };
}
