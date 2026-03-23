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
