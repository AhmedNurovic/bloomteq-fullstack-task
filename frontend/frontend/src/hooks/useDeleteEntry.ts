import { useState } from 'react';
import axios from 'axios';

export function useDeleteEntry(jwt: string, onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEntry = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/entries/${id}`, {
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