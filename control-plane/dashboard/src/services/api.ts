import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreateSliDto {
  name: string;
  type?: string;
  goodQuery: string;
  totalQuery: string;
  window?: string;
}

export interface CreateSloDto {
  sliId: string;
  target: number;
  window?: string;
}

export interface CreateSlaDto {
  sloId: string;
  target: number;
}

export interface CreatePolicyDto {
  threshold: number;
  action: string;
  description?: string;
}

export const getDashboardData = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const createSli = async (data: CreateSliDto) => {
  const response = await api.post('/slis', data);
  return response.data;
};

export const createSlo = async (data: CreateSloDto) => {
  const response = await api.post('/slos', data);
  return response.data;
};

export const createSla = async (data: CreateSlaDto) => {
  const response = await api.post('/slas', data);
  return response.data;
};

export const createPolicy = async (data: CreatePolicyDto) => {
  const response = await api.post('/policies', data);
  return response.data;
};
