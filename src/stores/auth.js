import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const userEmail = ref(null)
  const userName = ref('Alex Rivera')
  const userAvatar = ref('https://i.pravatar.cc/150?u=alex')
  const user = ref(null)
  const authToken = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => isLoggedIn.value && !!authToken.value)
  const currentUser = computed(() => user.value)

  function login(email) {
    isLoggedIn.value = true
    userEmail.value = email
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userEmail', email)
  }

  function logout() {
    isLoggedIn.value = false
    userEmail.value = null
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
  }

  function initAuth() {
    const storedLogin = localStorage.getItem('isLoggedIn')
    const storedEmail = localStorage.getItem('userEmail')
    if (storedLogin === 'true') {
      isLoggedIn.value = true
      userEmail.value = storedEmail
    }
  }

  // Backend-integrated methods
  async function register(userData) {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.register(userData)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function loginWithCredentials(credentials) {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.login(credentials)
      const { token, user: userData } = response.data
      authToken.value = token
      user.value = userData
      userName.value = userData.name || userData.email || credentials.email || 'User'
      userAvatar.value = userData.avatar || `https://i.pravatar.cc/150?u=${userData.email || credentials.email}`
      isLoggedIn.value = true
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentUser() {
    try {
      const response = await authAPI.getMe()
      user.value = response.data
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch user'
      return { success: false, error: error.value }
    }
  }

  async function updateProfile(userData) {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.updateProfile(userData)
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Profile update failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateAvatar(formData) {
    loading.value = true
    error.value = null
    try {
      const response = await authAPI.updateAvatar(formData)
      user.value = { ...user.value, avatar: response.data.avatar }
      localStorage.setItem('user', JSON.stringify(user.value))
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Avatar upload failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  function clearAuth() {
    authToken.value = null
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  function loadStoredUser() {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('user')
    if (storedToken) {
      authToken.value = storedToken
      isLoggedIn.value = true
    }
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        user.value = userData
        userName.value = userData.name || userData.email || 'User'
        userAvatar.value = userData.avatar || `https://i.pravatar.cc/150?u=${userData.email || 'user'}`
      } catch (e) {
        user.value = null
      }
    }
  }

  return {
    isLoggedIn,
    userEmail,
    userName,
    userAvatar,
    isAuthenticated,
    currentUser,
    loading,
    error,
    login,
    logout,
    initAuth,
    register,
    loginWithCredentials,
    fetchCurrentUser,
    updateProfile,
    updateAvatar,
    clearAuth,
    loadStoredUser
  }
})
