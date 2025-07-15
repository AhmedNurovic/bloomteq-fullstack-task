import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import type { AxiosError } from 'axios';

type ErrorResponse = { error?: string; message?: string };

export interface WorkStatistics {
  today_hours: number;
  last_week_hours: number;
  last_week_tasks: number;
}

export function useStatistics(jwt: string) {
  const [data, setData] = useState<WorkStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    if (!jwt) return; // Don't fetch if no JWT
    
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_ENDPOINTS.STATISTICS(), {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setData(res.data);
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'isAxiosError' in err &&
        (err as AxiosError).isAxiosError &&
        typeof (err as AxiosError<ErrorResponse>).response?.data?.error === 'string'
      ) {
        setError((err as AxiosError<ErrorResponse>).response?.data?.error as string);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch statistics');
      }
    } finally {
      setLoading(false);
    }
  }, [jwt]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return { data, loading, error, refetch: fetchStatistics };
}