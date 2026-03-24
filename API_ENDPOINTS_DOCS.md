# API Endpoints Documentation

Complete documentation for the Xenonos API endpoints including Dashboard Analytics, Service Orders, and Files.

---

## Table of Contents

1. [Dashboard Analytics](#dashboard-analytics)
2. [Service Orders](#service-orders)
3. [Files](#files)

---

## Dashboard Analytics

All analytics endpoints require authentication via Sanctum bearer token.

### Get Dashboard Statistics

**Endpoint:** `GET /api/analytics/dashboard`

**Description:** Retrieves key dashboard metrics including project stats, task counts, and team bandwidth.

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Response:** `200 OK`
```json
{
  "total_projects": 24,
  "completion_rate": 68,
  "ongoing_tasks": 12,
  "team_bandwidth": 82,
  "tasks_due_today": 4
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `total_projects` | integer | Total number of projects |
| `completion_rate` | integer | Percentage of completed projects (0-100) |
| `ongoing_tasks` | integer | Number of tasks with "in_progress" status |
| `team_bandwidth` | integer | Percentage of tasks assigned to workers (0-100) |
| `tasks_due_today` | integer | Number of tasks due today that are not completed |

---

### Get Recent Projects

**Endpoint:** `GET /api/analytics/recent-projects`

**Description:** Retrieves the most recent projects (default: 2, configurable via query parameter).

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 2 | Maximum number of projects to return |

**Request Example:**
```
GET /api/analytics/recent-projects?limit=5
```

**Response:** `200 OK`
```json
{
  "projects": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Neo-Finance App Redesign",
      "description": "Complete redesign of the Neo-Finance mobile application",
      "status": "active",
      "progress": 65,
      "deadline": "2026-05-15",
      "workers": [
        {"id": 1, "avatar": "https://example.com/avatars/user1.jpg"},
        {"id": 2, "avatar": "https://example.com/avatars/user2.jpg"}
      ],
      "type": "mobile",
      "created_at": "2026-01-15T10:00:00Z",
      "updated_at": "2026-03-24T08:00:00Z"
    }
  ]
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Project unique identifier |
| `name` | string | Project name |
| `description` | string | Project description |
| `status` | string | Project status (`active`, `completed`, `on_hold`, `cancelled`) |
| `progress` | integer | Completion percentage (0-100) |
| `deadline` | string | Project deadline (ISO 8601 date) |
| `workers` | array | List of workers assigned to the project |
| `workers[].id` | integer | Worker user ID |
| `workers[].avatar` | string | Worker avatar URL |
| `type` | string | Project type (`web`, `mobile`, `desktop`, etc.) |
| `created_at` | string | Creation timestamp (ISO 8601) |
| `updated_at` | string | Last update timestamp (ISO 8601) |

---

### Get Active Tasks

**Endpoint:** `GET /api/analytics/active-tasks`

**Description:** Retrieves tasks that are currently in progress.

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 5 | Maximum number of tasks to return |

**Request Example:**
```
GET /api/analytics/active-tasks?limit=10
```

**Response:** `200 OK`
```json
{
  "tasks": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Design homepage mockup",
      "status": "in_progress",
      "priority": "high",
      "deadline": "2026-04-01",
      "created_at": "2026-03-20T10:00:00Z",
      "updated_at": "2026-03-24T08:00:00Z"
    }
  ]
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Task unique identifier |
| `title` | string | Task title |
| `status` | string | Task status (`todo`, `in_progress`, `review`, `completed`) |
| `priority` | string | Task priority (`low`, `medium`, `high`, `urgent`) |
| `deadline` | string | Task deadline (ISO 8601 date) |
| `created_at` | string | Creation timestamp (ISO 8601) |
| `updated_at` | string | Last update timestamp (ISO 8601) |

---

## Service Orders

All service order endpoints require authentication via Sanctum bearer token.

### List Service Orders

**Endpoint:** `GET /api/services`

**Description:** Retrieves a list of service orders. Clients see only their orders; admins see all orders.

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 15 | Maximum number of orders to return |

**Request Example:**
```
GET /api/services?limit=10
```

**Response:** `200 OK`
```json
{
  "services": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "name": "Illustration Pack",
      "order_number": "SO-64A3F2B1",
      "status": "processing",
      "created_at": "2026-03-24T06:00:00Z"
    }
  ]
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Service order unique identifier |
| `name` | string | Service order name |
| `order_number` | string | Unique order reference number |
| `status` | string | Order status (`pending`, `processing`, `completed`, `cancelled`) |
| `created_at` | string | Creation timestamp (ISO 8601) |

---

### Get Service Order Details

**Endpoint:** `GET /api/services/{id}`

**Description:** Retrieves detailed information about a specific service order.

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Service order ID |

**Request Example:**
```
GET /api/services/770e8400-e29b-41d4-a716-446655440002
```

**Response:** `200 OK`
```json
{
  "service": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "client_id": 5,
    "worker_id": 12,
    "name": "Illustration Pack",
    "order_number": "SO-64A3F2B1",
    "status": "processing",
    "requirements": {
      "style": "minimalist",
      "quantity": 10,
      "format": "PNG, SVG"
    },
    "created_at": "2026-03-24T06:00:00Z",
    "updated_at": "2026-03-24T10:30:00Z",
    "client": {
      "id": 5,
      "name": "John Client",
      "email": "client@example.com"
    },
    "worker": {
      "id": 12,
      "name": "Jane Worker",
      "email": "worker@example.com"
    }
  }
}
```

---

### Create Service Order

**Endpoint:** `POST /api/services`

**Description:** Creates a new service order.

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Logo Design",
  "requirements": {
    "style": "modern",
    "colors": ["blue", "white"],
    "deliverables": ["PNG", "SVG", "AI"]
  }
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Service order name |
| `requirements` | object | No | Additional requirements as JSON |

**Response:** `201 Created`
```json
{
  "message": "Service order created successfully",
  "service": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "client_id": 5,
    "worker_id": null,
    "name": "Logo Design",
    "order_number": "SO-64A3F2B2",
    "status": "pending",
    "requirements": {
      "style": "modern",
      "colors": ["blue", "white"],
      "deliverables": ["PNG", "SVG", "AI"]
    },
    "created_at": "2026-03-24T11:00:00Z",
    "updated_at": "2026-03-24T11:00:00Z"
  }
}
```

---

### Update Service Order

**Endpoint:** `PUT /api/services/{id}`

**Description:** Updates an existing service order. Only the client who created the order or an admin can update it.

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Service order ID |

**Request Body:**
```json
{
  "name": "Updated Logo Design",
  "status": "processing",
  "worker_id": 12,
  "requirements": {
    "style": "modern minimalist",
    "colors": ["blue", "white", "gray"],
    "deliverables": ["PNG", "SVG", "AI", "PDF"]
  }
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Updated service order name |
| `status` | string | No | New status (`pending`, `processing`, `completed`, `cancelled`) |
| `worker_id` | integer | No | ID of worker assigned to the order |
| `requirements` | object | No | Updated requirements |

**Response:** `200 OK`
```json
{
  "message": "Service order updated successfully",
  "service": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "client_id": 5,
    "worker_id": 12,
    "name": "Updated Logo Design",
    "order_number": "SO-64A3F2B2",
    "status": "processing",
    "requirements": {
      "style": "modern minimalist",
      "colors": ["blue", "white", "gray"],
      "deliverables": ["PNG", "SVG", "AI", "PDF"]
    },
    "created_at": "2026-03-24T11:00:00Z",
    "updated_at": "2026-03-24T11:30:00Z"
  }
}
```

**Error Response:** `422 Unprocessable Entity` (Unauthorized)
```json
{
  "message": "Unauthorized to update this service order"
}
```

---

### Delete Service Order

**Endpoint:** `DELETE /api/services/{id}`

**Description:** Deletes a service order. Only administrators can delete service orders.

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Service order ID |

**Request Example:**
```
DELETE /api/services/880e8400-e29b-41d4-a716-446655440003
```

**Response:** `200 OK`
```json
{
  "message": "Service order deleted successfully"
}
```

**Error Response:** `422 Unprocessable Entity` (Unauthorized)
```json
{
  "message": "Only administrators can delete service orders"
}
```

---

## Files

All file endpoints require authentication via Sanctum bearer token.

### List Files

**Endpoint:** `GET /api/files`

**Description:** Retrieves a list of uploaded files. Clients see only their uploaded files; admins see all files.

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 15 | Maximum number of files to return |

**Request Example:**
```
GET /api/files?limit=10
```

**Response:** `200 OK`
```json
{
  "files": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440004",
      "name": "Project_Scope_V2.pdf",
      "original_name": "Project_Scope_Version2.pdf",
      "mime_type": "application/pdf",
      "size": 1258000,
      "formatted_size": "1.2 MB",
      "url": "https://example.com/storage/files/Project_Scope_V2.pdf",
      "created_at": "2026-03-24T10:00:00Z"
    }
  ]
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | File unique identifier |
| `name` | string | Stored file name |
| `original_name` | string | Original uploaded file name |
| `mime_type` | string | File MIME type |
| `size` | integer | File size in bytes |
| `formatted_size` | string | Human-readable file size |
| `url` | string | Full URL to access the file |
| `created_at` | string | Upload timestamp (ISO 8601) |

