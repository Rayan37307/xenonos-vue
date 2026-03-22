# Xenon OS - Detailed Backend API Documentation

This document provides detailed information about the API endpoints available in the Xenon OS backend, including request parameters, payloads, and usage examples.

All API requests MUST be made to the `/api` prefix (e.g., `http://localhost:8000/api`).

## Authentication

### 1. Register a New User
- **Endpoint:** `POST /auth/register`
- **Auth Required:** No
- **Description:** Registers a new user.

**Payload:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "client", // optional: client, worker, admin
  "company_name": "Tech Corp", // optional
  "phone": "1234567890" // optional
}
```

### 2. Login
- **Endpoint:** `POST /auth/login`
- **Auth Required:** No
- **Description:** Authenticates a user and returns a token.

**Payload:**
```json
{
  "email": "admin@xenon.com",
  "password": "password"
}
```

### 3. Get Current User Profile
- **Endpoint:** `GET /auth/me`
- **Auth Required:** Yes (Bearer Token)
- **Description:** Returns the authenticated user details.

### 4. Update Profile
- **Endpoint:** `PUT /auth/profile`
- **Auth Required:** Yes
- **Description:** Updates the current user's profile information.

**Payload:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com", // optional
  "password": "newpassword123", // optional
  "password_confirmation": "newpassword123" // required if password is provided
}
```

### 5. Update Avatar
- **Endpoint:** `POST /auth/avatar`
- **Auth Required:** Yes
- **Description:** Uploads a new avatar image. Must be sent as `multipart/form-data`.

**Payload:**
- `avatar`: (File - required, image, max: 2048 KB)

---

## Projects

### 1. List Projects
- **Endpoint:** `GET /projects`
- **Auth Required:** Yes
- **Description:** Retrieves all projects.
- **Query Parameters:** `status` (optional), `client_id` (optional), `search` (optional)

### 2. Create Project
- **Endpoint:** `POST /projects`
- **Auth Required:** Yes
- **Description:** Creates a new project in the system.

**Payload:**
```json
{
  "name": "E-commerce App",
  "description": "Building a custom e-commerce solution.",
  "client_id": 5,
  "status": "planning", // optional: planning, active, on_hold, completed, cancelled
  "budget": 20000, // optional
  "deadline": "2024-12-31" // optional
}
```

### 3. Update Project
- **Endpoint:** `PUT /projects/{id}`
- **Auth Required:** Yes
- **Description:** Updates an existing project.

**Payload:**
```json
{
  "name": "E-commerce Web App", // optional
  "status": "active", // optional
  "budget": 25000 // optional
}
```

### 4. Assign Workers to Project
- **Endpoint:** `POST /projects/{id}/workers`
- **Auth Required:** Yes
- **Description:** Assigns multiple workers to a project.

**Payload:**
```json
{
  "worker_ids": [2, 3, 7]
}
```

### 5. Get Project Statistics
- **Endpoint:** `GET /projects/{id}/statistics`
- **Auth Required:** Yes
- **Description:** Retrieves analytics/statistics for a specific project.

---

## Tasks

### 1. List Tasks
- **Endpoint:** `GET /tasks`
- **Auth Required:** Yes
- **Description:** Lists all tasks.
- **Query Parameters:** `project_id`, `status`, `assigned_to`, `priority`

### 2. Create Task
- **Endpoint:** `POST /tasks`
- **Auth Required:** Yes
- **Description:** Creates a new task.

**Payload:**
```json
{
  "title": "Design Database Schema",
  "description": "Design the initial SQL schema for the e-commerce app.",
  "project_id": 1,
  "assigned_to": 2, // optional (worker user id)
  "status": "todo", // optional: todo, in_progress, review, completed
  "priority": "high", // optional: low, medium, high, urgent
  "deadline": "2024-06-15", // optional
  "estimated_hours": 10 // optional
}
```

### 3. Update Task
- **Endpoint:** `PUT /tasks/{id}`
- **Auth Required:** Yes
- **Description:** Updates an existing task's details.

**Payload:**
```json
{
  "status": "in_progress", // optional
  "progress": 25, // optional (percentage 0-100)
  "priority": "urgent" // optional
}
```

### 4. Assign Task to Worker
- **Endpoint:** `POST /tasks/{id}/assign`
- **Auth Required:** Yes
- **Description:** Assigns a task to a specific worker.

**Payload:**
```json
{
  "worker_id": 3
}
```

### 5. Update Task Progress
- **Endpoint:** `POST /tasks/{id}/progress`
- **Auth Required:** Yes
- **Description:** Quickly updates the completion percentage of a task.

**Payload:**
```json
{
  "progress": 75 // (0-100)
}
```

### 6. Kanban Board Tasks
- **Endpoint:** `GET /projects/{projectId}/tasks/kanban`
- **Auth Required:** Yes
- **Description:** Gets tasks formatted for a Kanban board view.

### 7. Reorder Kanban Tasks
- **Endpoint:** `POST /projects/{projectId}/tasks/reorder`
- **Auth Required:** Yes
- **Description:** Reorders tasks within a Kanban board column/status.

**Payload:**
```json
{
  "task_order": [12, 15, 8, 22] // Array of task IDs in the new order
}
```
