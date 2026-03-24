# Technical Specifications - XenonOS Vue

## System Architecture

### Overview

XenonOS is a **single-page application (SPA)** built with Vue 3 that communicates with a separate Laravel 12 backend API. The architecture follows a **client-server model** with token-based authentication.

```
┌─────────────────────────────────────────────────────────────┐
│                     XenonOS Vue Frontend                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Vue 3     │  │   Pinia     │  │   Vue Router        │  │
│  │ Components  │  │   Stores    │  │   (Protected Routes)│  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                      │            │
│         └────────────────┼──────────────────────┘            │
│                          │                                   │
│                  ┌───────▼────────┐                          │
│                  │  API Service   │                          │
│                  │   (Axios)      │                          │
│                  └───────┬────────┘                          │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           │ HTTP/HTTPS (JSON)
                           │ Bearer Token Auth
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                   Laravel 12 Backend API                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Sanctum    │  │   Eloquent  │  │   Reverb WebSocket  │  │
│  │    Auth     │  │    ORM      │  │   (Real-time Events)│  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                          │                                   │
│                  ┌───────▼────────┐                          │
│                  │    Database    │                          │
│                  │  (MySQL/SQLite)│                          │
│                  └────────────────┘                          │
└──────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Vue 3 Composition API

All components use the **Composition API** with `<script setup>` syntax for optimal performance and code organization.

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(false)

const userName = computed(() => authStore.userName)

onMounted(async () => {
  await authStore.fetchUser()
})
</script>
```

### Component Hierarchy

```
App.vue (Root)
└── AppLayout.vue
    ├── AppSidebar.vue (Navigation)
    ├── AppTopNav.vue (Top bar with user menu)
    └── <router-view> (Page content)
        ├── Dashboard.vue
        ├── Projects.vue
        │   └── ProjectDetails.vue
        ├── Tasks.vue
        ├── Messages.vue
        ├── Files.vue
        ├── Services.vue
        ├── Billing.vue
        ├── Notifications.vue
        ├── Profile.vue
        └── Settings.vue
            ├── AccountSecurity.vue
            ├── PrivacyData.vue
            ├── PreferencesInfo.vue
            └── NotificationsSettings.vue
```

### Lazy Loading Strategy

Routes are lazy-loaded for optimal initial bundle size:

```javascript
// router/index.js
const Dashboard = () => import('@/views/Dashboard.vue')
const Projects = () => import('@/views/Projects.vue')
```

---

## State Management (Pinia)

### Store Structure

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `auth` | Authentication state, user info, token | localStorage |
| `dashboard` | Dashboard statistics, recent projects, active tasks | Session only |
| `projects` | Project list, project details, filters | Session only |
| `notifications` | Notification list, unread count | Session only |
| `profile` | User profile data, activity summary | Session only |

### Auth Store Flow

```javascript
// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const isLoggedIn = ref(false)
  const userEmail = ref(null)
  const userName = ref(null)
  const userAvatar = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const isAuthenticated = computed(() => isLoggedIn.value)

  // Actions
  async function login(email, password) { /* ... */ }
  async function logout() { /* ... */ }
  async function fetchUser() { /* ... */ }
  function initAuth() { /* Initialize from localStorage */ }

  return { /* exports */ }
})
```

### Authentication Flow

```
┌──────────────┐
│   User       │
│   Login      │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────┐
│ authStore.login()           │
│ 1. Call API /auth/login     │
│ 2. Receive token + user     │
│ 3. Store in localStorage    │
│ 4. Set Axios header         │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Router redirects to         │
│ /dashboard                  │
└─────────────────────────────┘
```

---

## API Integration Patterns

### Service Layer Architecture

```javascript
// services/api.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Auth token setter
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

// API methods grouped by domain
export async function login(email, password) { /* ... */ }
export async function listProjects(params) { /* ... */ }
export async function getNotifications() { /* ... */ }
```

### Error Handling Strategy

```javascript
// In stores/actions
try {
  const response = await api.get('/projects')
  return response.data
} catch (error) {
  // Handle specific error codes
  if (error.response?.status === 401) {
    // Token expired - logout
    authStore.logout()
  } else if (error.response?.status === 404) {
    // Resource not found
  } else if (error.response?.status === 422) {
    // Validation errors
    return { errors: error.response.data.errors }
  } else {
    // Generic error
    return { error: 'Something went wrong' }
  }
}
```

### Request/Response Interceptors (Future Enhancement)

```javascript
// Future: Add interceptors for centralized error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Auto-logout on 401
      const authStore = useAuthStore()
      authStore.logout()
    }
    return Promise.reject(error)
  }
)
```

---

## Routing & Navigation

### Route Configuration

```javascript
// router/index.js
const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
    // No meta.requiresAuth - public route
  }
]
```

### Navigation Guards

```javascript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Protected route check
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } 
  // Redirect logged-in users away from login
  else if (to.name === 'Login' && authStore.isAuthenticated) {
    next('/dashboard')
  } 
  else {
    next()
  }
})
```

### Scroll Behavior

```javascript
scrollBehavior(to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition  // Restore on back/forward
  } else {
    return { top: 0 }     // Scroll to top on new navigation
  }
}
```

