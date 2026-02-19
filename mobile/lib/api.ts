import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '@/constants/theme';
import { getToken } from './storage';
import type {
  User,
  Session,
  Profile,
  DrawnCard,
  CreditsInfo,
  Reading,
  DailyQuote,
  ConsultationStatus,
  Consultation,
} from '@/types';

/** Crea la instancia de axios con baseURL e interceptor de auth */
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: agrega el token a cada request si existe
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Extrae un mensaje de error amigable */
function handleError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.error;
    if (message) throw new Error(message);
    if (err.code === 'ECONNABORTED') throw new Error('La conexión tardó demasiado. Intentá de nuevo.');
    if (!err.response) throw new Error('No se pudo conectar al servidor. Verificá tu conexión.');
    throw new Error('Ocurrió un error inesperado. Intentá de nuevo.');
  }
  throw err;
}

// ─── Auth ────────────────────────────────────────────

export async function signup(
  email: string,
  password: string,
  full_name: string
): Promise<{ user: User; session: Session }> {
  try {
    const { data } = await api.post('/api/auth/signup', { email, password, full_name });
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ user: User; session: Session }> {
  try {
    const { data } = await api.post('/api/auth/login', { email, password });
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post('/api/auth/logout');
  } catch (err) {
    console.error('API: Logout error', err);
    // No throw — always clear local session even if server fails
  }
}

// ─── User ────────────────────────────────────────────

export async function getProfile(): Promise<Profile> {
  try {
    const { data } = await api.get('/api/user/profile');
    return data.profile;
  } catch (err) {
    handleError(err);
  }
}

export async function getCredits(): Promise<CreditsInfo> {
  try {
    const { data } = await api.get('/api/user/credits');
    return data;
  } catch (err) {
    handleError(err);
  }
}

// ─── Readings ────────────────────────────────────────

export async function drawCards(
  spreadType: string,
  question?: string
): Promise<{ cards: DrawnCard[]; spreadType: string; credits_remaining: number | null }> {
  try {
    const { data } = await api.post('/api/draw', { spreadType, question });
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function getInterpretation(
  cards: DrawnCard[],
  spreadType: string,
  question?: string
): Promise<string> {
  try {
    const { data } = await api.post('/api/interpret', { cards, spreadType, question });
    return data.interpretation;
  } catch (err) {
    handleError(err);
  }
}

export async function getDailyQuote(): Promise<DailyQuote> {
  try {
    const { data } = await api.get('/api/quote');
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function getReadings(): Promise<Reading[]> {
  try {
    const { data } = await api.get('/api/user/readings');
    return data.readings;
  } catch (err) {
    handleError(err);
  }
}

// ─── Consultations ───────────────────────────────────

export async function getConsultationStatus(): Promise<ConsultationStatus> {
  try {
    const { data } = await api.get('/api/user/consultation-status');
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function getConsultations(): Promise<Consultation[]> {
  try {
    const { data } = await api.get('/api/consultations');
    return data.consultations;
  } catch (err) {
    handleError(err);
  }
}

export async function bookConsultation(params: {
  calendly_event_uri?: string;
  scheduled_at: string;
  google_meet_url?: string;
}): Promise<Consultation> {
  try {
    const { data } = await api.post('/api/consultations/book', params);
    return data.consultation;
  } catch (err) {
    handleError(err);
  }
}

export async function cancelConsultation(consultationId: string): Promise<void> {
  try {
    await api.post('/api/consultations/cancel', { consultation_id: consultationId });
  } catch (err) {
    handleError(err);
  }
}
