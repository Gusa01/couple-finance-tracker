import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { getAccessToken, supabase } from './supabase';
import { Messages } from '@/constants/messages';

const baseURL = Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, sign out
      await supabase.auth.signOut();
      return Promise.reject(new Error(Messages.errors.sessionExpired));
    }

    if (error.response?.status === 403) {
      return Promise.reject(new Error(Messages.errors.unauthorized));
    }

    if (!error.response) {
      return Promise.reject(new Error(Messages.errors.network));
    }

    const message = (error.response.data as { message?: string })?.message ||
      Messages.errors.generic;
    return Promise.reject(new Error(message));
  }
);

export async function validateSession(): Promise<{
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
} | null> {
  try {
    const response = await api.post('/auth/validate');
    return response.data;
  } catch {
    return null;
  }
}
