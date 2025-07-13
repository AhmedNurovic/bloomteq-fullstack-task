import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export function useDeleteEntry(jwt: string, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEntry = async (id: number) => {
    if (!jwt) {
      setError('No authentication token available');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await axios.delete(API_ENDPOINTS.ENTRY(id), {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to delete entry');
    } finally {
      setLoading(false);
    }
  };

  return { deleteEntry, loading, error };
} 