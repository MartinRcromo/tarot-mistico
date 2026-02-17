import { useState, useCallback } from 'react';
import * as api from '@/lib/api';
import type { Reading } from '@/types';

/** Hook para manejar el historial de lecturas */
export function useReadings() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReadings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getReadings();
      setReadings(data);
      console.log('useReadings: Fetched', data.length, 'readings');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar lecturas';
      setError(message);
      console.error('useReadings: Error fetching', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    readings,
    isLoading,
    error,
    fetchReadings,
  };
}
