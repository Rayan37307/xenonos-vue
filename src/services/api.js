import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Set auth token
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// Auth
export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export async function logout() {
  const response = await api.post('/auth/logout')
  return response.data
}

export async function getMe() {
  const response = await api.get('/auth/me')
  return response.data
}

// Profile
export async function getProfile() {
  const response = await api.get('/user/profile')
  return response.data
}

export async function updateProfile(data) {
  const payload = { ...data }
  // Map frontend field names to backend field names
  if (payload.phone) {
    payload.phone_number = payload.phone
    delete payload.phone
  }
  // Combine first_name and last_name into name if needed
  if (payload.first_name || payload.last_name) {
    const firstName = payload.first_name || ''
    const lastName = payload.last_name || ''
    if (firstName && lastName) {
      payload.name = `${firstName} ${lastName}`.trim()
    }
  }
  const response = await api.put('/user/profile', payload)
  return response.data
}

export async function updateAvatar(formData) {
  const response = await api.post('/auth/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function getActivitySummary() {
  const response = await api.get('/user/activity-summary')
  return response.data
}

// Notifications
export async function getNotifications(includeRead = false) {
  const response = await api.get('/notifications', { params: { include_read: includeRead } })
  return response.data
}

export async function getNotification(notificationId) {
  const response = await api.get(`/notifications/${notificationId}`)
  return response.data
}

export async function getUnreadCount() {
  const response = await api.get('/notifications/unread-count')
  return response.data
}

export async function markAsRead(notificationId) {
  const response = await api.post(`/notifications/${notificationId}/read`)
  return response.data
}

export async function markAllAsRead() {
  const response = await api.post('/notifications/read-all')
  return response.data
}

export async function sendNotification(payload) {
  const response = await api.post('/notifications/send', payload)
  return response.data
}

export async function deleteNotification(notificationId) {
  const response = await api.delete(`/notifications/${notificationId}`)
  return response.data
}

// Projects
export async function listProjects(params = {}) {
  const response = await api.get('/projects', { params })
  return response.data
}

export async function getProject(id) {
  const response = await api.get(`/projects/${id}`)
  return response.data
}

export async function createProject(data) {
  const response = await api.post('/projects', data)
  return response.data
}

export async function updateProject(id, data) {
  const response = await api.put(`/projects/${id}`, data)
  return response.data
}

export async function deleteProject(id) {
  const response = await api.delete(`/projects/${id}`)
  return response.data
}

// Invoices
export async function listInvoices(filters = {}) {
  try {
    const response = await api.get('/invoices', { params: filters })
    return response.data
  } catch (error) {
    return { invoices: [] }
  }
}

export async function getInvoice(id) {
  const response = await api.get(`/invoices/${id}`)
  return response.data
}

// Dashboard/Analytics
export async function getDashboardStats() {
  try {
    const response = await api.get('/analytics/dashboard')
    // API returns { analytics: { overview: {...}, ... } }
    return response.data
  } catch (error) {
    // Return default stats if endpoint doesn't exist
    return {
      analytics: {
        overview: {
          total_projects: 0,
          completion_rate: 0,
          ongoing_tasks: 0,
          team_bandwidth: 0,
          tasks_due_today: 0
        }
      }
    }
  }
}

export async function getRecentProjects() {
  try {
    const response = await api.get('/analytics/recent-projects')
    // API returns { projects: [...] }
    return response.data
  } catch (error) {
    // Return empty array if endpoint doesn't exist
    return { projects: [] }
  }
}

export async function getActiveTasks() {
  try {
    const response = await api.get('/analytics/active-tasks')
    // API returns { tasks: [...] }
    return response.data
  } catch (error) {
    // Return empty array if endpoint doesn't exist
    return { tasks: [] }
  }
}

// Tasks
export async function listTasks(params = {}) {
  try {
    const response = await api.get('/tasks', { params })
    return response.data
  } catch (error) {
    return { tasks: [] }
  }
}

export async function getTask(id) {
  const response = await api.get(`/tasks/${id}`)
  return response.data
}

// Services/Orders
export async function listServices(params = {}) {
  try {
    const response = await api.get('/services', { params })
    return response.data
  } catch (error) {
    return { services: [] }
  }
}

export async function getService(id) {
  const response = await api.get(`/services/${id}`)
  return response.data
}

export async function createServiceOrder(data) {
  const response = await api.post('/service-orders', data)
  return response.data
}

// Files
export async function listFiles(params = {}) {
  try {
    const response = await api.get('/files', { params })
    return response.data
  } catch (error) {
    return { files: [] }
  }
}

export async function getFile(id) {
  const response = await api.get(`/files/${id}`)
  return response.data
}

export async function uploadFile(formData, params = {}) {
  const response = await api.post('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params,
  })
  return response.data
}

export async function uploadExternalLink(data) {
  const response = await api.post('/files', data)
  return response.data
}

export async function downloadFile(id) {
  const response = await api.get(`/files/${id}/download`)
  return response.data
}

export async function updateFile(id, data) {
  const response = await api.put(`/files/${id}`, data)
  return response.data
}

export async function deleteFile(id) {
  const response = await api.delete(`/files/${id}`)
  return response.data
}

// Session Management
export async function getSessions() {
  const response = await api.get('/sessions')
  return response.data
}

export async function getCurrentSession() {
  const response = await api.get('/sessions/current')
  return response.data
}

export async function revokeSession(id) {
  const response = await api.delete(`/sessions/${id}`)
  return response.data
}

export async function revokeAllSessions() {
  const response = await api.post('/sessions/revoke-all')
  return response.data
}

export async function revokeOtherSessions() {
  const response = await api.post('/sessions/revoke-others')
  return response.data
}

// Change Password
export async function changePassword(currentPassword, newPassword, newPasswordConfirmation) {
  const response = await api.post('/auth/change-password', {
    current_password: currentPassword,
    password: newPassword,
    password_confirmation: newPasswordConfirmation
  })
  return response.data
}

export default api
