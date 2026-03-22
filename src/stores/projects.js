import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectsAPI } from '@/services/api'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const currentProject = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const activeProjects = computed(() => 
    projects.value.filter(p => p.status === 'active')
  )

  const completedProjects = computed(() => 
    projects.value.filter(p => p.status === 'completed')
  )

  async function fetchProjects(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await projectsAPI.list(params)
      projects.value = response.data
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch projects'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchProject(id) {
    loading.value = true
    error.value = null
    try {
      const response = await projectsAPI.get(id)
      currentProject.value = response.data
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch project'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function createProject(projectData) {
    loading.value = true
    error.value = null
    try {
      const response = await projectsAPI.create(projectData)
      projects.value.unshift(response.data)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create project'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateProject(id, projectData) {
    loading.value = true
    error.value = null
    try {
      const response = await projectsAPI.update(id, projectData)
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = response.data
      }
      if (currentProject.value?.id === id) {
        currentProject.value = response.data
      }
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update project'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function deleteProject(id) {
    loading.value = true
    error.value = null
    try {
      await projectsAPI.delete(id)
      projects.value = projects.value.filter(p => p.id !== id)
      if (currentProject.value?.id === id) {
        currentProject.value = null
      }
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete project'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function assignWorkers(projectId, workerIds) {
    loading.value = true
    error.value = null
    try {
      const response = await projectsAPI.assignWorkers(projectId, workerIds)
      const index = projects.value.findIndex(p => p.id === projectId)
      if (index !== -1) {
        projects.value[index] = response.data
      }
      if (currentProject.value?.id === projectId) {
        currentProject.value = response.data
      }
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to assign workers'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchProjectStatistics(projectId) {
    loading.value = true
    error.value = null
    try {
      const response = await projectsAPI.getStatistics(projectId)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch statistics'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchKanbanTasks(projectId) {
    loading.value = true
    error.value = null
    try {
      const response = await projectsAPI.getKanbanTasks(projectId)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch Kanban tasks'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function reorderTasks(projectId, taskOrder) {
    loading.value = true
    error.value = null
    try {
      const response = await projectsAPI.reorderTasks(projectId, taskOrder)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to reorder tasks'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  function clearCurrentProject() {
    currentProject.value = null
  }

  function clearError() {
    error.value = null
  }

  return {
    projects,
    currentProject,
    loading,
    error,
    activeProjects,
    completedProjects,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    assignWorkers,
    fetchProjectStatistics,
    fetchKanbanTasks,
    reorderTasks,
    clearCurrentProject,
    clearError
  }
})
