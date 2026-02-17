import { create } from 'zustand';
import * as api from '@/lib/api';
import * as storage from '@/lib/storage';
import type { User, Profile } from '@/types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  /** Iniciar sesión con email y contraseña */
  login: async (email: string, password: string) => {
    const result = await api.login(email, password);
    const { user, session } = result;

    await storage.saveToken(session.access_token);
    if (session.refresh_token) {
      await storage.saveRefreshToken(session.refresh_token);
    }
    await storage.saveUser(user);

    set({ user, isAuthenticated: true });
    console.log('AuthStore: Logged in', user.id);

    // Cargar perfil en background
    get().refreshProfile();
  },

  /** Crear cuenta nueva */
  signup: async (email: string, password: string, fullName: string) => {
    const result = await api.signup(email, password, fullName);
    const { user, session } = result;

    if (session) {
      await storage.saveToken(session.access_token);
      if (session.refresh_token) {
        await storage.saveRefreshToken(session.refresh_token);
      }
      await storage.saveUser(user);
      set({ user, isAuthenticated: true });
      console.log('AuthStore: Signed up and logged in', user.id);
      get().refreshProfile();
    } else {
      // Supabase puede requerir confirmación de email
      set({ user, isAuthenticated: false });
      console.log('AuthStore: Signed up, awaiting email confirmation');
    }
  },

  /** Cerrar sesión */
  logout: async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('AuthStore: Server logout error', err);
    }
    await storage.clearSession();
    set({ user: null, profile: null, isAuthenticated: false });
    console.log('AuthStore: Logged out');
  },

  /** Verificar si hay sesión guardada al iniciar la app */
  checkSession: async () => {
    set({ isLoading: true });
    try {
      const token = await storage.getToken();
      if (!token) {
        console.log('AuthStore: No saved session');
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      // Verificar que el token sigue siendo válido obteniendo el perfil
      const profile = await api.getProfile();
      const savedUser = await storage.getUser<User>();

      set({
        user: savedUser || { id: profile.id, email: profile.email },
        profile,
        isAuthenticated: true,
        isLoading: false,
      });
      console.log('AuthStore: Session restored for', profile.email);
    } catch (err) {
      console.log('AuthStore: Saved session is invalid, clearing');
      await storage.clearSession();
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
    }
  },

  /** Refrescar el perfil del usuario */
  refreshProfile: async () => {
    try {
      const profile = await api.getProfile();
      set({ profile });
      console.log('AuthStore: Profile refreshed');
    } catch (err) {
      console.error('AuthStore: Failed to refresh profile', err);
    }
  },
}));
