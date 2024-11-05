import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    cohort?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  }
};

export const projects = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (projectData: {
    name: string;
    description: string;
    githubUrl: string;
    track: string;
    cohort: string;
  }) => api.post('/projects', projectData),
  update: (id: string, projectData: Partial<{
    name: string;
    description: string;
    githubUrl: string;
    track: string;
    cohort: string;
  }>) => api.put(`/projects/${id}`, projectData),
  delete: (id: string) => api.delete(`/projects/${id}`)
};

export const cohorts = {
  getAll: () => api.get('/cohorts'),
  getById: (id: string) => api.get(`/cohorts/${id}`),
  create: (cohortData: {
    name: string;
    track: string;
    startDate: string;
    endDate: string;
  }) => api.post('/cohorts', cohortData),
  update: (id: string, cohortData: Partial<{
    name: string;
    track: string;
    startDate: string;
    endDate: string;
  }>) => api.put(`/cohorts/${id}`, cohortData),
  delete: (id: string) => api.delete(`/cohorts/${id}`)
};