---

### Get File Details

**Endpoint:** `GET /api/files/{id}`

**Description:** Retrieves detailed information about a specific file.

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | File ID |

**Request Example:**
```
GET /api/files/990e8400-e29b-41d4-a716-446655440004
```

**Response:** `200 OK`
```json
{
  "file": {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "name": "Project_Scope_V2.pdf",
    "original_name": "Project_Scope_Version2.pdf",
    "path": "files/Project_Scope_V2.pdf",
    "mime_type": "application/pdf",
    "size": 1258000,
    "fileable_type": null,
    "fileable_id": null,
    "uploaded_by": 5,
    "formatted_size": "1.2 MB",
    "url": "https://example.com/storage/files/Project_Scope_V2.pdf",
    "created_at": "2026-03-24T10:00:00Z",
    "updated_at": "2026-03-24T10:00:00Z"
  }
}
```

---

### Upload File

**Endpoint:** `POST /api/files/upload`

**Description:** Uploads a new file to the server.

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Request Body:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | file | Yes | The file to upload (max: 10MB) |
| `name` | string | No | Custom name for the file |

**Request Example (using cURL):**
```bash
curl -X POST http://localhost:8000/api/files/upload \
  -H "Authorization: Bearer {token}" \
  -F "file=@/path/to/file.pdf" \
  -F "name=Project_Scope_V2.pdf"
```

