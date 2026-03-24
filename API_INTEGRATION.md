# API Integration Guide - XenonOS Vue

Complete guide to integrating the XenonOS Vue frontend with the Laravel backend API.

---

## Table of Contents

1. [Overview](#overview)
2. [API Service Layer](#api-service-layer)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)
6. [Request/Response Examples](#requestresponse-examples)
7. [Rate Limiting](#rate-limiting)
8. [WebSocket Integration](#websocket-integration)
9. [Best Practices](#best-practices)

---

## Overview

### Architecture

The frontend communicates with a separate Laravel 12 backend API using RESTful HTTP requests with JSON payloads.

```
┌──────────────────┐
│  Vue 3 Frontend  │
│  (xenonos-vue)   │
└────────┬─────────┘
         │
         │ HTTPS
         │ Bearer Token
         │ JSON
         │
┌────────▼─────────┐
│  Laravel 12 API  │
│  (Separate Repo) │
└──────────────────┘
```

### Base Configuration

**Environment Variable:**
```env
VITE_API_URL=http://localhost:8000/api
# or for production:
VITE_API_URL=https://api.xenonos.com/api
```

**Access in Code:**
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## API Service Layer

### Service File Structure

All API calls are organized in `src/services/api.js`:

```javascript
// src/services/api.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Create Axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Set auth token helper
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// Export API methods
export async function login(email, password) { /* ... */ }
export async function logout() { /* ... */ }
// ... more methods
```

### Using the API Service

**In Stores:**
```javascript
// stores/auth.js
import { login as apiLogin } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  async function login(email, password) {
    const response = await apiLogin(email, password)
    // Handle response
  }
})
```

**In Components:**
```vue
<script setup>
import { listProjects } from '@/services/api'

const projects = ref([])

onMounted(async () => {
  const data = await listProjects()
  projects.value = data.projects
})
</script>
```

---

## Authentication

### Authentication Flow

```
1. User enters credentials
2. Frontend calls POST /api/auth/login
3. Backend validates and returns token + user
4. Frontend stores token in localStorage
5. Frontend sets token in Axios headers
6. All subsequent requests include Bearer token
7. On logout, token is cleared
```

### Login

**API Call:**
```javascript
// services/api.js
export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}
```

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@xenon.com",
  "password": "password"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@xenon.com",
    "role": "admin",
    "avatar": "https://example.com/avatars/admin.jpg"
  },
  "token": "1|abc123xyz..."
}
```

**Usage in Store:**
```javascript
// stores/auth.js
async function login(email, password) {
  loading.value = true
  try {
    const response = await apiLogin(email, password)
    
    // Store token
    token.value = response.token
    setAuthToken(response.token)
    
    // Store user info
    userEmail.value = response.user.email
    userName.value = response.user.name
    userAvatar.value = response.user.avatar
    
    // Persist to localStorage
    localStorage.setItem('auth_token', response.token)
    localStorage.setItem('auth_user', JSON.stringify(response.user))
    
    isLoggedIn.value = true
    return response
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed'
    throw err
  } finally {
    loading.value = false
  }
}
```

### Logout

**API Call:**
```javascript
export async function logout() {
  const response = await api.post('/auth/logout')
  return response.data
}
```

**Request:**
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

**Usage in Store:**
```javascript
async function logout() {
  try {
    await apiLogout()
  } catch (err) {
    console.error('Logout error:', err)
  }
  
  // Clear local state
  token.value = null
  userEmail.value = null
  userName.value = null
  isLoggedIn.value = false
  
  // Clear localStorage
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  
  // Clear Axios header
  setAuthToken(null)
}
```

### Get Current User

**API Call:**
```javascript
export async function getMe() {
  const response = await api.get('/auth/me')
  return response.data
}
```

**Request:**
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@xenon.com",
    "role": "admin",
    "avatar": "https://example.com/avatars/admin.jpg",
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

### Initialize Auth from localStorage

```javascript
// stores/auth.js
function initAuth() {
  const storedToken = localStorage.getItem('auth_token')
  const storedUser = localStorage.getItem('auth_user')
  
  if (storedToken && storedUser) {
    token.value = storedToken
    const user = JSON.parse(storedUser)
    userEmail.value = user.email
    userName.value = user.name
    userAvatar.value = user.avatar
    isLoggedIn.value = true
    setAuthToken(storedToken)
  }
}
```

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password | No |

### User Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/user/profile` | Get own profile | Yes |
| PUT | `/user/profile` | Update own profile | Yes |
| POST | `/auth/avatar` | Update avatar | Yes |
| GET | `/user/activity-summary` | Get activity stats | Yes |

### Projects Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/projects` | List projects | Yes |
| POST | `/projects` | Create project | Yes |
| GET | `/projects/{id}` | Get project details | Yes |
| PUT | `/projects/{id}` | Update project | Yes |
| DELETE | `/projects/{id}` | Delete project | Yes |
| POST | `/projects/{id}/workers` | Assign workers | Yes |
| DELETE | `/projects/{projectId}/workers/{workerId}` | Remove worker | Yes |

### Tasks Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tasks` | List tasks | Yes |
| POST | `/tasks` | Create task | Yes |
| GET | `/tasks/{id}` | Get task details | Yes |
| PUT | `/tasks/{id}` | Update task | Yes |
| DELETE | `/tasks/{id}` | Delete task | Yes |
| POST | `/tasks/{id}/assign` | Assign task | Yes |
| POST | `/tasks/{id}/progress` | Update progress | Yes |
| GET | `/tasks/my` | Get my tasks | Yes |

### Notifications Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get notifications | Yes |
| GET | `/notifications/{id}` | Get notification | Yes |
| POST | `/notifications/{id}/read` | Mark as read | Yes |
| POST | `/notifications/read-all` | Mark all as read | Yes |
| GET | `/notifications/unread-count` | Get unread count | Yes |
| POST | `/notifications/send` | Send notification | Yes (Admin) |
| DELETE | `/notifications/{id}` | Delete notification | Yes |

### Invoices Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/invoices` | List invoices | Yes |
| GET | `/invoices/{id}` | Get invoice details | Yes |
| POST | `/admin/invoices` | Create invoice | Yes (Admin) |
| PUT | `/admin/invoices/{id}` | Update invoice | Yes (Admin) |
| DELETE | `/admin/invoices/{id}` | Delete invoice | Yes (Admin) |

### Services Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/services` | List services | Yes |
| GET | `/services/{id}` | Get service details | Yes |
| POST | `/services` | Create service | Yes |
| PUT | `/services/{id}` | Update service | Yes |
| DELETE | `/services/{id}` | Delete service | Yes (Admin) |

### Files Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/files` | List files | Yes |
| GET | `/files/{id}` | Get file details | Yes |
| POST | `/files/upload` | Upload file | Yes |
| DELETE | `/files/{id}` | Delete file | Yes |

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/dashboard` | Get dashboard stats | Yes |
| GET | `/analytics/recent-projects` | Get recent projects | Yes |
| GET | `/analytics/active-tasks` | Get active tasks | Yes |

---

## Error Handling

### Global Error Handler Pattern

```javascript
// services/api.js
export async function listProjects(params = {}) {
  try {
    const response = await api.get('/projects', { params })
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired - logout
      const authStore = useAuthStore()
      authStore.logout()
      router.push('/login')
    } else if (error.response?.status === 404) {
      return { error: 'Projects not found' }
    } else if (error.response?.status === 422) {
      return { errors: error.response.data.errors }
    } else {
      return { error: 'Something went wrong' }
    }
  }
}
```

### Error Response Codes

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| 400 | Bad Request | Show validation errors |
| 401 | Unauthorized | Logout and redirect to login |
| 403 | Forbidden | Show "access denied" message |
| 404 | Not Found | Show "not found" message |
| 422 | Validation Error | Show field-specific errors |
| 429 | Too Many Requests | Show "try again later" message |
| 500 | Server Error | Show "server error" message |
| 503 | Service Unavailable | Show "maintenance" message |

### Validation Error Handling

```javascript
// In component
const formErrors = ref({})

async function submitForm() {
  try {
    await createProject(formData)
    // Success
  } catch (error) {
    if (error.response?.status === 422) {
      formErrors.value = error.response.data.errors
    }
  }
}
```

```vue
<template>
  <form @submit.prevent="submitForm">
    <input v-model="formData.name" />
    <span v-if="formErrors.name" class="error">
      {{ formErrors.name[0] }}
    </span>
    <button type="submit">Create</button>
  </form>
</template>
```

---

## Request/Response Examples

### Create Project

**Request:**
```javascript
// services/api.js
export async function createProject(data) {
  const response = await api.post('/projects', data)
  return response.data
}

// Usage
await createProject({
  name: 'Website Redesign',
  description: 'Complete website redesign',
  client_id: 1,
  status: 'active',
  budget: 15000,
  deadline: '2026-06-01'
})
```

**HTTP Request:**
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Complete website redesign",
  "client_id": 1,
  "status": "active",
  "budget": 15000,
  "deadline": "2026-06-01"
}
```

**Response (201 Created):**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Website Redesign",
    "description": "Complete website redesign",
    "client_id": 1,
    "status": "active",
    "progress": 0,
    "budget": "15000.00",
    "deadline": "2026-06-01",
    "created_at": "2026-03-24T10:00:00Z",
    "updated_at": "2026-03-24T10:00:00Z"
  }
}
```

### Upload File

**Request:**
```javascript
// services/api.js
export async function uploadFile(formData) {
  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Usage
const fileInput = document.querySelector('input[type="file"]')
const file = fileInput.files[0]
const formData = new FormData()
formData.append('file', file)
formData.append('name', 'Project_Scope.pdf')

await uploadFile(formData)
```

**HTTP Request:**
```http
POST /api/files/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

(file data in multipart format)
```

**Response (201 Created):**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "name": "Project_Scope.pdf",
    "url": "https://example.com/storage/files/Project_Scope.pdf"
  }
}
```

### Get Dashboard Stats

**Request:**
```javascript
export async function getDashboardStats() {
  try {
    const response = await api.get('/analytics/dashboard')
    return response.data
  } catch (error) {
    // Return default values if endpoint fails
    return {
      total_projects: 0,
      completion_rate: 0,
      ongoing_tasks: 0,
      team_bandwidth: 0,
      tasks_due_today: 0
    }
  }
}
```

**HTTP Request:**
```http
GET /api/analytics/dashboard
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "total_projects": 24,
  "completion_rate": 68,
  "ongoing_tasks": 12,
  "team_bandwidth": 82,
  "tasks_due_today": 4
}
```

### List with Filters

**Request:**
```javascript
export async function listInvoices(filters = {}) {
  try {
    const response = await api.get('/invoices', { params: filters })
    return response.data
  } catch (error) {
    return { invoices: [] }
  }
}

// Usage
await listInvoices({
  project_id: 1,
  client_id: 5,
  status: 'pending'
})
```

**HTTP Request:**
```http
GET /api/invoices?project_id=1&client_id=5&status=pending
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "invoices": [
    {
      "invoice_id": 1,
      "project_id": 1,
      "client_id": 5,
      "amount": "15000.00",
      "status": "pending",
      "due_date": "2026-04-24",
      "created_at": "2026-03-24T00:00:00Z"
    }
  ]
}
```

---

## Rate Limiting

### Laravel Rate Limits

The backend API implements rate limiting:

- **API Requests:** 60 requests per minute per IP
- **Auth Requests:** 5 requests per minute per IP

### Rate Limit Response

**Response (429 Too Many Requests):**
```json
{
  "message": "Too many requests. Please try again in 60 seconds.",
  "retry_after": 60
}
```

### Handling Rate Limits

```javascript
// Add retry logic with exponential backoff
export async function apiCallWithRetry(apiCall, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall()
    } catch (error) {
      if (error.response?.status === 429 && i < maxRetries - 1) {
        const retryAfter = error.response.data.retry_after || Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
        continue
      }
      throw error
    }
  }
}
```

---

## WebSocket Integration

### Laravel Reverb Setup

The backend uses Laravel Reverb for real-time WebSocket communication.

### Frontend WebSocket Client

```javascript
// Install Laravel Echo
// pnpm add laravel-echo pusher-js

import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher
window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
})
```

### Listening for Events

```javascript
// In Vue component
onMounted(() => {
  // Private channel (authenticated)
  window.Echo.private(`chat.${userId}`)
    .listen('MessageSent', (data) => {
      console.log('New message:', data)
      messages.value.push(data.message)
    })
    .listen('TaskAssigned', (data) => {
      console.log('Task assigned:', data)
      showNotification(data)
    })
  
  // Project channel
  window.Echo.channel(`project.${projectId}`)
    .listen('TaskStatusUpdated', (data) => {
      console.log('Task status updated:', data)
      refreshTasks()
    })
})

onUnmounted(() => {
  window.Echo.leave(`chat.${userId}`)
  window.Echo.leave(`project.${projectId}`)
})
```

### Broadcasting Typing Indicator

```javascript
function sendTypingIndicator(receiverId, isTyping) {
  window.Echo.post('/api/chat/typing', {
    receiver_id: receiverId,
    is_typing: isTyping
  })
}
```

---

## Best Practices

### 1. Use Stores for API Calls

Keep API calls in Pinia stores, not components:

```javascript
// ✅ Good: In store
// stores/projects.js
export const useProjectStore = defineStore('projects', () => {
  async function fetchProjects() {
    const data = await listProjects()
    projects.value = data.projects
  }
})

// ❌ Avoid: Direct API calls in components
// views/Projects.vue
onMounted(async () => {
  const response = await api.get('/projects')  // Don't do this
})
```

### 2. Handle Loading States

```javascript
// stores/projects.js
const loading = ref(false)
const error = ref(null)

async function fetchProjects() {
  loading.value = true
  error.value = null
  try {
    const data = await listProjects()
    projects.value = data.projects
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
```

### 3. Use Computed Properties

```javascript
const filteredProjects = computed(() => {
  return projects.value.filter(p => p.status === 'active')
})

const hasProjects = computed(() => projects.value.length > 0)
```

### 4. Implement Request Caching

```javascript
// Simple cache for frequently requested data
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function getDashboardStats() {
  const cached = cache.get('dashboard')
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  
  const data = await api.get('/analytics/dashboard')
  cache.set('dashboard', { data, timestamp: Date.now() })
  return data
}
```

### 5. Cancel Redundant Requests

```javascript
// Using AbortController
let abortController = null

async function searchProjects(query) {
  if (abortController) {
    abortController.abort()
  }
  
  abortController = new AbortController()
  
  try {
    const response = await api.get('/projects', {
      params: { search: query },
      signal: abortController.signal
    })
    return response.data
  } catch (error) {
    if (error.name === 'AbortError') {
      return // Request was cancelled, ignore
    }
    throw error
  }
}
```

### 6. Validate Before Sending

```javascript
async function createProject(data) {
  // Client-side validation
  if (!data.name || data.name.length < 3) {
    throw new Error('Project name must be at least 3 characters')
  }
  
  if (!data.client_id) {
    throw new Error('Client is required')
  }
  
  return api.post('/projects', data)
}
```

### 7. Use Axios Interceptors (Optional)

```javascript
// Add request/response interceptors
api.interceptors.request.use(config => {
  // Add request ID for tracking
  config.headers['X-Request-ID'] = generateUUID()
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    // Log all errors
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    })
    return Promise.reject(error)
  }
)
```

### 8. Document API Changes

When the backend API changes:

1. Update this documentation
2. Update `src/services/api.js`
3. Test all affected features
4. Update version number in package.json if breaking changes

---

## API Versioning

The API uses URL versioning:

```
/api/v1/projects
/api/v2/projects  (future)
```

Current frontend is built for **API v1**.

---

## Testing API Calls

### Manual Testing with cURL

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@xenon.com","password":"password"}'

# Get projects (replace TOKEN)
curl -X GET http://localhost:8000/api/projects \
  -H "Authorization: Bearer TOKEN" \
  -H "Accept: application/json"

# Create project
curl -X POST http://localhost:8000/api/projects \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","client_id":1}'
```

### Testing with Postman/Insomnia

1. Import API collection
2. Set base URL to `http://localhost:8000/api`
3. Add Authorization header: `Bearer {token}`
4. Test endpoints

---

## Support

For API issues or questions:
- Check backend Laravel project documentation
- Contact Xenon Studios team

**Contributors:**
- Tasin - Xenon Studios
- Munthasir - Xenon Studios

---

**Last Updated:** March 24, 2026  
**API Version:** 1.0.0
