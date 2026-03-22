import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const userEmail = ref(null)
  const userName = ref('Alex Rivera')
  const userAvatar = ref('https://i.pravatar.cc/150?u=alex')

  const isAuthenticated = computed(() => isLoggedIn.value)

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

  return {
    isLoggedIn,
    userEmail,
    userName,
    userAvatar,
    isAuthenticated,
    login,
    logout,
    initAuth
  }
})
