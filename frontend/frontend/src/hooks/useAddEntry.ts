import { useState } from 'react';
import axios from 'axios';
import type { WorkEntry } from './useWorkEntries';

export function useAddEntry(jwt: string, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEntry = async (entry: Omit<WorkEntry, 'id' | 'updated'>) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/entries', entry, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to add entry');
    } finally {
      setLoading(false);
    }
  };

  return { addEntry, loading, error };
} 