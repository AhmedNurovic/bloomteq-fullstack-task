import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import type { CreateWorkEntry } from './useAddEntry';

export function useUpdateEntry(jwt: string, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateEntry = async (id: number, entry: Partial<CreateWorkEntry>) => {
    if (!jwt) {
      setError('No authentication token available');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await axios.put(API_ENDPOINTS.ENTRY(id), entry, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to update entry');
    } finally {
      setLoading(false);
    }
  };

  return { updateEntry, loading, error };
} 