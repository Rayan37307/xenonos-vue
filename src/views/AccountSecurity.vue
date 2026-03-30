<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex flex-col gap-4">
        <RouterLink to="/settings" class="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest group w-fit ubuntu">
          <ChevronLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Settings
        </RouterLink>
        <h1 class="text-4xl font-bold tracking-tight text-white font-headline">Security Hub</h1>
        <p class="text-slate-400 text-sm max-w-2xl outfit leading-relaxed">Manage your account credentials, authentication methods, and monitor your session activity.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Change Password -->
        <div class="lg:col-span-2 bg-surface-container/50 border border-white/5 rounded-3xl p-8 shadow-xl">
          <div class="flex items-center gap-3 text-primary mb-8">
            <Key class="w-6 h-6" />
            <h3 class="text-xl font-bold text-white font-headline">Change Password</h3>
          </div>
          <form @submit.prevent="handleChangePassword" class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Current Password</label>
              <input 
                v-model="passwordForm.currentPassword" 
                type="password" 
                placeholder="••••••••••••" 
                required
                class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono tracking-[0.2em]" 
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">New Password</label>
                <input 
                  v-model="passwordForm.newPassword" 
                  type="password" 
                  placeholder="••••••••••••" 
                  required
                  minlength="8"
                  class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono tracking-[0.2em]" 
                />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Confirm New Password</label>
                <input 
                  v-model="passwordForm.newPasswordConfirmation" 
                  type="password" 
                  placeholder="••••••••••••" 
                  required
                  minlength="8"
                  class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono tracking-[0.2em]" 
                />
              </div>
            </div>
            <div v-if="passwordError" class="text-rose-400 text-sm outfit">{{ passwordError }}</div>
            <div v-if="passwordSuccess" class="text-emerald-400 text-sm outfit">{{ passwordSuccess }}</div>
            <div class="pt-4">
              <button 
                type="submit" 
                :disabled="passwordLoading"
                class="bg-primary text-white px-8 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:bg-[#5355e1] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ubuntu flex items-center gap-2"
              >
                <span v-if="passwordLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ passwordLoading ? 'Changing...' : 'Update Password' }}
              </button>
            </div>
          </form>
        </div>

        <!-- 2FA -->
        <div class="space-y-8 ">
          <div class="bg-surface-container/50 border border-white/5 rounded-3xl p-8 shadow-xl">
            <div class="flex items-center gap-3 text-primary mb-6">
              <Shield class="w-6 h-6" />
              <h3 class="text-xl font-bold text-white font-headline">Two-Factor Auth</h3>
            </div>
            <div class="space-y-4 uppercase font-bold">
              this section is currently under development
            </div>
          </div>
        </div>
      </div>

      <!-- Connected Devices -->
      <div class="bg-surface-container/50 border border-white/5 rounded-3xl p-8 md:p-10 shadow-xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-8 mb-8 gap-4">
          <div class="flex items-center gap-3 text-primary">
            <Monitor class="w-6 h-6" />
            <h3 class="text-2xl font-bold text-white font-headline">Connected Devices</h3>
          </div>
          <div class="flex gap-3">
            <button 
              @click="handleRevokeOthers" 
              :disabled="sessionsLoading || sessions.length <= 1"
              class="text-[10px] font-bold text-primary hover:text-white transition-colors uppercase tracking-widest bg-primary/10 hover:bg-primary/20 px-4 py-2.5 rounded-xl ubuntu self-start sm:self-auto border border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign out others
            </button>
            <button 
              @click="handleRevokeAll" 
              :disabled="sessionsLoading"
              class="text-[10px] font-bold text-rose-400 hover:text-white transition-colors uppercase tracking-widest bg-rose-500/10 hover:bg-rose-500/20 px-4 py-2.5 rounded-xl ubuntu self-start sm:self-auto border border-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign out all
            </button>
          </div>
        </div>

        <div v-if="sessionsLoading" class="flex items-center justify-center py-12">
          <div class="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>

        <div v-else-if="sessions.length === 0" class="text-center py-12">
          <Monitor class="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p class="text-slate-400 text-sm outfit">No active sessions found</p>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="session in sessions" 
            :key="session.id" 
            class="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-surface/80 border border-white/5 group transition-all gap-6 shadow-inner relative overflow-hidden"
            :class="[
              session.is_current ? 'hover:border-primary/30' : 'hover:border-rose-500/30',
              session.is_current ? '' : ''
            ]"
          >
            <div v-if="session.is_current" class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
            <div class="flex items-center gap-6" :class="session.is_current ? 'pl-2' : 'pl-3'">
              <div class="p-4 rounded-xl bg-surface-container-high shadow-xl" :class="session.is_current ? 'text-primary' : 'text-slate-400 group-hover:text-amber-400 transition-colors'">
                <component :is="getDeviceIcon(session.device_type)" class="w-6 h-6" />
              </div>
              <div class="space-y-1">
                <h4 class="text-lg font-bold text-white font-headline">{{ session.device_name }}</h4>
                <p class="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ubuntu">
                  {{ session.location }} 
                  <span class="text-slate-600 mx-2">•</span> 
                  <span :class="session.is_current ? 'text-primary' : 'text-slate-400'">{{ session.last_active_human || 'Unknown' }}</span>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span 
                v-if="session.is_current" 
                class="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest border border-primary/20 ubuntu shadow-[0_0_10px_rgba(99,102,241,0.2)]"
              >
                Current Session
              </span>
              <span 
                v-else-if="session.is_active_now" 
                class="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-widest border border-emerald-500/20 ubuntu"
              >
                Active Now
              </span>
              <button 
                v-if="!session.is_current"
                @click="handleRevokeSession(session.id)" 
                :disabled="revokingSessionId === session.id"
                class="px-6 py-2.5 rounded-xl bg-surface-container-high border border-white/5 text-slate-300 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all ubuntu shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="revokingSessionId === session.id" class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ revokingSessionId === session.id ? 'Revoking...' : 'Sign Out' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { Key, Shield, Smartphone, Monitor, Mail, ChevronLeft } from 'lucide-vue-next'
