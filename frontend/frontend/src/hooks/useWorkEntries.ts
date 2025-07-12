import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface WorkEntry {
  id: number;
  project: string;
  hours: string;
  description: string;
  start: string;
  end: string;
  updated: string;
}

export interface WorkEntriesFilter {
  start?: string;
  end?: string;
  page?: number;
  pageSize?: number;
}

export function useWorkEntries(jwt: string, filter: WorkEntriesFilter) {
  const [data, setData] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { ...filter };
      const res = await axios.get('/api/entries', {
        params,
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setData(res.data.entries || []);
      setTotal(res.data.total || 0);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  }, [jwt, filter]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { data, loading, error, total, refetch: fetchEntries };
} 