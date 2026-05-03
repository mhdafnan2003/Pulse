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

export const homeContentApi = {
  getPublic: () => api.get('/home-content'),
  getAdmin: () => api.get('/home-content/admin'),
  update: (data) => api.put('/home-content', data),
};

export const serviceContentApi = {
  getPublic: () => api.get('/service-content'),
  getAdmin: () => api.get('/service-content/admin'),
  update: (data) => api.put('/service-content', data),
};

export const contactContentApi = {
  getPublic: () => api.get('/contact-content'),
  getAdmin: () => api.get('/contact-content/admin'),
  update: (data) => api.put('/contact-content', data),
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
