// Real API service for backend integration
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const API = {
  get: (url: string, config?: any) => api.get(url, config),
  post: (url: string, data?: any, config?: any) => api.post(url, data, config),
  put: (url: string, data?: any, config?: any) => api.put(url, data, config),
  delete: (url: string, config?: any) => api.delete(url, config),

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(user));
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (name: string, email: string, password: string, role: string = 'client') => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  createReminder: async (text: string, date: string) => {
    try {
      const response = await api.post('/reminders', { text, date });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create reminder');
    }
  },

  getReminders: async () => {
    try {
      const response = await api.get('/reminders');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reminders');
    }
  },

  getDoctors: async () => {
    try {
      const response = await api.get('/doctors');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch doctors');
    }
  },

  createDoctor: async (doctorData: { name: string; specialization: string; fees: number; availableSlots: string[]; image?: string }) => {
    try {
      const response = await api.post('/doctors', doctorData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create doctor');
    }
  },

  updateDoctor: async (id: string, doctorData: { name: string; specialization: string; fees: number; availableSlots: string[]; image?: string }) => {
    try {
      const response = await api.put(`/doctors/${id}`, doctorData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update doctor');
    }
  },

  deleteDoctor: async (id: string) => {
    try {
      const response = await api.delete(`/doctors/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete doctor');
    }
  },

  getPatients: async () => {
    try {
      const response = await api.get('/admin/patients');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patients');
    }
  },

  getAllAppointments: async () => {
    try {
      const response = await api.get('/admin/appointments');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stats');
    }
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    try {
      const response = await api.put(`/admin/appointments/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update appointment status');
    }
  },

  deleteAppointment: async (id: string) => {
    try {
      const response = await api.delete(`/admin/appointments/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete appointment');
    }
  },

  deletePatient: async (id: string) => {
    try {
      const response = await api.delete(`/admin/patients/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete patient');
    }
  },

  updatePatient: async (id: string, patientData: { name: string; email: string }) => {
    try {
      const response = await api.put(`/admin/patients/${id}`, patientData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update patient');
    }
  },

  bookAppointment: async (doctorId: string, date: string, time: string) => {
    try {
      const response = await api.post('/appointments', { doctorId, date, time });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to book appointment');
    }
  },

  getMyAppointments: async () => {
    try {
      const response = await api.get('/appointments/my');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
    }
  },

  cancelAppointment: async (id: string) => {
    try {
      const response = await api.put(`/appointments/${id}/cancel`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  },

  isAuthenticated: () => !!localStorage.getItem('token'),

  getCurrentUser: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  fetchUserProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },
};

export default API;
