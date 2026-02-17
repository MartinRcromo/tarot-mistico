import { useAuthStore } from '@/store/authStore';

/** Hook de autenticación — expone estado y acciones del store */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const logout = useAuthStore((s) => s.logout);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    refreshProfile,
  };
}
