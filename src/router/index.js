import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy load views for better performance
const Dashboard = () => import('@/views/Dashboard.vue')
const Login = () => import('@/views/Login.vue')
const Signup = () => import('@/views/Signup.vue')
const ForgotPassword = () => import('@/views/ForgotPassword.vue')
const ResetPassword = () => import('@/views/ResetPassword.vue')
const Messages = () => import('@/views/Messages.vue')
const Projects = () => import('@/views/Projects.vue')
const ProjectDetails = () => import('@/views/ProjectDetails.vue')
const Files = () => import('@/views/Files.vue')
const Services = () => import('@/views/Services.vue')
const Billing = () => import('@/views/Billing.vue')
const Profile = () => import('@/views/Profile.vue')
const Notifications = () => import('@/views/Notifications.vue')
const NotificationDetails = () => import('@/views/NotificationDetails.vue')
const NotificationsSettings = () => import('@/views/NotificationsSettings.vue')
const Settings = () => import('@/views/Settings.vue')
const AccountSecurity = () => import('@/views/AccountSecurity.vue')
const PrivacyData = () => import('@/views/PrivacyData.vue')
const PreferencesInfo = () => import('@/views/PreferencesInfo.vue')
const Clients = () => import('@/views/Clients.vue')
const ClientDetails = () => import('@/views/ClientDetails.vue')

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
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
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/messages',
    name: 'Messages',
    component: Messages,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
    meta: { requiresAuth: true }
  },
  {
    path: '/project-details',
    name: 'ProjectDetails',
    component: ProjectDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/files',
    name: 'Files',
    component: Files,
    meta: { requiresAuth: true }
  },
  {
    path: '/services',
    name: 'Services',
    component: Services,
    meta: { requiresAuth: true }
  },
  {
    path: '/billing',
    name: 'Billing',
    component: Billing,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications,
    meta: { requiresAuth: true }
  },
  {
    path: '/notification-details/:id?',
    name: 'NotificationDetails',
    component: NotificationDetails,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/notifications-settings',
    name: 'NotificationsSettings',
    component: NotificationsSettings,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/account-security',
    name: 'AccountSecurity',
    component: AccountSecurity,
    meta: { requiresAuth: true }
  },
  {
    path: '/privacy-data',
    name: 'PrivacyData',
    component: PrivacyData,
    meta: { requiresAuth: true }
  },
  {
    path: '/preferences',
    name: 'PreferencesInfo',
    component: PreferencesInfo,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients',
    name: 'Clients',
    component: Clients,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/:id',
    name: 'ClientDetails',
    component: ClientDetails,
    meta: { requiresAuth: true },
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
