import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { listProjects, getProject, getMyProjects, createProject, updateProject, deleteProject } from '@/services/api'

export const useProjectsStore = defineStore('projects', () => {
  // State
  const projects = ref([])
  const currentProject = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })
  const stats = ref({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0
  })

  // Computed
  const activeProjects = computed(() => {
    return projects.value.filter(p => p.status === 'active')
  })

  const completedProjects = computed(() => {
    return projects.value.filter(p => p.status === 'completed')
  })

  const pendingProjects = computed(() => {
    return projects.value.filter(p => p.status === 'pending')
  })

  // Helper to map API project to frontend format
  function mapProject(apiProject) {
    return {
      id: apiProject.id,
      title: apiProject.name || apiProject.title,
      description: apiProject.description,
      status: apiProject.status,
      progress: apiProject.progress || 0,
      client_id: apiProject.client_id,
      client_name: apiProject.client?.name || 'Unknown Client',
      budget: apiProject.budget,
      deadline: apiProject.deadline,
      created_at: apiProject.created_at,
      updated_at: apiProject.updated_at,
      team: apiProject.workers?.map(w => w.avatar || `https://i.pravatar.cc/150?u=${w.id}`) || [],
      icon: getProjectIcon(apiProject.type || 'default')
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

  // Actions
  async function fetchProjects(filters = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await listProjects(filters)
      const apiProjects = response.projects?.data || response.projects || []
      projects.value = apiProjects.map(mapProject)
      pagination.value = {
        current_page: response.meta?.current_page || 1,
        last_page: response.meta?.last_page || 1,
        per_page: response.meta?.per_page || 15,
        total: response.meta?.total || 0
      }
      
      // Update stats
      stats.value = {
        total: projects.value.length,
        active: projects.value.filter(p => p.status === 'active').length,
        completed: projects.value.filter(p => p.status === 'completed').length,
        pending: projects.value.filter(p => p.status === 'pending').length
      }
      
      return projects.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load projects'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMyProjects(filters = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await getMyProjects(filters)
      const apiProjects = response.projects?.data || response.projects || []
      projects.value = apiProjects.map(mapProject)
      pagination.value = {
        current_page: response.meta?.current_page || 1,
        last_page: response.meta?.last_page || 1,
        per_page: response.meta?.per_page || 15,
        total: response.meta?.total || 0
      }
      return projects.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load my projects'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchProject(id) {
    loading.value = true
    error.value = null
    try {
      const response = await getProject(id)
      currentProject.value = mapProject(response.project || response.data || response)
      return currentProject.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load project'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createNewProject(data) {
    loading.value = true
    error.value = null
    try {
      const response = await createProject(data)
      const newProject = mapProject(response.project || response.data || response)
      projects.value.unshift(newProject)
      return newProject
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create project'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProjectData(id, data) {
    error.value = null
    try {
      const response = await updateProject(id, data)
      const updatedProject = mapProject(response.project || response.data || response)
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = updatedProject
      }
      if (currentProject.value?.id === id) {
        currentProject.value = updatedProject
      }
      return updatedProject
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update project'
      throw err
    }
  }

  async function removeProject(id) {
    error.value = null
    try {
      await deleteProject(id)
      projects.value = projects.value.filter(p => p.id !== id)
      if (currentProject.value?.id === id) {
        currentProject.value = null
      }
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete project'
      throw err
    }
  }

  function clearProjects() {
    projects.value = []
    currentProject.value = null
    error.value = null
  }

  return {
    projects,
    currentProject,
    loading,
    error,
    pagination,
    stats,
    activeProjects,
    completedProjects,
    pendingProjects,
    fetchProjects,
    fetchMyProjects,
    fetchProject,
    createNewProject,
    updateProjectData,
    removeProject,
    clearProjects
  }
})
