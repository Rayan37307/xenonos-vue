import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tasksAPI } from '@/services/api'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const currentTask = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const todoTasks = computed(() => tasks.value.filter(t => t.status === 'todo'))
  const inProgressTasks = computed(() => tasks.value.filter(t => t.status === 'in_progress'))
  const reviewTasks = computed(() => tasks.value.filter(t => t.status === 'review'))
  const completedTasks = computed(() => tasks.value.filter(t => t.status === 'completed'))

  async function fetchTasks(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await tasksAPI.list(params)
      tasks.value = response.data
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchTask(id) {
    loading.value = true
    error.value = null
    try {
      const response = await tasksAPI.get(id)
      currentTask.value = response.data
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch task'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function createTask(taskData) {
    loading.value = true
    error.value = null
    try {
      const response = await tasksAPI.create(taskData)
      tasks.value.unshift(response.data)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create task'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id, taskData) {
    loading.value = true
    error.value = null
    try {
      const response = await tasksAPI.update(id, taskData)
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      if (currentTask.value?.id === id) {
        currentTask.value = response.data
      }
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update task'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id) {
    loading.value = true
    error.value = null
    try {
      await tasksAPI.delete(id)
      tasks.value = tasks.value.filter(t => t.id !== id)
      if (currentTask.value?.id === id) {
        currentTask.value = null
      }
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete task'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function assignTask(taskId, workerId) {
    loading.value = true
    error.value = null
    try {
      const response = await tasksAPI.assign(taskId, workerId)
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      if (currentTask.value?.id === taskId) {
        currentTask.value = response.data
      }
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to assign task'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateTaskProgress(taskId, progress) {
    loading.value = true
    error.value = null
    try {
      const response = await tasksAPI.updateProgress(taskId, progress)
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      if (currentTask.value?.id === taskId) {
        currentTask.value = response.data
      }
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update progress'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  function clearCurrentTask() {
    currentTask.value = null
  }

  function clearError() {
    error.value = null
  }

  return {
    tasks,
    currentTask,
    loading,
    error,
    todoTasks,
    inProgressTasks,
    reviewTasks,
    completedTasks,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    updateTaskProgress,
    clearCurrentTask,
    clearError
  }
})
