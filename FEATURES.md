# Features Documentation - XenonOS

Complete guide to all features available in XenonOS, organized by functional area.

---

## Table of Contents

1. [Dashboard & Analytics](#dashboard--analytics)
2. [Authentication & Authorization](#authentication--authorization)
3. [Project Management](#project-management)
4. [Task Management](#task-management)
5. [Time Tracking](#time-tracking)
6. [Chat & Messaging](#chat--messaging)
7. [File Management](#file-management)
8. [Service Orders](#service-orders)
9. [Billing & Invoices](#billing--invoices)
10. [Notifications](#notifications)
11. [User Profile](#user-profile)
12. [Settings](#settings)

---

## Dashboard & Analytics

### Overview

The dashboard provides a real-time overview of your agency's performance, projects, and tasks.

### Features

#### Key Metrics Cards

| Metric | Description |
|--------|-------------|
| **Total Projects** | Total number of projects in the system |
| **Completion Rate** | Percentage of completed projects (0-100%) |
| **Ongoing Tasks** | Number of tasks currently in progress |
| **Team Bandwidth** | Percentage of tasks assigned to workers |
| **Tasks Due Today** | Number of tasks with today's deadline |

#### Recent Projects Widget

Displays the most recent projects with:
- Project name and description
- Status indicator (active, completed, on hold, cancelled)
- Progress bar (0-100%)
- Assigned workers (avatars)
- Project type icon (web, mobile, desktop)
- Deadline date

#### Active Tasks Widget

Shows tasks currently being worked on:
- Task title
- Priority badge (low, medium, high, urgent)
- Status indicator
- Deadline
- Last updated timestamp

### User Guide

**Accessing the Dashboard:**
1. Log in to your account
2. Navigate to **Dashboard** from the sidebar
3. View real-time metrics and updates

**Refreshing Data:**
- Dashboard auto-refreshes every 60 seconds
- Pull-to-refresh on mobile devices
- Manual refresh button (planned)

---

## Authentication & Authorization

### Overview

Secure authentication system using Laravel Sanctum with role-based access control.

### Features

#### Login

**Access:** Public

**How to Login:**
1. Navigate to `/login`
2. Enter your email address
3. Enter your password
4. Click "Sign In"

**Demo Credentials:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@xenon.com | password |
| Client | client@xenon.com | password |
| Worker | alice@xenon.com | password |

#### Signup

**Access:** Public (if enabled by admin)

**Required Fields:**
- Full Name
- Email Address
- Password (min 8 characters)
- Password Confirmation
- Role (Client or Worker)
- Company Name (for Clients)

#### Password Recovery

**Forgot Password:**
1. Click "Forgot Password?" on login page
2. Enter your email address
3. Check email for reset link
4. Click link and set new password

**Reset Password:**
1. Use the link from your email
2. Enter new password
3. Confirm new password
4. Click "Reset Password"

#### Logout

**How to Logout:**
1. Click your profile avatar in the top-right corner
2. Select "Logout" from the dropdown menu
3. You'll be redirected to the login page

### Role-Based Access Control

| Feature | Admin | Client | Worker |
|---------|-------|--------|--------|
| View all projects | ✅ | ❌ (own only) | ❌ (assigned only) |
| Create projects | ✅ | ❌ | ❌ |
| Edit projects | ✅ | ❌ (own only) | ❌ |
| Delete projects | ✅ | ❌ | ❌ |
| Assign workers | ✅ | ❌ | ❌ |
| Create tasks | ✅ | ❌ | ❌ |
| View all users | ✅ | ❌ | ❌ |
| Send notifications | ✅ | ❌ | ❌ |
| Create invoices | ✅ | ❌ | ❌ |
| View own projects | ✅ | ✅ | ✅ |
| Chat with team | ✅ | ✅ | ✅ |
| Upload files | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ |

---

## Project Management

### Overview

Comprehensive project management system for tracking client work from initiation to completion.

### Features

#### Project List View

**Access:** `/projects`

**Features:**
- Grid or list view toggle
- Filter by status (active, completed, on hold, cancelled)
- Filter by client
- Filter by worker
- Search by project name
- Sort by created date, deadline, or name
- Pagination (15 projects per page)

#### Project Details

**Access:** `/project-details/:id`

**Information Displayed:**
- Project name and description
- Status and progress percentage
- Client information
- Assigned workers
- Budget and hours tracked
- Deadline
- Project type (web, mobile, desktop, etc.)
- Created and updated dates

#### Create Project (Admin Only)

**Required Fields:**
- Project Name
- Client (dropdown selection)

**Optional Fields:**
- Description
- Status (default: active)
- Budget
- Deadline
- Project Type
- Assigned Workers

#### Edit Project

**Who Can Edit:**
- Admins: All projects
- Clients: Their own projects only

**Editable Fields:**
- All project details except client assignment

#### Delete Project

**Who Can Delete:** Admins only

**Warning:** Deleting a project will also delete all associated tasks, files, and messages.

### User Guide

**Creating a Project:**
1. Navigate to **Projects**
2. Click "New Project" button
3. Fill in project details
4. Select client from dropdown
5. (Optional) Assign workers
6. Click "Create Project"

**Assigning Workers:**
1. Open project details
2. Click "Assign Workers" tab
3. Search and select workers
4. Click "Assign"

**Viewing Project Progress:**
- Progress bar shows completion percentage
- Calculated based on completed tasks / total tasks
- Updated automatically as tasks are completed

---

## Task Management

### Overview

Task management system with Kanban boards, assignments, and progress tracking.

### Features

#### Task List View

**Access:** `/tasks`

**View Options:**
- **List View:** Table with all task details
- **Kanban Board:** Columns by status (todo, in_progress, review, completed)
- **Calendar View:** Tasks by deadline (planned)

**Filters:**
- Status (todo, in_progress, review, completed)
- Priority (low, medium, high, urgent)
- Assigned to (specific worker)
- Due date range
- Project

#### Task Details

**Information:**
- Title and description
- Status and priority
- Assigned worker
- Project association
- Deadline
- Time tracking info
- Attachments
- Comments/activity log

#### Create Task (Admin Only)

**Required Fields:**
- Task Title
- Project

**Optional Fields:**
- Description
- Assigned To
- Priority (default: medium)
- Status (default: todo)
- Deadline
- Estimated hours

#### Update Task Progress

**Workers Can:**
- Update task status
- Log time spent
- Add comments
- Upload attachments

**Status Workflow:**
```
todo → in_progress → review → completed
```

#### My Tasks View

**Access:** `/tasks/my`

**Features:**
- Shows only tasks assigned to the logged-in user
- Sorted by priority and deadline
- Quick status update buttons
- Time tracking integration

### User Guide

**Moving Tasks in Kanban:**
1. Click and drag task card
2. Drop into new status column
3. Status updates automatically

**Starting Time Tracking:**
1. Open task details
2. Click "Start Timer" button
3. Timer runs in background
4. Click "Stop Timer" when done
5. Time is logged automatically

**Adding Task Comments:**
1. Scroll to comments section
2. Type your message
3. Click "Post Comment"
4. Team members are notified

---

## Time Tracking

### Overview

Built-in time tracking for accurate project billing and productivity metrics.

### Features

#### Timer Functionality

**Start Timer:**
- Click "Start Timer" on task
- Timer runs in real-time
- Shows elapsed time
- Can run in background

**Stop Timer:**
- Click "Stop Timer"
- Time is automatically logged
- Associated with task and user

**Manual Time Entry:**
- Add time logs manually
- Specify date, duration, and description
- Useful for offline work

#### Time Logs

**View Time Logs:**
- By task
- By project
- By user
- By date range

**Export Options:**
- CSV export (planned)
- PDF timesheet (planned)

#### Time Reports

**Metrics:**
- Total hours per project
- Hours per worker
- Billable vs non-billable hours
- Overtime tracking

### User Guide

**Tracking Time:**
1. Navigate to your task
2. Click "Start Timer"
3. Work on your task
4. Click "Stop Timer" when done
5. Time is saved automatically

**Adding Manual Time:**
1. Open task details
2. Click "Add Time Log"
3. Enter date and duration
4. Add description (optional)
5. Click "Save"

---

## Chat & Messaging

### Overview

Real-time messaging system for team communication, powered by Laravel Reverb WebSocket.

### Features

#### Conversation Types

**Private Messages:**
- One-on-one conversations
- Typing indicators
- Read receipts
- Message history

**Project Channels:**
- Group conversations by project
- All project members included
- Persistent chat history
- File sharing support

#### Message Features

**Supported Content:**
- Text messages
- Emoji reactions
- File attachments
- Message threading (planned)

**Message Actions:**
- Edit (within 5 minutes)
- Delete (own messages)
- React with emoji
- Mark as unread
- Search messages

#### Real-time Features

**Typing Indicators:**
- Shows when someone is typing
- Updates in real-time
- Disappears when typing stops

**Read Receipts:**
- Shows when messages are read
- Timestamp for each message
- Per-user read status in group chats

**Online Status:**
- Green dot for online users
- Last seen timestamp
- Away detection

### User Guide

**Sending a Message:**
1. Navigate to **Messages**
2. Select conversation or start new one
3. Type your message
4. Press Enter or click Send

**Starting a New Conversation:**
1. Click "New Message" button
2. Search for user
3. Select user
4. Start chatting

**Sending Files:**
1. Click attachment icon
2. Select file (max 10MB)
3. Add optional message
4. Click Send

**Searching Messages:**
1. Click search icon
2. Enter search term
3. Filter by conversation (optional)
4. View results

---

## File Management

### Overview

Centralized file storage for project documents, assets, and deliverables.

### Features

#### File Upload

**Supported Methods:**
- Drag and drop
- File picker dialog
- Bulk upload (multiple files)

**File Limits:**
- Maximum size: 10MB per file
- Supported types: All (validated by backend)
- Storage: Cloud or local (based on backend config)

#### File Organization

**File List View:**
- File name and type icon
- File size (formatted)
- Upload date
- Uploaded by
- Download count (planned)

**Filters:**
- By project
- By file type (PDF, images, documents, etc.)
- By upload date
- By uploader

#### File Actions

**Available Actions:**
- Download
- Preview (for supported types)
- Rename (uploader/admin only)
- Delete (uploader/admin only)
- Share link (planned)

### User Guide

**Uploading Files:**
1. Navigate to **Files**
2. Click "Upload File" or drag files
3. Select files to upload
4. (Optional) Add to project
5. Click "Upload"

**Downloading Files:**
1. Find the file in the list
2. Click download icon
3. File downloads to your device

**Previewing Files:**
1. Click on file name
2. Preview opens in modal
3. Supported: Images, PDFs, text files

**Deleting Files:**
1. Click delete icon next to file
2. Confirm deletion
3. File is permanently deleted

---

## Service Orders

### Overview

Service order management for client requests and custom work.

### Features

#### Service Order List

**Access:** `/services`

**Information Displayed:**
- Order name and number
- Status (pending, processing, completed, cancelled)
- Client name
- Assigned worker
- Created date
- Last updated date

#### Service Order Details

**Full Details Include:**
- Order number (auto-generated: SO-XXXXXXXXXX)
- Client information
- Worker assignment
- Requirements (JSON format)
- Status history
- Timeline

#### Create Service Order (Client/Admin)

**Required Fields:**
- Service Name
- Requirements

**Requirements Examples:**
```json
{
  "style": "modern minimalist",
  "quantity": 10,
  "format": "PNG, SVG",
  "colors": ["blue", "white"],
  "deliverables": ["source files", "web ready"]
}
```

#### Update Service Order

**Who Can Update:**
- Admin: All orders
- Client: Their own orders
- Worker: Assigned orders (limited)

**Updateable Fields:**
- Name
- Status
- Worker assignment
- Requirements

### User Guide

**Creating a Service Order:**
1. Navigate to **Services**
2. Click "New Service Order"
3. Enter service name
4. Describe requirements in detail
5. Click "Create Order"

**Updating Order Status:**
1. Open order details
2. Click status dropdown
3. Select new status
4. Status updates immediately

**Assigning a Worker:**
1. Admin opens order details
2. Click "Assign Worker"
3. Select worker from dropdown
4. Worker is notified

---

## Billing & Invoices

### Overview

Invoice management system for billing clients and tracking payments.

### Features

#### Invoice List

**Access:** `/billing`

**Filters:**
- Status (pending, paid, overdue)
- Client
- Project
- Date range

**Information:**
- Invoice number
- Client name
- Project (if applicable)
- Amount
- Issue date
- Due date
- Status badge

#### Invoice Details

**Full Invoice Includes:**
- Invoice number
- Client details
- Project association
- Line items
- Subtotal
- Tax (if applicable)
- Total amount
- Payment status
- Payment history

#### Create Invoice (Admin Only)

**Required Fields:**
- Client
- Issue Date
- Due Date
- Amount

**Optional Fields:**
- Project association
- Line items/description
- Tax rate
- Notes
- Attachment (PDF)

#### Invoice Statuses

| Status | Description |
|--------|-------------|
| **Pending** | Awaiting payment |
| **Paid** | Payment received |
| **Overdue** | Past due date |

### User Guide

**Creating an Invoice:**
1. Navigate to **Billing**
2. Click "New Invoice"
3. Select client
4. Enter amount and dates
5. (Optional) Add line items
6. Click "Create Invoice"

**Viewing Invoice:**
1. Click on invoice in list
2. View full details
3. Download PDF (if attached)

**Marking as Paid (Admin):**
1. Open invoice details
2. Click "Mark as Paid"
3. Enter payment date
4. Status updates to "paid"

---

## Notifications

### Overview

Real-time notification system keeping users informed of important events.

### Features

#### Notification Types

**System-Generated:**
- **Task Assigned** - When you're assigned to a task
- **New Message** - When you receive a message
- **Task Status Updated** - When task status changes
- **Project Updated** - When project details change

**Manual (Admin Only):**
- **Announcements** - Company-wide messages
- **Reminders** - Task or deadline reminders
- **Alerts** - Urgent notifications

#### Notification Delivery

**Channels:**
- **In-App** - Notification bell in top nav
- **Email** - Optional, configured per notification

#### Notification Management

**Notification Center:**
- List of all notifications
- Filter by read/unread
- Filter by type
- Bulk actions

**Actions:**
- Mark as read
- Mark all as read
- Delete notification
- Navigate to related item

### User Guide

**Viewing Notifications:**
1. Click bell icon in top nav
2. Dropdown shows recent notifications
3. Red badge shows unread count
4. Click "View All" for full list

**Marking as Read:**
- Click notification to mark as read
- Or click "Mark all as read" button
- Read notifications have gray background

**Notification Settings:**
1. Navigate to **Settings** → **Notifications**
2. Toggle email notifications
3. Choose notification types
4. Save preferences

---

## User Profile

### Overview

User profile management with activity tracking and personal settings.

### Features

#### Profile Information

**Display Information:**
- Avatar (uploadable)
- Full name
- Email address
- Role
- Company (for clients)
- Phone number
- Bio/About

#### Activity Summary

**Metrics:**
- Tasks completed
- Projects worked on
- Hours logged
- Messages sent
- Account age

#### Avatar Upload

**Supported Formats:**
- JPG, PNG, GIF
- Maximum size: 2MB
- Auto-cropped to square

### User Guide

**Viewing Profile:**
1. Click avatar in top nav
2. Select "Profile"
3. View your information

**Editing Profile:**
1. Navigate to **Profile**
2. Click "Edit Profile"
3. Update fields
4. Click "Save Changes"

**Uploading Avatar:**
1. Click camera icon on avatar
2. Select image file
3. Crop if needed
4. Click "Upload"

---

## Settings

### Overview

Account settings for managing security, privacy, and preferences.

### Features

#### Account Security

**Password Change:**
- Current password verification
- New password (min 8 characters)
- Password strength indicator
- Confirmation required

**Two-Factor Authentication (Planned):**
- Enable/disable 2FA
- QR code setup
- Backup codes

**Active Sessions:**
- List of active login sessions
- Device and location info
- Remote logout option

#### Privacy & Data

**Data Export:**
- Export personal data
- JSON or CSV format
- Includes all user activity

**Account Deletion:**
- Request account deletion
- Admin approval required
- Data retention policy

#### Preferences

**Display Settings:**
- Language selection (planned)
- Date format
- Time zone
- Notification preferences

#### Notification Settings

**Email Notifications:**
- Task assignments
- New messages
- Project updates
- Announcements

**In-App Notifications:**
- All notification types
- Sound alerts
- Desktop notifications (planned)

### User Guide

**Changing Password:**
1. Navigate to **Settings** → **Account Security**
2. Click "Change Password"
3. Enter current password
4. Enter new password twice
5. Click "Update Password"

**Managing Notifications:**
1. Navigate to **Settings** → **Notifications**
2. Toggle desired notification types
3. Choose email or in-app
4. Click "Save"

**Exporting Data:**
1. Navigate to **Settings** → **Privacy & Data**
2. Click "Export Data"
3. Wait for email with download link
4. Download within 7 days

---

## Keyboard Shortcuts (Planned)

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Quick search |
| `Ctrl/Cmd + N` | New message |
| `Ctrl/Cmd + Enter` | Send message |
| `Esc` | Close modal |
| `?` | Show keyboard shortcuts |

---

## Mobile Responsiveness

All features are fully responsive and work on:
- **Desktop:** 1024px and above
- **Tablet:** 768px - 1023px
- **Mobile:** 320px - 767px

**Mobile-Specific Features:**
- Hamburger menu for navigation
- Touch-optimized interactions
- Swipe gestures for actions
- Bottom sheet modals

---

## Accessibility

XenonOS is designed with accessibility in mind:
- **WCAG 2.1 AA** compliance target
- Keyboard navigation support
- Screen reader compatible
- High contrast mode (planned)
- Focus indicators
- ARIA labels throughout

---

**Last Updated:** March 24, 2026  
**Maintained by:** Xenon Studios (Tasin, Munthasir)
