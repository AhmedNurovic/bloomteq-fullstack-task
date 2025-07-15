import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import type { AxiosError } from 'axios';

type ErrorResponse = { error?: string; message?: string };

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
        setError('Failed to add entry');
      }
    } finally {
      setLoading(false);
    }
  };

  return { addEntry, loading, error };
} 