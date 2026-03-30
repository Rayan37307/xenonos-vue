import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { getDashboardStats, getRecentProjects, getActiveTasks, listInvoices, listServices, listFiles, getNotifications } from '@/services/api'

export const useDashboardStore = defineStore('dashboard', () => {
  // State - using reactive for better stability
  const stats = reactive({
    totalProjects: 0,
    completionRate: 0,
    ongoingTasks: 0,
    teamBandwidth: 0,
    tasksDueToday: 0
  })
  const recentProjects = ref([])
  const activeTasks = ref([])
  const recentInvoices = ref([])
  const recentServices = ref([])
  const recentFiles = ref([])
  const recentNotifications = ref([])
  const activityFeed = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Helper to map API data to frontend format
  function mapProject(apiProject) {
    return {
      id: apiProject.id,
      name: apiProject.name || apiProject.title,
      description: apiProject.description || `Project with ${apiProject.task_count || 0} tasks`,
      status: apiProject.status || 'active',
      progress: apiProject.progress || apiProject.progress_percentage || 0,
      deadline: apiProject.deadline,
      team: apiProject.workers?.map(w => w.avatar || `https://i.pravatar.cc/150?u=${w.id}`) || [],
      icon: getProjectIcon(apiProject.type || apiProject.service_type || 'default')
    }
  }

  function mapTask(apiTask) {
    return {
      id: apiTask.id,
      title: apiTask.title,
      status: apiTask.status,
      priority: apiTask.priority,
      deadline: apiTask.deadline,
      project: apiProject?.name
    }
  }

  function mapInvoice(apiInvoice) {
    return {
      id: apiInvoice.id,
      amount: apiInvoice.amount,
      status: apiInvoice.status,
      dueDate: apiInvoice.due_date,
      invoiceNumber: apiInvoice.invoice_number
    }
  }

  function mapService(apiService) {
    return {
      id: apiService.id,
      name: apiService.name,
      status: apiService.status,
      orderNumber: apiService.order_number,
      created_at: apiService.created_at,
      icon: 'Folder'
    }
  }

  function mapFile(apiFile) {
    return {
      id: apiFile.id,
      name: apiFile.name,
      size: formatFileSize(apiFile.size),
      type: apiFile.mime_type,
      created_at: apiFile.created_at,
      icon: getFileIcon(apiFile.mime_type)
    }
  }

  function mapNotification(apiNotification) {
    const notificationData = apiNotification.data || {}
    return {
      id: apiNotification.id,
      title: notificationData.title || apiNotification.title || 'Notification',
      message: notificationData.message || apiNotification.message || '',
      created_at: apiNotification.created_at
    }
  }

  function getProjectIcon(type) {
    const icons = {
      'web': 'Zap',
      'mobile': 'Smartphone',
      'design': 'Palette',
      'backend': 'Server',
      'default': 'Folder'
    }
    return icons[type] || icons['default']
  }

  function getFileIcon(mimeType) {
    if (mimeType?.includes('pdf')) return 'FileText'
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('csv')) return 'FileSpreadsheet'
    if (mimeType?.includes('image')) return 'Image'
    return 'File'
  }

  function formatFileSize(bytes) {
    if (!bytes) return '0 KB'
    const k = 1024
    const sizes = ['KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  function formatTimeAgo(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Actions
  async function fetchDashboardData() {
    loading.value = true
    error.value = null
    try {
      console.log('[Dashboard Store] Fetching dashboard data...')
      
      // Fetch all data in parallel
      const [
        statsResponse,
        projectsResponse,
        tasksResponse,
        invoicesResponse,
        servicesResponse,
        filesResponse,
        notificationsResponse
      ] = await Promise.allSettled([
        getDashboardStats(),
        getRecentProjects(),
        getActiveTasks(),
        listInvoices({ limit: 5 }).catch(() => ({ data: [] })),
        listServices({ limit: 5 }).catch(() => ({ data: [] })),
        listFiles({ limit: 5 }).catch(() => ({ data: [] })),
        getNotifications(false).catch(() => ({ data: [] }))
      ])

      console.log('[Dashboard Store] Raw responses:', {
        stats: statsResponse,
        projects: projectsResponse,
        tasks: tasksResponse,
        invoices: invoicesResponse,
        services: servicesResponse,
        files: filesResponse,
        notifications: notificationsResponse
      })

      // Process stats - API returns { analytics: { overview: {...} } }
      if (statsResponse.status === 'fulfilled') {
        const responseData = statsResponse.value
        // Handle different response structures
        const analyticsData = responseData.analytics || responseData.data?.analytics || responseData.data || responseData
        const overview = analyticsData.overview || analyticsData
        
        console.log('[Dashboard Store] Stats overview:', overview)
        
        stats.totalProjects = overview.total_projects || 0
        stats.completionRate = overview.completion_rate || 0
        stats.ongoingTasks = overview.ongoing_tasks || overview.pending_tasks || 0
        stats.teamBandwidth = overview.team_bandwidth || 0
        stats.tasksDueToday = overview.tasks_due_today || 0
      }

      // Process recent projects - API returns { projects: [...] }
      if (projectsResponse.status === 'fulfilled') {
        const responseData = projectsResponse.value
        const projectsData = responseData.projects || responseData.data?.projects || responseData.data || []
        console.log('[Dashboard Store] Projects data:', projectsData)
        recentProjects.value = projectsData.slice(0, 2).map(mapProject)
      }

      // Process active tasks - API returns { tasks: [...] }
      if (tasksResponse.status === 'fulfilled') {
        const responseData = tasksResponse.value
        const tasksData = responseData.tasks || responseData.data?.tasks || responseData.data || []
        activeTasks.value = tasksData.slice(0, 5)
      }

      // Process invoices
      if (invoicesResponse.status === 'fulfilled') {
        const responseData = invoicesResponse.value
        const invoicesData = responseData.invoices || responseData.data?.invoices || responseData.data || []
        recentInvoices.value = invoicesData.slice(0, 1).map(mapInvoice)
      }

      // Process services
      if (servicesResponse.status === 'fulfilled') {
        const responseData = servicesResponse.value
        const servicesData = responseData.services || responseData.data?.services || responseData.data || []
        console.log('[Dashboard Store] Services data:', servicesData)
        recentServices.value = servicesData.slice(0, 3).map(mapService)
      }

      // Process files
      if (filesResponse.status === 'fulfilled') {
        const responseData = filesResponse.value
        const filesData = responseData.files || responseData.data?.files || responseData.data || []
        recentFiles.value = filesData.slice(0, 2).map(mapFile)
      }

      // Process notifications - API returns { notifications: [...] }
      if (notificationsResponse.status === 'fulfilled') {
        const responseData = notificationsResponse.value
        const notificationsData = responseData.notifications || responseData.data?.notifications || responseData.data || []
        recentNotifications.value = notificationsData.slice(0, 3).map(mapNotification)
      }

      // Generate activity feed from various sources
      generateActivityFeed()

      console.log('[Dashboard Store] Final state:', {
        stats,
        recentProjects: recentProjects.value,
        recentServices: recentServices.value,
        recentFiles: recentFiles.value,
        recentNotifications: recentNotifications.value
      })

      return {
        stats,
        projects: recentProjects.value,
        tasks: activeTasks.value
      }
    } catch (err) {
      error.value = err.message || 'Failed to load dashboard data'
      // Don't throw - allow UI to show empty state
      console.error('[Dashboard Store] Dashboard fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  function generateActivityFeed() {
    // Combine activities from different sources
    const activities = []

    // Add task completions
    activeTasks.value.forEach(task => {
      if (task.status === 'completed') {
        activities.push({
          type: 'task_completed',
          description: `Task "${task.title}" completed`,
          time: formatTimeAgo(task.updated_at || task.created_at),
          icon: 'CheckCircle'
        })
      }
    })

    // Add project updates
    recentProjects.value.forEach(project => {
      activities.push({
        type: 'project_update',
        description: `${project.name} progress updated`,
        time: formatTimeAgo(project.updated_at || project.created_at),
        icon: 'Folder'
      })
    })

    // Add notifications as activities
    recentNotifications.value.forEach(notification => {
      activities.push({
        type: 'notification',
        description: notification.title,
        time: formatTimeAgo(notification.created_at),
        icon: 'Bell'
      })
    })

    // Sort by time (most recent first) and limit
    activityFeed.value = activities.sort((a, b) => {
      return new Date(b.time) - new Date(a.time)
    }).slice(0, 5)
  }

  function clearDashboard() {
    stats.totalProjects = 0
    stats.completionRate = 0
    stats.ongoingTasks = 0
    stats.teamBandwidth = 0
    stats.tasksDueToday = 0
    recentProjects.value = []
    activeTasks.value = []
    recentInvoices.value = []
    recentServices.value = []
    recentFiles.value = []
    recentNotifications.value = []
    activityFeed.value = []
    error.value = null
  }

  return {
    stats,
    recentProjects,
    activeTasks,
    recentInvoices,
    recentServices,
    recentFiles,
    recentNotifications,
    activityFeed,
    loading,
    error,
    fetchDashboardData,
    clearDashboard
  }
})
