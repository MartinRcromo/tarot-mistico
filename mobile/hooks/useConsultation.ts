import { useState, useCallback } from 'react';
import * as api from '@/lib/api';
import type { ConsultationStatus, Consultation } from '@/types';

/** Hook para manejar el sistema de consultas Pro */
export function useConsultation() {
  const [status, setStatus] = useState<ConsultationStatus | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Obtener estado de consulta semanal */
  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getConsultationStatus();
      setStatus(data);
      console.log('useConsultation: Status fetched', data.isPro, 'used:', data.weeklyConsultationUsed);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar estado de consulta';
      setError(message);
      console.error('useConsultation: fetchStatus error', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Obtener historial de consultas */
  const fetchConsultations = useCallback(async () => {
    try {
      const data = await api.getConsultations();
      setConsultations(data);
      console.log('useConsultation: Fetched', data.length, 'consultations');
    } catch (err) {
      console.error('useConsultation: fetchConsultations error', err);
    }
  }, []);

  /** Agendar una nueva consulta */
  const bookConsultation = useCallback(async (params: {
    calendly_event_uri?: string;
    scheduled_at: string;
    google_meet_url?: string;
  }) => {
    setError(null);
    try {
      const consultation = await api.bookConsultation(params);
      // Refrescar estado y lista
      await Promise.all([fetchStatus(), fetchConsultations()]);
      return consultation;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al agendar consulta';
      setError(message);
      throw err;
    }
  }, [fetchStatus, fetchConsultations]);

  /** Cancelar una consulta */
  const cancelConsultation = useCallback(async (consultationId: string) => {
    setError(null);
    try {
      await api.cancelConsultation(consultationId);
      // Refrescar estado y lista
      await Promise.all([fetchStatus(), fetchConsultations()]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cancelar consulta';
      setError(message);
      throw err;
    }
  }, [fetchStatus, fetchConsultations]);

  return {
    status,
    consultations,
    isLoading,
    error,
    fetchStatus,
    fetchConsultations,
    bookConsultation,
    cancelConsultation,
  };
}
