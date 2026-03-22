import axios from 'axios'

// Base API URL - configure via environment variable if needed
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (data) => apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  updateAvatar: (formData) => apiClient.post('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// Projects API
export const projectsAPI = {
  list: (params) => apiClient.get('/projects', { params }),
  create: (data) => apiClient.post('/projects', data),
  get: (id) => apiClient.get(`/projects/${id}`),
  update: (id, data) => apiClient.put(`/projects/${id}`, data),
  delete: (id) => apiClient.delete(`/projects/${id}`),
  assignWorkers: (id, workerIds) => apiClient.post(`/projects/${id}/workers`, { worker_ids: workerIds }),
  getStatistics: (id) => apiClient.get(`/projects/${id}/statistics`),
  getKanbanTasks: (projectId) => apiClient.get(`/projects/${projectId}/tasks/kanban`),
  reorderTasks: (projectId, taskOrder) => apiClient.post(`/projects/${projectId}/tasks/reorder`, { task_order: taskOrder })
}

// Tasks API
export const tasksAPI = {
  list: (params) => apiClient.get('/tasks', { params }),
  create: (data) => apiClient.post('/tasks', data),
  get: (id) => apiClient.get(`/tasks/${id}`),
  update: (id, data) => apiClient.put(`/tasks/${id}`, data),
  delete: (id) => apiClient.delete(`/tasks/${id}`),
  assign: (id, workerId) => apiClient.post(`/tasks/${id}/assign`, { worker_id: workerId }),
  updateProgress: (id, progress) => apiClient.post(`/tasks/${id}/progress`, { progress })
}

export default apiClient
