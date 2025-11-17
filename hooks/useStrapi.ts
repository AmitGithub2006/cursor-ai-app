import { useEffect, useState } from 'react';
import type { StrapiResponse } from '@/lib/strapi/strapiClient';
import { strapiFetch } from '@/lib/strapi/strapiClient';

export function useStrapi<T>(path: string | null, params?: Record<string, string | number | undefined>) {
  const [data, setData] = useState<StrapiResponse<T> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!path) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const result = await strapiFetch<StrapiResponse<T>>(path, { params: { populate: '*', ...params } });
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [path, JSON.stringify(params)]);

  return { data, loading, error };
}
