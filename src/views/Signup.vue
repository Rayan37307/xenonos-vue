<template>
  <div class="min-h-screen flex items-center justify-center bg-surface px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-3 mb-6">
          <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <span class="text-white font-black text-2xl space-font">X</span>
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight font-headline">Xenon Studios</h1>
        </div>
        <h2 class="text-3xl font-bold text-white font-headline mb-2">Create Account</h2>
        <p class="text-on-surface-variant text-sm outfit">Join us and start managing your projects</p>
      </div>

      <div class="glass-card rounded-2xl p-8">
        <form @submit.prevent="handleSignup" class="space-y-5">
          <div v-if="signupError" class="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
            <p class="text-red-400 text-xs font-bold uppercase tracking-widest ubuntu">{{ signupError }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-400 ubuntu">Full Name</label>
            <input
              v-model="name"
              type="text"
              placeholder="John Doe"
              class="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all outfit"
              required
            />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-400 ubuntu">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all outfit"
              required
            />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-400 ubuntu">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all outfit"
              required
            />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-400 ubuntu">Confirm Password</label>
            <input
              v-model="passwordConfirmation"
              type="password"
              placeholder="••••••••"
              class="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all outfit"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full bg-primary text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:bg-[#5355e1] active:scale-95 ubuntu disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ authStore.loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-xs text-slate-400 outfit">
            Already have an account?
            <RouterLink to="/login" class="text-primary font-bold hover:text-primary/80 transition-colors">
              Sign In
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const signupError = ref('')

async function handleSignup() {
  if (!email.value || !password.value || !name.value) {
    signupError.value = 'Please fill in all required fields'
    return
  }

  if (password.value !== passwordConfirmation.value) {
    signupError.value = 'Passwords do not match'
    return
  }

  const result = await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value
  })

  if (result.success) {
    router.push('/login')
  } else {
    signupError.value = result.error || 'Registration failed'
  }
}
</script>
