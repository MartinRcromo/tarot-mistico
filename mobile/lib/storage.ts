import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

/** Guarda el token de acceso de forma segura */
export async function saveToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (err) {
    console.error('Storage: Error saving token', err);
  }
}

/** Lee el token de acceso guardado */
export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (err) {
    console.error('Storage: Error reading token', err);
    return null;
  }
}

/** Borra el token de acceso */
export async function removeToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (err) {
    console.error('Storage: Error removing token', err);
  }
}

/** Guarda el refresh token */
export async function saveRefreshToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (err) {
    console.error('Storage: Error saving refresh token', err);
  }
}

/** Lee el refresh token */
export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (err) {
    console.error('Storage: Error reading refresh token', err);
    return null;
  }
}

/** Guarda datos del usuario como JSON */
export async function saveUser(user: object): Promise<void> {
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Storage: Error saving user', err);
  }
}

/** Lee los datos del usuario */
export async function getUser<T = object>(): Promise<T | null> {
  try {
    const data = await SecureStore.getItemAsync(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Storage: Error reading user', err);
    return null;
  }
}

/** Borra todos los datos de sesión */
export async function clearSession(): Promise<void> {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  } catch (err) {
    console.error('Storage: Error clearing session', err);
  }
}
