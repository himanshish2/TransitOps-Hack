import axiosClient from '../api/axiosClient';
import { mockDrivers } from '../data/mockDrivers';
import { STORAGE_KEYS } from '../utils/constants';
import { getStorageItem, setStorageItem } from '../utils/storageUtils';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const MOCK_DELAY_MS = 500;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadDriversFromStorage() {
  const stored = getStorageItem(STORAGE_KEYS.DRIVERS);
  if (stored && Array.isArray(stored)) return stored;
  setStorageItem(STORAGE_KEYS.DRIVERS, mockDrivers);
  return [...mockDrivers];
}

function saveDriversToStorage(drivers) {
  setStorageItem(STORAGE_KEYS.DRIVERS, drivers);
}

function generateId() {
  return `drv-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// ---- Mock implementations ----

async function mockGetDrivers() {
  await delay(MOCK_DELAY_MS);
  return loadDriversFromStorage();
}

async function mockGetDriverById(id) {
  await delay(MOCK_DELAY_MS);
  const drivers = loadDriversFromStorage();
  const found = drivers.find((d) => d.id === id);
  if (!found) {
    const error = new Error('Driver not found');
    error.normalized = { message: 'Driver not found' };
    throw error;
  }
  return found;
}

async function mockCreateDriver(driverData) {
  await delay(MOCK_DELAY_MS);
  const drivers = loadDriversFromStorage();
  const newDriver = { ...driverData, id: generateId() };
  const updated = [newDriver, ...drivers];
  saveDriversToStorage(updated);
  return newDriver;
}

async function mockUpdateDriver(id, driverData) {
  await delay(MOCK_DELAY_MS);
  const drivers = loadDriversFromStorage();

  let updatedDriver = null;
  const updated = drivers.map((d) => {
    if (d.id === id) {
      updatedDriver = { ...d, ...driverData, id };
      return updatedDriver;
    }
    return d;
  });

  if (!updatedDriver) {
    const error = new Error('Driver not found');
    error.normalized = { message: 'Driver not found' };
    throw error;
  }

  saveDriversToStorage(updated);
  return updatedDriver;
}

async function mockDeleteDriver(id) {
  await delay(MOCK_DELAY_MS);
  const drivers = loadDriversFromStorage();
  const updated = drivers.filter((d) => d.id !== id);
  saveDriversToStorage(updated);
  return { id };
}

// ---- Real backend implementations ----

async function realGetDrivers(params) {
  const response = await axiosClient.get('/drivers', { params });
  return response.data;
}

async function realGetDriverById(id) {
  const response = await axiosClient.get(`/drivers/${id}`);
  return response.data;
}

async function realCreateDriver(driverData) {
  const response = await axiosClient.post('/drivers', driverData);
  return response.data;
}

async function realUpdateDriver(id, driverData) {
  const response = await axiosClient.put(`/drivers/${id}`, driverData);
  return response.data;
}

async function realDeleteDriver(id) {
  const response = await axiosClient.delete(`/drivers/${id}`);
  return response.data;
}

// ---- Public service ----

export const driverService = {
  async getDrivers(params = {}) {
    return USE_MOCK ? mockGetDrivers(params) : realGetDrivers(params);
  },
  async getDriverById(id) {
    return USE_MOCK ? mockGetDriverById(id) : realGetDriverById(id);
  },
  async createDriver(driverData) {
    try {
      return await (USE_MOCK ? mockCreateDriver(driverData) : realCreateDriver(driverData));
    } catch (error) {
      throw normalizeServiceError(error);
    }
  },
  async updateDriver(id, driverData) {
    try {
      return await (USE_MOCK ? mockUpdateDriver(id, driverData) : realUpdateDriver(id, driverData));
    } catch (error) {
      throw normalizeServiceError(error);
    }
  },
  async deleteDriver(id) {
    try {
      return await (USE_MOCK ? mockDeleteDriver(id) : realDeleteDriver(id));
    } catch (error) {
      throw normalizeServiceError(error);
    }
  },
};

function normalizeServiceError(error) {
  if (error.normalized) return error;
  const backendPayload = error?.response?.data;
  const normalized = {
    message: backendPayload?.message || 'Something went wrong. Please try again.',
    field: backendPayload?.field,
  };
  const wrapped = new Error(normalized.message);
  wrapped.normalized = normalized;
  return wrapped;
}
