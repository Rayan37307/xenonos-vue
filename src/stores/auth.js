import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, logout as apiLogout, getMe, setAuthToken } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const userEmail = ref(null)
  const userName = ref(null)
  const userAvatar = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => isLoggedIn.value)

  function initAuth() {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    if (storedToken && storedUser) {
      token.value = storedToken
      const user = JSON.parse(storedUser)
      userEmail.value = user.email
      userName.value = user.name
      userAvatar.value = user.avatar
      isLoggedIn.value = true
      setAuthToken(storedToken)
    }
  }

  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      const response = await apiLogin(email, password)
      token.value = response.token
      userEmail.value = response.user.email
      userName.value = response.user.name
      userAvatar.value = response.user.avatar
      isLoggedIn.value = true
      
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('auth_user', JSON.stringify(response.user))
      setAuthToken(response.token)
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await apiLogout()
    } catch (err) {
      console.error('Logout error:', err)
    }
    token.value = null
    userEmail.value = null
    userName.value = null
    userAvatar.value = null
    isLoggedIn.value = false
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setAuthToken(null)
  }

  async function fetchUser() {
    try {
      const response = await getMe()
      // Handle both response structures: { user: {...} } or direct user object
      const user = response.user || response
      userEmail.value = user.email
      userName.value = user.name
      userAvatar.value = user.avatar
      localStorage.setItem('auth_user', JSON.stringify(user))
    } catch (err) {
      console.error('Failed to fetch user:', err)
    }
  }

  return {
    isLoggedIn,
    userEmail,
    userName,
    userAvatar,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    initAuth,
    fetchUser
  }
})
