import axiosClient from '../api/axiosClient';
import { mockVehicles } from '../data/mockVehicles';
import { STORAGE_KEYS } from '../utils/constants';
import { getStorageItem, setStorageItem } from '../utils/storageUtils';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const MOCK_DELAY_MS = 500;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Seeds localStorage with the mock dataset on first run only, so CRUD
// changes (add/edit/delete) persist across refreshes for the rest of the
// demo session, while still starting from realistic data initially.
function loadVehiclesFromStorage() {
  const stored = getStorageItem(STORAGE_KEYS.VEHICLES);
  if (stored && Array.isArray(stored)) return stored;
  setStorageItem(STORAGE_KEYS.VEHICLES, mockVehicles);
  return [...mockVehicles];
}

function saveVehiclesToStorage(vehicles) {
  setStorageItem(STORAGE_KEYS.VEHICLES, vehicles);
}

function generateId() {
  return `veh-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function throwDuplicateError(registrationNumber) {
  const error = new Error('Registration number already exists');
  error.normalized = {
    message: 'Registration number already exists',
    field: 'registrationNumber',
  };
  throw error;
}

// ---- Mock implementations ----

async function mockGetVehicles() {
  await delay(MOCK_DELAY_MS);
  return loadVehiclesFromStorage();
}

async function mockGetVehicleById(id) {
  await delay(MOCK_DELAY_MS);
  const vehicles = loadVehiclesFromStorage();
  const found = vehicles.find((v) => v.id === id);
  if (!found) {
    const error = new Error('Vehicle not found');
    error.normalized = { message: 'Vehicle not found' };
    throw error;
  }
  return found;
}

async function mockCreateVehicle(vehicleData) {
  await delay(MOCK_DELAY_MS);
  const vehicles = loadVehiclesFromStorage();

  const normalizedReg = vehicleData.registrationNumber.trim().toUpperCase();
  const isDuplicate = vehicles.some(
    (v) => v.registrationNumber.trim().toUpperCase() === normalizedReg
  );
  if (isDuplicate) throwDuplicateError(vehicleData.registrationNumber);

  const newVehicle = { ...vehicleData, id: generateId() };
  const updated = [newVehicle, ...vehicles];
  saveVehiclesToStorage(updated);
  return newVehicle;
}

async function mockUpdateVehicle(id, vehicleData) {
  await delay(MOCK_DELAY_MS);
  const vehicles = loadVehiclesFromStorage();

  const normalizedReg = vehicleData.registrationNumber.trim().toUpperCase();
  const isDuplicate = vehicles.some(
    (v) => v.registrationNumber.trim().toUpperCase() === normalizedReg && v.id !== id
  );
  if (isDuplicate) throwDuplicateError(vehicleData.registrationNumber);

  let updatedVehicle = null;
  const updated = vehicles.map((v) => {
    if (v.id === id) {
      updatedVehicle = { ...v, ...vehicleData, id };
      return updatedVehicle;
    }
    return v;
  });

  if (!updatedVehicle) {
    const error = new Error('Vehicle not found');
    error.normalized = { message: 'Vehicle not found' };
    throw error;
  }

  saveVehiclesToStorage(updated);
  return updatedVehicle;
}

async function mockDeleteVehicle(id) {
  await delay(MOCK_DELAY_MS);
  const vehicles = loadVehiclesFromStorage();
  const updated = vehicles.filter((v) => v.id !== id);
  saveVehiclesToStorage(updated);
  return { id };
}

// ---- Real backend implementations ----

async function realGetVehicles(params) {
  const response = await axiosClient.get('/vehicles', { params });
  return response.data;
}

async function realGetVehicleById(id) {
  const response = await axiosClient.get(`/vehicles/${id}`);
  return response.data;
}

async function realCreateVehicle(vehicleData) {
  const response = await axiosClient.post('/vehicles', vehicleData);
  return response.data;
}

async function realUpdateVehicle(id, vehicleData) {
  const response = await axiosClient.put(`/vehicles/${id}`, vehicleData);
  return response.data;
}

async function realDeleteVehicle(id) {
  const response = await axiosClient.delete(`/vehicles/${id}`);
  return response.data;
}

// ---- Public service (used identically by components regardless of mode) ----

export const vehicleService = {
  async getVehicles(params = {}) {
    return USE_MOCK ? mockGetVehicles(params) : realGetVehicles(params);
  },
  async getVehicleById(id) {
    return USE_MOCK ? mockGetVehicleById(id) : realGetVehicleById(id);
  },
  async createVehicle(vehicleData) {
    try {
      return await (USE_MOCK ? mockCreateVehicle(vehicleData) : realCreateVehicle(vehicleData));
    } catch (error) {
      throw normalizeServiceError(error);
    }
  },
  async updateVehicle(id, vehicleData) {
    try {
      return await (USE_MOCK ? mockUpdateVehicle(id, vehicleData) : realUpdateVehicle(id, vehicleData));
    } catch (error) {
      throw normalizeServiceError(error);
    }
  },
  async deleteVehicle(id) {
    try {
      return await (USE_MOCK ? mockDeleteVehicle(id) : realDeleteVehicle(id));
    } catch (error) {
      throw normalizeServiceError(error);
    }
  },
};

// Converts either a mock-thrown error (error.normalized) or a real Axios
// error (error.response.data = { message, field }) into a consistent shape
// so components never touch raw Axios error objects.
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