**Response:** `201 Created`
```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": "aa0e8400-e29b-41d4-a716-446655440005",
    "name": "Project_Scope_V2.pdf",
    "url": "https://example.com/storage/files/Project_Scope_V2.pdf"
  }
}
```

**Error Response:** `422 Unprocessable Entity` (Validation Error)
```json
{
  "message": "The file field is required.",
  "errors": {
    "file": ["The file field is required."]
  }
}
```

---

### Delete File

**Endpoint:** `DELETE /api/files/{id}`

**Description:** Deletes a file. Only the uploader or an admin can delete a file.

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | File ID |

**Request Example:**
```
DELETE /api/files/aa0e8400-e29b-41d4-a716-446655440005
```

**Response:** `200 OK`
```json
{
  "message": "File deleted successfully"
}
```

**Error Response:** `422 Unprocessable Entity` (Unauthorized)
```json
{
  "message": "Unauthorized to delete this file"
}
```

---

## Error Responses

### Authentication Errors

**401 Unauthorized**
```json
{
  "message": "Unauthenticated."
}
```

### Authorization Errors

**403 Forbidden**
```json
{
  "message": "You do not have permission to perform this action."
}
```

### Validation Errors

**422 Unprocessable Entity**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["The field_name field is required."]
  }
}
```

### Not Found Errors

**404 Not Found**
```json
{
  "message": "Resource not found."
}
```

---

## Rate Limiting

API requests are rate limited to prevent abuse. If you exceed the rate limit, you will receive a `429 Too Many Requests` response.

**429 Too Many Requests**
```json
{
  "message": "Too many requests. Please try again in 60 seconds."
}
```

---

## Notes

- All timestamps are returned in ISO 8601 format (e.g., `2026-03-24T10:00:00Z`)
- All UUIDs are version 4 format
- Clients can only access their own data (projects, service orders, files)
- Admins have access to all data
- File uploads are limited to 10MB per file
- Service order numbers are auto-generated in the format `SO-XXXXXXXXXX`
