import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

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

export const aboutContentApi = {
  getPublic: () => api.get('/about-content'),
  getAdmin: () => api.get('/about-content/admin'),
  update: (data) => api.put('/about-content', data),
};

export const applyNowContentApi = {
  getPublic: () => api.get('/apply-now-content'),
  getAdmin: () => api.get('/apply-now-content/admin'),
  update: (data) => api.put('/apply-now-content', data),
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

export const applicationsApi = {
  submit: (data) => api.post('/applications', data),
  getAll: () => api.get('/applications'),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
  remove: (id) => api.delete(`/applications/${id}`),
};
