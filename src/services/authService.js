import axiosClient from '../api/axiosClient';
import { mockUsers } from '../data/mockUsers';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const MOCK_DELAY_MS = 600;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mockLogin(credentials) {
  await delay(MOCK_DELAY_MS);

  const { email, password } = credentials;
  const matchedUser = mockUsers.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password
  );

  if (!matchedUser) {
    const error = new Error('Invalid email or password.');
    error.normalized = { message: 'Invalid email or password.' };
    throw error;
  }

  return {
    token: `mock-token-${matchedUser.id}-${Date.now()}`,
    user: {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    },
  };
}

async function realLogin(credentials) {
  const response = await axiosClient.post('/auth/login', credentials);
  return response.data;
}

export const authService = {
  async login(credentials) {
    return USE_MOCK ? mockLogin(credentials) : realLogin(credentials);
  },

  async logout() {
    // Nothing to await for mock mode; real backend logout endpoint can be
    // added here later (e.g. token invalidation) without touching callers.
    if (!USE_MOCK) {
      try {
        await axiosClient.post('/auth/logout');
      } catch {
        // Logout should never block the user from being logged out locally.
      }
    }
    return true;
  },
};
