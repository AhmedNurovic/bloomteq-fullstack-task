import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import type { AxiosError } from 'axios';

type ErrorResponse = { error?: string; message?: string };

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
        setError('Failed to delete entry');
      }
    } finally {
      setLoading(false);
    }
  };

  return { deleteEntry, loading, error };
} 