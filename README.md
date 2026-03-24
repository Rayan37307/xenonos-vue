# XenonOS Vue - Premium Client Management Dashboard

[![Vue 3](https://img.shields.io/badge/Vue-3.5.30-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0.1-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2.2-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-3.0.4-FFDD00?logo=pinia)](https://pinia.vuejs.org/)

> **Premium Client Dashboard** built for agency management - handling clients, projects, tasks, billing, and team collaboration in one unified platform.

![Dashboard Demo](./public/demo-dashboard.gif)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **pnpm** 8+ (recommended) or npm
- **Backend API** running (see [API Integration Guide](./API_INTEGRATION.md))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd xenonos-vue

# Install dependencies
pnpm install

# Copy environment configuration
cp .env.example .env

# Update .env with your API URL
VITE_API_URL=http://localhost:8000/api

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build optimized production bundle
pnpm build

# Preview production build locally
pnpm preview
```

---

## 📦 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Vue 3.5.30 (Composition API) |
| **Build Tool** | Vite 8.0.1 |
| **Styling** | Tailwind CSS 4.2.2 |
| **State Management** | Pinia 3.0.4 |
| **Routing** | Vue Router 5.0.4 |
| **HTTP Client** | Axios 1.13.6 |
| **Icons** | Lucide Vue 0.57.0 |
| **Backend** | Laravel 12 API (separate project) |
| **Auth** | Laravel Sanctum |

---

## 📁 Project Structure

```
xenonos-vue/
├── public/                    # Static assets
│   ├── favicon.svg
│   └── demo-dashboard.gif
├── src/
│   ├── components/           # Reusable Vue components
│   │   ├── AppLayout.vue    # Main layout wrapper
│   │   ├── AppSidebar.vue   # Navigation sidebar
│   │   └── AppTopNav.vue    # Top navigation bar
│   ├── router/              # Vue Router configuration
│   │   └── index.js
│   ├── services/            # API service layer
│   │   └── api.js
│   ├── stores/              # Pinia state stores
│   │   ├── auth.js         # Authentication state
│   │   ├── dashboard.js    # Dashboard data
│   │   ├── notifications.js # Notifications state
│   │   ├── projects.js     # Projects state
│   │   └── profile.js      # User profile state
│   ├── views/              # Page components (lazy-loaded)
│   │   ├── Dashboard.vue
│   │   ├── Login.vue
│   │   ├── Signup.vue
│   │   ├── Projects.vue
│   │   ├── ProjectDetails.vue
│   │   ├── Tasks.vue
│   │   ├── Messages.vue
│   │   ├── Files.vue
│   │   ├── Services.vue
│   │   ├── Billing.vue
│   │   ├── Notifications.vue
│   │   ├── Profile.vue
│   │   └── Settings.vue
│   ├── App.vue             # Root component
│   ├── main.js             # Application entry point
│   └── style.css           # Global styles + Tailwind
├── .env                    # Environment variables
├── .env.example            # Environment template
├── index.html              # HTML entry point
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── README.md               # This file
├── SPECS.md                # Technical specifications
├── FEATURES.md             # Feature documentation
├── DEPLOYMENT.md           # Deployment guide
└── API_INTEGRATION.md      # API integration guide
```

---

## 🎯 Key Features

- **📊 Dashboard Analytics** - Real-time project stats, task overview, team bandwidth
- **📁 Project Management** - Create, assign, and track projects with worker assignments
- **✅ Task Management** - Kanban boards, task assignments, progress tracking
- **⏱️ Time Tracking** - Timer functionality, time logs, productivity metrics
- **💬 Chat & Messaging** - Real-time team communication via WebSocket
- **📄 File Management** - Upload, organize, and share project files
- **🛒 Service Orders** - Manage client service requests and orders
- **💰 Billing & Invoices** - Create and track invoices, payment status
- **🔔 Notifications** - Real-time notifications with email integration
- **👤 User Profiles** - Profile management, activity tracking, avatar upload
- **🔐 Authentication** - Secure login with Laravel Sanctum tokens

---

## 👥 Contributors

- **Tasin** - Xenon Studios
- **Munthasir** - Xenon Studios

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README](./README.md) | Quick start and overview (this file) |
| [SPECS.md](./SPECS.md) | Technical specifications and architecture |
| [FEATURES.md](./FEATURES.md) | Feature documentation for users |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment and production guide |
| [API_INTEGRATION.md](./API_INTEGRATION.md) | Frontend-backend integration guide |

---

## 🔐 Authentication

The application uses **Laravel Sanctum** for API authentication with token-based sessions stored in localStorage.

### Demo Login Credentials

After running database seeders on the backend:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@xenon.com | password |
| Client | client@xenon.com | password |
| Worker | alice@xenon.com | password |

---

## 🎨 Design System

Custom theme tokens are defined in `src/style.css`:

```css
:root {
  --color-surface: #ffffff;      /* Main background */
  --color-primary: #6366f1;      /* Primary accent (indigo) */
  --color-on-surface: #1a1a1a;   /* Text color */
}
```

**Typography:**
- **Body**: Outfit
- **Headlines**: Syne
- **Labels**: Ubuntu

---

## 📄 License

**Proprietary** - Xenon Studios © 2026

All rights reserved. This software is confidential and proprietary to Xenon Studios.

---

## 🆘 Support

For issues, questions, or support requests, contact the Xenon Studios team.

---

**Built with ❤️ by Xenon Studios**
