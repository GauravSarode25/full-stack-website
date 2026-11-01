import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Admin JWT Token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lovebyte_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Menu
export const fetchMenuItems = (params) => api.get('/menu', { params });
export const fetchMenuItemById = (id) => api.get(`/menu/${id}`);
export const createMenuItem = (data) => api.post('/menu', data);
export const updateMenuItem = (id, data) => api.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`);
export const toggleMenuItem = (id) => api.patch(`/menu/${id}/toggle`);

// Reservations
export const createReservation = (data) => api.post('/reservations', data);
export const fetchAllReservations = (params) => api.get('/reservations', { params });
export const updateReservationStatus = (id, status) => api.patch(`/reservations/${id}/status`, { status });
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);

// Feedback & Testimonials
export const fetchFeedback = () => api.get('/feedback');
export const submitFeedback = (data) => api.post('/feedback', data);

// Contact
export const submitContact = (data) => api.post('/contact', data);
export const fetchContactMessages = () => api.get('/contact');
export const markContactRead = (id) => api.patch(`/contact/${id}/read`);
export const updateContactStatus = (id, status) => api.patch(`/contact/${id}/status`, { status });
export const deleteContactMessage = (id) => api.delete(`/contact/${id}`);

// Blogs
export const fetchBlogs = (params) => api.get('/blogs', { params });
export const fetchBlogBySlug = (slug) => api.get(`/blogs/${slug}`);
export const createBlog = (data) => api.post('/blogs', data);
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);
export const togglePublishBlog = (id) => api.patch(`/blogs/${id}/publish`);

// Gallery
export const fetchGallery = (params) => api.get('/gallery', { params });

// Auth & Admin
export const loginAdmin = (credentials) => api.post('/auth/login', credentials);
export const fetchAdminMe = () => api.get('/auth/me');
export const fetchAdminStats = () => api.get('/auth/stats');

export default api;
