<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Header Area -->
      <section class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-10">
        <div class="space-y-6">
          <div class="space-y-2">
            <h1 class="text-5xl font-bold text-white tracking-tight font-headline">Your Profile</h1>
            <p class="text-slate-400 text-sm font-medium outfit">Manage your account details and billing information.</p>
          </div>
          <button 
            @click="triggerAvatarUpload"
            :disabled="profileStore.loading"
            class="relative group overflow-hidden bg-primary text-white px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all active:scale-95 flex items-center gap-2 ubuntu disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera class="w-4 h-4" />
            <span class="relative z-10">Edit Profile Photo</span>
          </button>
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleAvatarUpload"
          />
        </div>
        <div class="relative shrink-0">
          <div class="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-125"></div>
          <div class="relative w-48 h-48 rounded-full p-1.5 bg-gradient-to-tr from-primary/50 to-transparent border border-white/10 shadow-2xl">
            <img 
              :src="avatarUrl" 
              alt="Profile" 
              class="w-full h-full rounded-full object-cover border-4 border-surface-container" 
            />
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Personal Information -->
        <div class="lg:col-span-7 bg-surface-container/50 border border-white/5 rounded-3xl p-8 md:p-10 space-y-8 shadow-xl">
          <div class="flex items-center gap-3 text-primary mb-2">
            <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <User class="w-6 h-6" />
            </div>
            <h3 class="text-2xl font-bold text-white tracking-tight font-headline">Personal Info</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">First Name</label>
              <input 
                type="text" 
                v-model="localProfile.first_name" 
                class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium" 
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Last Name</label>
              <input 
                type="text" 
                v-model="localProfile.last_name" 
                class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium" 
              />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Email Address</label>
            <input 
              type="email" 
              v-model="localProfile.email" 
              class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium" 
            />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Phone Number</label>
            <input 
              type="tel" 
              v-model="localProfile.phone" 
              class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium space-font tracking-widest" 
            />
          </div>
          <div class="flex justify-end pt-4">
            <button 
              @click="saveProfile"
              :disabled="profileStore.saving"
              class="relative group overflow-hidden bg-primary text-white px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ubuntu"
            >
              <span v-if="profileStore.saving" class="relative z-10">Saving...</span>
              <span v-else class="relative z-10">Save Changes</span>
            </button>
          </div>
        </div>

        <!-- Account Details -->
        <div class="lg:col-span-5 bg-surface-container/50 border border-white/5 rounded-3xl p-8 md:p-10 space-y-8 shadow-xl flex flex-col">
          <div class="flex items-center gap-3 text-primary mb-2">
            <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Info class="w-6 h-6" />
            </div>
            <h3 class="text-2xl font-bold text-white tracking-tight font-headline">Account Details</h3>
          </div>
          <div class="space-y-8 flex-grow">
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Username</label>
              <div class="bg-surface border border-white/5 rounded-xl px-5 py-4 text-white text-sm font-medium outfit shadow-inner">
                {{ localProfile.username || '-' }}
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">User ID</label>
              <div class="flex items-center justify-between bg-surface border border-white/5 rounded-xl px-5 py-4 text-white text-sm font-bold space-font tracking-wide shadow-inner">
                <span class="text-primary">{{ userId }}</span>
                <button 
                  @click="copyUserId"
                  class="text-slate-500 hover:text-white transition-colors p-1"
                >
                  <Copy class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="space-y-4 pt-4 mt-auto">
              <div class="flex justify-between items-end">
                <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ubuntu">Profile Completion</p>
                <p class="text-xs font-bold text-primary space-font">{{ profileStore.profileCompletion }}%</p>
              </div>
              <div class="h-2.5 w-full bg-surface rounded-full overflow-hidden p-[1px] border border-white/5 shadow-inner">
                <div 
                  class="h-full bg-gradient-to-r from-primary to-[#818cf8] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500" 
                  :style="{ width: `${profileStore.profileCompletion}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { Camera, User, Info, Copy } from 'lucide-vue-next'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'

const profileStore = useProfileStore()
const authStore = useAuthStore()

// Local state for form binding
const localProfile = ref({
  id: null,
  name: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  username: '',
  avatar_url: '',
  role: '',
  company_name: '',
})

const avatarInput = ref(null)

// Computed
const avatarUrl = computed(() => {
  if (localProfile.value.avatar_url) {
    return localProfile.value.avatar_url
  }
  if (localProfile.value.name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(localProfile.value.name)}&background=6366f1&color=fff&size=200`
  }
  return `https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=200`
})

const userId = computed(() => {
  if (localProfile.value.id) {
    return `#USR-${localProfile.value.id}-${localProfile.value.id.toString(16).toUpperCase()}`
  }
  return '-'
})

// Methods
async function loadProfile() {
  await profileStore.fetchProfile()
  localProfile.value = { ...profileStore.profile }
}

async function saveProfile() {
  const payload = {
    first_name: localProfile.value.first_name,
    last_name: localProfile.value.last_name,
    email: localProfile.value.email,
    phone: localProfile.value.phone,
  }

  await profileStore.saveProfileData(payload)
  localProfile.value = { ...profileStore.profile }

  // Update auth store
  authStore.userName.value = profileStore.profile.name
  authStore.userEmail.value = profileStore.profile.email

  alert('Profile updated successfully!')
}

function triggerAvatarUpload() {
  avatarInput.value?.click()
}

async function handleAvatarUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const avatarUrl = await profileStore.uploadAvatar(file)
  authStore.userAvatar.value = avatarUrl
  alert('Avatar updated successfully!')
}

function copyUserId() {
  if (userId.value !== '-') {
    navigator.clipboard.writeText(userId.value)
    alert('User ID copied to clipboard!')
  }
}

async function loadActivitySummary() {
  await profileStore.fetchActivitySummary()
}

// Lifecycle
onMounted(() => {
  loadProfile()
  loadActivitySummary()
})
</script>
