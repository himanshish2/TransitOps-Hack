import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';
import { getStorageString, removeStorageItem } from '../utils/storageUtils';

// VITE_API_BASE_URL already includes "/api" (e.g. http://localhost:5000/api).
// Service files therefore call relative paths like "/vehicles", "/auth/login",
// NOT "/api/vehicles" - this avoids accidental "/api/api/..." URLs.
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getStorageString(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      const alreadyOnLogin = window.location.pathname === '/login';
      removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
      removeStorageItem(STORAGE_KEYS.AUTH_USER);

      // Avoid redirect loops if we're already on the login page.
      if (!alreadyOnLogin) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
