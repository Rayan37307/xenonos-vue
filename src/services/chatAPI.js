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
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Channels API
export const channelsAPI = {
  list: (params = {}) => apiClient.get('/chat/channels', { params }),
  create: (data) => apiClient.post('/chat/channels', data),
  get: (id) => apiClient.get(`/chat/channels/${id}`),
  update: (id, data) => apiClient.put(`/chat/channels/${id}`, data),
  delete: (id) => apiClient.delete(`/chat/channels/${id}`),
  addMember: (channelId, userId) => apiClient.post(`/chat/channels/${channelId}/members`, { user_id: userId }),
  removeMember: (channelId, userId) => apiClient.delete(`/chat/channels/${channelId}/members/${userId}`)
}

// Channel Messages API
export const channelMessagesAPI = {
  list: (channelId, params = {}) => apiClient.get(`/chat/channels/${channelId}/messages`, { params }),
  send: (channelId, data) => {
    const isMultipart = data instanceof FormData
    const config = isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
    return apiClient.post(`/chat/channels/${channelId}/messages`, data, config)
  }
}

// Conversations API (Direct Messages)
export const conversationsAPI = {
  list: (params = {}) => apiClient.get('/chat/conversations', { params }),
  create: (userId) => apiClient.post('/chat/conversations', { user_id: userId }),
  getMessages: (conversationId, params = {}) => 
    apiClient.get(`/chat/conversations/${conversationId}/messages`, { params }),
  send: (conversationId, data) => {
    const isMultipart = data instanceof FormData
    const config = isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
    return apiClient.post(`/chat/conversations/${conversationId}/messages`, data, config)
  }
}

// Messages API (Edit, Delete, etc.)
export const messagesAPI = {
  edit: (messageId, content) => apiClient.put(`/chat/messages/${messageId}`, { content }),
  delete: (messageId) => apiClient.delete(`/chat/messages/${messageId}`),
  markAsRead: (messageId) => apiClient.post(`/chat/messages/${messageId}/read`),
  addReaction: (messageId, emoji) => apiClient.post(`/chat/messages/${messageId}/reactions`, { emoji }),
  removeReaction: (messageId, emoji) => apiClient.delete(`/chat/messages/${messageId}/reactions/${emoji}`)
}

// Chat Utilities API
export const chatUtilsAPI = {
  getOnlineStatus: (userIds = []) => 
    apiClient.get('/chat/users/online-status', { params: { 'user_ids[]': userIds } }),
  search: (query, params = {}) => 
    apiClient.get('/chat/search', { params: { q: query, ...params } }),
  upload: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/chat/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export default apiClient
