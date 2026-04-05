import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { listClients, getClient, createClient, updateClient, deleteClient, getClientStats } from '@/services/api'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref([])
  const currentClient = ref(null)
  const clientStats = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  const activeClients = computed(() => clients.value.filter(c => c.status === 'active'))
  const inactiveClients = computed(() => clients.value.filter(c => c.status === 'inactive'))

  function mapClient(apiClient) {
    return {
      id: apiClient.id,
      user_id: apiClient.user_id,
      company_name: apiClient.company_name || 'N/A',
      phone: apiClient.phone,
      address: apiClient.address,
      status: apiClient.status,
      notes: apiClient.notes,
      user: apiClient.user ? {
        id: apiClient.user.id,
        name: apiClient.user.name,
        email: apiClient.user.email,
        avatar: apiClient.user.avatar
      } : null,
      projects_count: apiClient.projects_count || 0,
      invoices_count: apiClient.invoices_count || 0,
      service_orders_count: apiClient.service_orders_count || 0,
      created_at: apiClient.created_at,
      updated_at: apiClient.updated_at
    }
  }

  async function fetchClients(filters = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await listClients(filters)
      const apiClients = response.clients?.data || response.clients || []
      clients.value = apiClients.map(mapClient)
      pagination.value = {
        current_page: response.meta?.current_page || 1,
        last_page: response.meta?.last_page || 1,
        per_page: response.meta?.per_page || 15,
        total: response.meta?.total || 0
      }
      return clients.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load clients'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchClient(id) {
    loading.value = true
    error.value = null
    try {
      const response = await getClient(id)
      currentClient.value = mapClient(response.client || response.data || response)
      return currentClient.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load client'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createNewClient(data) {
    loading.value = true
    error.value = null
    try {
      const response = await createClient(data)
      const newClient = mapClient(response.client || response.data || response)
      clients.value.unshift(newClient)
      return newClient
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create client'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateClientData(id, data) {
    error.value = null
    try {
      const response = await updateClient(id, data)
      const updatedClient = mapClient(response.client || response.data || response)
      const index = clients.value.findIndex(c => c.id === id)
      if (index !== -1) {
        clients.value[index] = updatedClient
      }
      if (currentClient.value?.id === id) {
        currentClient.value = updatedClient
      }
      return updatedClient
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update client'
      throw err
    }
  }

  async function removeClient(id) {
    error.value = null
    try {
      await deleteClient(id)
      clients.value = clients.value.filter(c => c.id !== id)
      if (currentClient.value?.id === id) {
        currentClient.value = null
      }
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete client'
      throw err
    }
  }

  async function fetchClientStats(id) {
    try {
      const response = await getClientStats(id)
      clientStats.value = response.stats || response.data || response
      return clientStats.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load client stats'
      throw err
    }
  }

  function clearClients() {
    clients.value = []
    currentClient.value = null
    clientStats.value = null
    error.value = null
  }

  return {
    clients,
    currentClient,
    clientStats,
    loading,
    error,
    pagination,
    activeClients,
    inactiveClients,
    fetchClients,
    fetchClient,
    createNewClient,
    updateClientData,
    removeClient,
    fetchClientStats,
    clearClients
  }
})
