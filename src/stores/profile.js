import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getProfile, updateProfile, updateAvatar, getActivitySummary } from '@/services/api'

export const useProfileStore = defineStore('profile', () => {
  // State
  const profile = ref(null)
  const activitySummary = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const saving = ref(false)

  // Computed
  const isAuthenticated = computed(() => !!profile.value)
  
  const profileCompletion = computed(() => {
    if (!profile.value) return 0
    
    let completed = 0
    const total = 6

    if (profile.value.first_name) completed++
    if (profile.value.last_name) completed++
    if (profile.value.email) completed++
    if (profile.value.phone) completed++
    if (profile.value.avatar_url) completed++
    if (profile.value.company_name) completed++

    return Math.round((completed / total) * 100)
  })

  // Actions
  async function fetchProfile() {
    loading.value = true
    error.value = null
    try {
      const response = await getProfile()
      const user = response.user || response.data || response
      
      profile.value = {
        id: user.id || null,
        name: user.name || '',
        first_name: user.first_name || user.name?.split(' ')[0] || '',
        last_name: user.last_name || user.name?.split(' ')[1] || '',
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || '',
        avatar_url: user.avatar_url || user.avatar || '',
        role: user.role || '',
        company_name: user.company_name || '',
      }
      
      return profile.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load profile'
      console.error('Failed to load profile:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function saveProfileData(payload) {
    saving.value = true
    error.value = null
    try {
      const response = await updateProfile(payload)
      const updatedUser = response.user || response.data || response
      
      // Update local state
      if (profile.value) {
        profile.value.first_name = updatedUser.first_name || profile.value.first_name
        profile.value.last_name = updatedUser.last_name || profile.value.last_name
        profile.value.email = updatedUser.email || profile.value.email
        profile.value.phone = updatedUser.phone || profile.value.phone
        profile.value.name = updatedUser.name || `${updatedUser.first_name} ${updatedUser.last_name}`.trim()
      }
      
      return updatedUser
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to save profile'
      console.error('Failed to save profile:', err)
      throw err
    } finally {
      saving.value = false
    }
  }

  async function uploadAvatar(file) {
    error.value = null
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file')
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB')
      }

      const formData = new FormData()
      formData.append('avatar', file)

      const response = await updateAvatar(formData)
      const avatarUrl = response.avatar_url || response.avatar || response.data?.avatar_url
      
      // Update local state
      if (profile.value) {
        profile.value.avatar_url = avatarUrl
      }
      
      return avatarUrl
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to upload avatar'
      console.error('Failed to upload avatar:', err)
      throw err
    }
  }

  async function fetchActivitySummary() {
    try {
      const response = await getActivitySummary()
      activitySummary.value = response.data || response
      return activitySummary.value
    } catch (err) {
      console.error('Failed to load activity summary:', err)
      throw err
    }
  }

  function clearProfile() {
    profile.value = null
    activitySummary.value = null
    error.value = null
    loading.value = false
    saving.value = false
  }

  return {
    // State
    profile,
    activitySummary,
    loading,
    error,
    saving,
    // Computed
    isAuthenticated,
    profileCompletion,
    // Actions
    fetchProfile,
    saveProfileData,
    uploadAvatar,
    fetchActivitySummary,
    clearProfile
  }
})
