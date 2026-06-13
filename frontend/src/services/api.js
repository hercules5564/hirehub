import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerAPI = (data) => API.post('/auth/register', data);
export const loginAPI = (data) => API.post('/auth/login', data);
export const logoutAPI = () => API.post('/auth/logout');
export const getMeAPI = () => API.get('/auth/me');
export const forgotPasswordAPI = (data) => API.post('/auth/forgot-password', data);
export const resetPasswordAPI = (token, data) => API.put(`/auth/reset-password/${token}`, data);
export const verifyEmailAPI = (token) => API.get(`/auth/verify-email/${token}`);

// Users
export const getProfileAPI = () => API.get('/users/profile');
export const updateProfileAPI = (data) => API.put('/users/profile', data);
export const uploadProfileImageAPI = (data) => API.put('/users/profile-image', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const uploadResumeAPI = (data) => API.put('/users/resume', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const changePasswordAPI = (data) => API.put('/users/change-password', data);
export const getPublicProfileAPI = (id) => API.get(`/users/${id}`);

// Jobs
export const getJobsAPI = (params) => API.get('/jobs', { params });
export const getJobAPI = (id) => API.get(`/jobs/${id}`);
export const getFeaturedJobsAPI = () => API.get('/jobs/featured');
export const createJobAPI = (data) => API.post('/jobs', data);
export const updateJobAPI = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJobAPI = (id) => API.delete(`/jobs/${id}`);
export const getRecruiterJobsAPI = () => API.get('/jobs/recruiter/my-jobs');

// Companies
export const getCompaniesAPI = (params) => API.get('/companies', { params });
export const getCompanyAPI = (id) => API.get(`/companies/${id}`);
export const createCompanyAPI = (data) => API.post('/companies', data);
export const updateCompanyAPI = (id, data) => API.put(`/companies/${id}`, data);
export const deleteCompanyAPI = (id) => API.delete(`/companies/${id}`);
export const getMyCompaniesAPI = () => API.get('/companies/my/companies');

// Applications
export const applyForJobAPI = (data) => API.post('/applications', data);
export const getMyApplicationsAPI = () => API.get('/applications/my');
export const getJobApplicantsAPI = (jobId) => API.get(`/applications/job/${jobId}`);
export const updateApplicationStatusAPI = (id, data) => API.put(`/applications/${id}/status`, data);
export const withdrawApplicationAPI = (id) => API.put(`/applications/${id}/withdraw`);
export const saveJobAPI = (jobId) => API.post(`/applications/save/${jobId}`);
export const getSavedJobsAPI = () => API.get('/applications/saved');

// Admin
export const getAdminStatsAPI = () => API.get('/admin/stats');
export const getAdminUsersAPI = (params) => API.get('/admin/users', { params });
export const updateAdminUserAPI = (id, data) => API.put(`/admin/users/${id}`, data);
export const deleteAdminUserAPI = (id) => API.delete(`/admin/users/${id}`);
export const moderateJobAPI = (id, data) => API.put(`/admin/jobs/${id}/moderate`, data);

// Notifications
export const getNotificationsAPI = () => API.get('/notifications');
export const markNotificationReadAPI = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsReadAPI = () => API.put('/notifications/read-all');

export default API;
