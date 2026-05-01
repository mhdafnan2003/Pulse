import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach token for admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const slidesApi = {
  getPublic: () => api.get('/slides'),
  getAll: () => api.get('/slides/all'),
  create: (data) => api.post('/slides', data),
  update: (id, data) => api.put(`/slides/${id}`, data),
  remove: (id) => api.delete(`/slides/${id}`),
};

export const uploadApi = {
  uploadImage: (file) => {
    const form = new FormData();
    form.append('image', file);
    return api.post('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const authApi = {
  login: (username, password) => api.post('/auth/login', { username, password }),
};
