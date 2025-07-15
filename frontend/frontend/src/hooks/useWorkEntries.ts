import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import type { AxiosError } from 'axios';

type ErrorResponse = { error?: string; message?: string };

export interface WorkEntry {
  id: number;
  date: string;
  hours: number;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkEntriesFilter {
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}

export function useWorkEntries(jwt: string, filter: WorkEntriesFilter) {
  const [data, setData] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<Record<string, unknown> | null>(null);

  // Memoize the filter to prevent unnecessary re-renders
  const memoizedFilter = useMemo(() => filter, [filter]);

  const fetchEntries = useCallback(async () => {
    if (!jwt) return; // Don't fetch if no JWT
    
    setLoading(true);
    setError(null);
    try {
      const params: WorkEntriesFilter = { ...memoizedFilter };
      const res = await axios.get(API_ENDPOINTS.ENTRIES(), {
        params,
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setData(res.data.work_entries || []);
      setTotal(res.data.pagination?.total || 0);
      setPagination(res.data.pagination || null);
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
        setError('Failed to fetch entries');
      }
    } finally {
      setLoading(false);
    }
  }, [jwt, memoizedFilter]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { data, loading, error, total, pagination, refetch: fetchEntries };
} 