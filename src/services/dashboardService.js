import axiosClient from '../api/axiosClient';
import { buildMockDashboardData } from '../data/mockDashboard';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const MOCK_DELAY_MS = 500;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mockGetDashboardData(filters) {
  await delay(MOCK_DELAY_MS);
  return buildMockDashboardData(filters);
}

async function realGetDashboardData(filters) {
  // Uses the exact query parameter names the backend expects:
  // vehicleType, status, region
  const params = {};
  if (filters?.vehicleType) params.vehicleType = filters.vehicleType;
  if (filters?.status) params.status = filters.status;
  if (filters?.region) params.region = filters.region;

  const response = await axiosClient.get('/dashboard', { params });
  return response.data;
}

export const dashboardService = {
  async getDashboardData(filters = {}) {
    return USE_MOCK ? mockGetDashboardData(filters) : realGetDashboardData(filters);
  },
};