---

## Component Design Patterns

### AppLayout Pattern

```vue
<!-- components/AppLayout.vue -->
<script setup>
import AppSidebar from './AppSidebar.vue'
import AppTopNav from './AppTopNav.vue'
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <AppSidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <AppTopNav />
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
```

### Page Component Pattern

```vue
<!-- views/Projects.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projects'
import AppLayout from '@/components/AppLayout.vue'

const projectStore = useProjectStore()
const loading = ref(true)

onMounted(async () => {
  await projectStore.fetchProjects()
  loading.value = false
})
</script>

<template>
  <AppLayout>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <!-- Page content -->
    </div>
  </AppLayout>
</template>
```

---

## Design System

### CSS Custom Properties (Design Tokens)

```css
/* src/style.css */
:root {
  /* Colors */
  --color-surface: #ffffff;
  --color-surface-secondary: #f9fafb;
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-on-surface: #1a1a1a;
  --color-on-surface-muted: #6b7280;
  --color-border: #e5e7eb;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-body: 'Outfit', sans-serif;
  --font-headline: 'Syne', sans-serif;
  --font-label: 'Ubuntu', sans-serif;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}
```

### Tailwind Configuration

Tailwind CSS v4 uses the new CSS-first configuration:

```css
@import "tailwindcss";

/* Custom theme extensions */
@theme {
  --color-primary: var(--color-primary);
  --font-sans: var(--font-body);
}
```

---

## Performance Optimizations

### Code Splitting

- **Route-based splitting**: Each view is lazy-loaded
- **Component splitting**: Large components can be dynamically imported
- **Vendor splitting**: Vite automatically splits node_modules

### Bundle Analysis

```bash
# Build with visualization
pnpm build
# Check dist/ folder sizes
```

### Runtime Performance

- **Computed properties** for derived state (cached)
- **Debounced API calls** for search inputs
- **Virtual scrolling** for large lists (future enhancement)

---

## Security Considerations

### Authentication

- Tokens stored in **localStorage** (consider httpOnly cookies for production)
- Token automatically attached to all API requests via Axios interceptor
- 401 responses trigger automatic logout

### XSS Prevention

- Vue automatically escapes content in templates
- Use `v-html` only with sanitized content
- Avoid storing sensitive data in localStorage

### CSRF Protection

- Laravel Sanctum handles CSRF for cookie-based auth
- Token-based auth (current setup) is CSRF-safe by default

---

## Testing Strategy (Planned)

### Unit Tests (Vitest)

```javascript
// tests/unit/stores/auth.test.js
import { describe, it, expect } from 'vitest'
import { useAuthStore } from '@/stores/auth'

describe('Auth Store', () => {
  it('should set isLoggedIn to true after successful login', async () => {
    // Test implementation
  })
})
```

### Component Tests (Vue Test Utils)

```javascript
// tests/unit/components/AppSidebar.test.js
import { mount } from '@vue/test-utils'
import AppSidebar from '@/components/AppSidebar.vue'

describe('AppSidebar', () => {
  it('should render navigation links', () => {
    // Test implementation
  })
})
```

### E2E Tests (Playwright/Cypress) - Future

```javascript
// tests/e2e/login.spec.js
test('user can login successfully', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', 'admin@xenon.com')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |

**Not supported:**
- Internet Explorer (any version)
- Legacy browsers without ES2020 support

---

## Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vue | 3.5.30 | Core framework |
| vue-router | 5.0.4 | Client-side routing |
| pinia | 3.0.4 | State management |
| axios | 1.13.6 | HTTP client |
| tailwindcss | 4.2.2 | Utility CSS framework |
| @tailwindcss/vite | 4.2.2 | Tailwind Vite plugin |
| lucide-vue-next | 0.57.0 | Icon library |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vite | 8.0.1 | Build tool |
| @vitejs/plugin-vue | 6.0.5 | Vue 3 support in Vite |

---

## Build Configuration

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

### Environment Variables

```env
# .env
VITE_API_URL=http://localhost:8000/api

# Available in code via import.meta.env.VITE_API_URL
```

**Note:** Only `VITE_*` prefixed variables are exposed to the client bundle.

---

## Future Enhancements

### Planned Features

1. **Offline Support** - Service Worker + IndexedDB caching
2. **Push Notifications** - Web Push API integration
3. **Dark Mode** - Theme toggle with CSS variables
4. **i18n** - Multi-language support with Vue I18n
5. **Advanced Filtering** - Server-side pagination and filtering
6. **Export Functions** - PDF/Excel export for reports
7. **Real-time Updates** - WebSocket integration with Laravel Reverb

### Technical Debt

- Add comprehensive test coverage
- Implement request retry logic for failed API calls
- Add loading skeletons instead of spinners
- Optimize bundle size with tree-shaking
- Migrate to httpOnly cookies for better security

---

## Code Quality Tools (Planned)

### ESLint Configuration

```javascript
// eslint.config.js (future)
export default [
  {
    files: ['**/*.vue', '**/*.js'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    }
  }
]
```

### Prettier Configuration

```json
// .prettierrc (future)
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

**Last Updated:** March 24, 2026  
**Maintained by:** Xenon Studios (Tasin, Munthasir)
