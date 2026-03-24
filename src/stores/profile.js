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
      const user = response.user

      profile.value = {
        id: user.id,
        name: user.name,
        first_name: user.first_name || user.name?.split(' ')[0] || '',
        last_name: user.last_name || user.name?.split(' ')[1] || '',
        email: user.email,
        phone: user.phone_number || user.phone || '',
        username: user.username || '',
        avatar_url: user.avatar || user.profile_image_link || '',
        role: user.role,
        company_name: user.client_profile?.company_name || '',
      }

      return profile.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load profile'
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
      const user = response.user

      profile.value = {
        id: user.id,
        name: user.name,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email,
        phone: user.phone_number || user.phone || '',
        username: user.username || '',
        avatar_url: user.avatar || user.profile_image_link || '',
        role: user.role,
        company_name: user.client_profile?.company_name || '',
      }

      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to save profile'
      throw err
    } finally {
      saving.value = false
    }
  }

  async function uploadAvatar(file) {
    error.value = null
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file')
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB')
      }

      const formData = new FormData()
      formData.append('avatar', file)

      const response = await updateAvatar(formData)
      const user = response.user
      const avatarUrl = user.avatar || user.profile_image_link

      if (profile.value) {
        profile.value.avatar_url = avatarUrl
      }

      return avatarUrl
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to upload avatar'
      throw err
    }
  }

  async function fetchActivitySummary() {
    const response = await getActivitySummary()
    activitySummary.value = response.data || response
    return activitySummary.value
  }

  function clearProfile() {
    profile.value = null
    activitySummary.value = null
    error.value = null
    loading.value = false
    saving.value = false
  }

  return {
    profile,
    activitySummary,
    loading,
    error,
    saving,
    isAuthenticated,
    profileCompletion,
    fetchProfile,
    saveProfileData,
    uploadAvatar,
    fetchActivitySummary,
    clearProfile
  }
})
