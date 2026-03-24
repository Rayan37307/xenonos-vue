import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } from '@/services/api'

export const useNotificationsStore = defineStore('notifications', () => {
  // State
  const notifications = ref([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.read_at)
  })

  const readNotifications = computed(() => {
    return notifications.value.filter(n => n.read_at)
  })

  // Helper to map API notification to frontend format
  function mapNotification(apiNotification) {
    const typeIcons = {
      'task_assigned': { icon: 'CheckCircle2', bgClass: 'bg-emerald-500/10 border border-emerald-500/20', textClass: 'text-emerald-400' },
      'new_message': { icon: 'Info', bgClass: 'bg-blue-500/10 border border-blue-500/20', textClass: 'text-blue-400' },
      'task_status_updated': { icon: 'AlertCircle', bgClass: 'bg-amber-500/10 border border-amber-500/20', textClass: 'text-amber-400' },
      'announcement': { icon: 'Info', bgClass: 'bg-blue-500/10 border border-blue-500/20', textClass: 'text-blue-400' },
      'reminder': { icon: 'Clock', bgClass: 'bg-purple-500/10 border border-purple-500/20', textClass: 'text-purple-400' },
      'alert': { icon: 'AlertTriangle', bgClass: 'bg-red-500/10 border border-red-500/20', textClass: 'text-red-400' },
      'custom': { icon: 'Info', bgClass: 'bg-blue-500/10 border border-blue-500/20', textClass: 'text-blue-400' },
    }

    const iconConfig = typeIcons[apiNotification.type] || typeIcons['custom']

    return {
      id: apiNotification.id,
      type: apiNotification.type,
      title: apiNotification.title,
      message: apiNotification.message,
      data: apiNotification.data || {},
      read_at: apiNotification.read_at,
      created_at: apiNotification.created_at,
      unread: !apiNotification.read_at,
      icon: iconConfig.icon,
      bgClass: iconConfig.bgClass,
      textClass: iconConfig.textClass,
      time: formatTimeAgo(apiNotification.created_at)
    }
  }

  function formatTimeAgo(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return date.toLocaleDateString()
  }

  // Actions
  async function fetchNotifications(includeRead = false) {
    loading.value = true
    error.value = null
    try {
      const response = await getNotifications(includeRead)
      const apiNotifications = response.notifications || response.data || []
      notifications.value = apiNotifications.map(mapNotification)
      return notifications.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load notifications'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUnreadCount() {
    try {
      const response = await getUnreadCount()
      unreadCount.value = response.unread_count || response.data?.unread_count || 0
      return unreadCount.value
    } catch (err) {
      console.error('Failed to fetch unread count:', err)
      return 0
    }
  }

  async function markNotificationAsRead(notificationId) {
    try {
      await markAsRead(notificationId)
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read_at = new Date().toISOString()
        notification.unread = false
      }
      await fetchUnreadCount()
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to mark notification as read'
      throw err
    }
  }

  async function markAllNotificationsAsRead() {
    try {
      const response = await markAllAsRead()
      notifications.value.forEach(n => {
        if (n.unread) {
          n.read_at = new Date().toISOString()
          n.unread = false
        }
      })
      await fetchUnreadCount()
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to mark all notifications as read'
      throw err
    }
  }

  async function removeNotification(notificationId) {
    try {
      await deleteNotification(notificationId)
      notifications.value = notifications.value.filter(n => n.id !== notificationId)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete notification'
      throw err
    }
  }

  function clearNotifications() {
    notifications.value = []
    unreadCount.value = 0
    error.value = null
  }

  return {
    notifications,
    unreadCount,
    loading,
    error,
    unreadNotifications,
    readNotifications,
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    clearNotifications
  }
})
