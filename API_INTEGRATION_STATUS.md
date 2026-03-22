# Backend API Integration Status

This document tracks the integration status of backend API endpoints with the frontend application.

## ✅ Integrated Endpoints

### Authentication (`/auth/*`)
- `POST /auth/register` - User registration (Signup.vue)
- `POST /auth/login` - User login (Login.vue)
- `GET /auth/me` - Get current user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/avatar` - Update user avatar (multipart/form-data)

### Projects (`/projects/*`)
- `GET /projects` - List all projects with filters (Projects.vue)
- `POST /projects` - Create new project
- `GET /projects/{id}` - Get single project
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project
- `POST /projects/{id}/workers` - Assign workers to project
- `GET /projects/{id}/statistics` - Get project statistics
- `GET /projects/{projectId}/tasks/kanban` - Get Kanban tasks
- `POST /projects/{projectId}/tasks/reorder` - Reorder Kanban tasks

### Tasks (`/tasks/*`)
- `GET /tasks` - List all tasks with filters
- `POST /tasks` - Create new task
- `GET /tasks/{id}` - Get single task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task
- `POST /tasks/{id}/assign` - Assign task to worker
- `POST /tasks/{id}/progress` - Update task progress

---

## ⚠️ Views Without Backend Endpoints

The following views exist in the frontend but **do not have corresponding backend API endpoints** documented in `BACKEND_API_DOCS.md`:

### 1. **Messages** (`/messages` - Messages.vue)
- **Status:** ❌ No backend endpoint available
- **Needed:** Messaging/conversation API
- **Suggested Endpoints:**
  - `GET /messages` - List conversations
  - `GET /messages/{id}` - Get conversation details
  - `POST /messages` - Send message
  - `GET /messages/{id}/thread` - Get message thread

### 2. **Files** (`/files` - Files.vue)
- **Status:** ❌ No backend endpoint available
- **Needed:** File management API
- **Suggested Endpoints:**
  - `GET /files` - List files (with project_id filter)
  - `POST /files` - Upload file (multipart/form-data)
  - `DELETE /files/{id}` - Delete file
  - `GET /files/{id}/download` - Download file

### 3. **Services** (`/services` - Services.vue)
- **Status:** ❌ No backend endpoint available
- **Needed:** Services catalog API
- **Suggested Endpoints:**
  - `GET /services` - List available services
  - `GET /services/{id}` - Get service details
  - `POST /services` - Create service
  - `PUT /services/{id}` - Update service

### 4. **Billing** (`/billing` - Billing.vue)
- **Status:** ❌ No backend endpoint available
- **Needed:** Billing/invoices API
- **Suggested Endpoints:**
  - `GET /billing/invoices` - List invoices
  - `GET /billing/invoices/{id}` - Get invoice details
  - `GET /billing/payment-methods` - List payment methods
  - `POST /billing/payment-methods` - Add payment method

### 5. **Notifications** (`/notifications` - Notifications.vue)
- **Status:** ❌ No backend endpoint available
- **Needed:** Notifications API
- **Suggested Endpoints:**
  - `GET /notifications` - List user notifications
  - `PUT /notifications/{id}/read` - Mark notification as read
  - `DELETE /notifications/{id}` - Delete notification
  - `GET /notifications/unread-count` - Get unread count

### 6. **Notification Settings** (`/notifications-settings` - NotificationsSettings.vue)
- **Status:** ❌ No backend endpoint available
- **Needed:** Notification preferences API
- **Suggested Endpoints:**
  - `GET /notifications/settings` - Get notification settings
  - `PUT /notifications/settings` - Update notification settings

### 7. **Account Security** (`/account-security` - AccountSecurity.vue)
- **Status:** ❌ No backend endpoint available (partially covered by `/auth/*`)
- **Needed:** Security settings API
- **Suggested Endpoints:**
  - `GET /auth/sessions` - List active sessions
  - `DELETE /auth/sessions/{id}` - Revoke session
  - `POST /auth/2fa/enable` - Enable 2FA
  - `POST /auth/2fa/disable` - Disable 2FA

### 8. **Privacy & Data** (`/privacy-data` - PrivacyData.vue)
- **Status:** ❌ No backend endpoint available
- **Needed:** Data privacy API
- **Suggested Endpoints:**
  - `GET /auth/data-export` - Request data export
  - `POST /auth/account-deactivate` - Deactivate account
  - `POST /auth/account-delete` - Delete account

### 9. **Preferences** (`/preferences` - PreferencesInfo.vue)
- **Status:** ❌ No backend endpoint available
- **Needed:** User preferences API
- **Suggested Endpoints:**
  - `GET /auth/preferences` - Get user preferences
  - `PUT /auth/preferences` - Update preferences

### 10. **Forgot/Reset Password** (`/forgot-password`, `/reset-password`)
- **Status:** ⚠️ Partially documented (endpoints exist but not in docs)
- **Needed:** Password reset API
- **Suggested Endpoints:**
  - `POST /auth/forgot-password` - Send reset email
  - `POST /auth/reset-password` - Reset password with token

---

## 📁 Created Files

| File | Purpose |
|------|---------|
| `src/services/api.js` | API service layer with axios |
| `src/stores/auth.js` | Auth store with backend integration |
| `src/stores/projects.js` | Projects store with backend integration |
| `src/stores/tasks.js` | Tasks store with backend integration |
| `.env` | Environment configuration |
| `.env.example` | Environment configuration template |

---

## 🔧 Configuration

To configure the backend API URL, update `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 📝 Notes

1. **Authentication**: All authenticated requests require a Bearer token, which is automatically added via axios interceptor
2. **Error Handling**: 401 errors automatically redirect to login page
3. **File Uploads**: Avatar uploads use `multipart/form-data` content type
4. **Response Format**: Expected format is `{ token, user }` for login, and resource objects for other endpoints

---

## 🚀 Next Steps

To complete the integration:

1. **Backend**: Implement the missing endpoints listed above
2. **Frontend**: Update the corresponding views to use the new API endpoints
3. **Testing**: Test all API integrations with the actual backend
4. **Error Handling**: Add user-friendly error messages and loading states