import { getSessions, revokeSession, revokeAllSessions, revokeOtherSessions, changePassword } from '@/services/api'

const sessions = ref([])
const sessionsLoading = ref(false)
const revokingSessionId = ref(null)

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  newPasswordConfirmation: ''
})
const passwordLoading = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

async function loadSessions() {
  sessionsLoading.value = true
  try {
    const response = await getSessions()
    sessions.value = response.sessions || []
  } catch (error) {
    console.error('Failed to load sessions:', error)
  } finally {
    sessionsLoading.value = false
  }
}

function getDeviceIcon(deviceType) {
  switch (deviceType) {
    case 'mobile':
      return Smartphone
    case 'tablet':
      return 'tablet' // You can add a Tablet icon if needed
    default:
      return Monitor
  }
}

async function handleRevokeSession(id) {
  if (!confirm('Are you sure you want to sign out from this device?')) return

  revokingSessionId.value = id
  try {
    await revokeSession(id)
    sessions.value = sessions.value.filter(s => s.id !== id)
  } catch (error) {
    console.error('Failed to revoke session:', error)
    alert('Failed to revoke session. Please try again.')
  } finally {
    revokingSessionId.value = null
  }
}

async function handleRevokeOthers() {
  if (!confirm('Are you sure you want to sign out from all other devices?')) return

  try {
    await revokeOtherSessions()
    await loadSessions()
  } catch (error) {
    console.error('Failed to revoke other sessions:', error)
    alert('Failed to revoke other sessions. Please try again.')
  }
}

async function handleRevokeAll() {
  if (!confirm('Are you sure you want to sign out from ALL devices? You will be logged out.')) return

  try {
    await revokeAllSessions()
    // Clear local auth state
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    // Redirect to login
    window.location.href = '/login'
  } catch (error) {
    console.error('Failed to revoke all sessions:', error)
    alert('Failed to revoke all sessions. Please try again.')
  }
}

async function handleChangePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (passwordForm.newPassword !== passwordForm.newPasswordConfirmation) {
    passwordError.value = 'New passwords do not match'
    return
  }

  passwordLoading.value = true
  try {
    await changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword,
      passwordForm.newPasswordConfirmation
    )
    passwordSuccess.value = 'Password changed successfully'
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.newPasswordConfirmation = ''
  } catch (error) {
    console.error('Failed to change password:', error)
    passwordError.value = error.response?.data?.message || 'Failed to change password'
  } finally {
    passwordLoading.value = false
  }
}

onMounted(() => {
  loadSessions()
})
</script>
