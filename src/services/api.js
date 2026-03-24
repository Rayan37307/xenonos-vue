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

// Invoices
export async function listInvoices(filters = {}) {
  const response = await api.get('/invoices', { params: filters })
  return response.data
}

export async function getInvoice(id) {
  const response = await api.get(`/invoices/${id}`)
  return response.data
}

export default api
