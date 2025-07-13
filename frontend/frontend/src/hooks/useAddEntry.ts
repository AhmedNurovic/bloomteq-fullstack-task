import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export interface CreateWorkEntry {
  date: string;
  hours: number;
  description: string;
  completed?: boolean;
}

export function useAddEntry(jwt: string, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEntry = async (entry: CreateWorkEntry) => {
    if (!jwt) {
      setError('No authentication token available');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await axios.post(API_ENDPOINTS.ENTRIES(), entry, {
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