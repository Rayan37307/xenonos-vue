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
        <h2 class="text-2xl font-bold text-white font-headline mb-2">Reset Password</h2>
        <p class="text-on-surface-variant text-sm outfit">Enter your new password</p>
      </div>

      <div class="glass-card rounded-2xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-400 ubuntu">New Password</label>
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
              v-model="confirmPassword"
              type="password"
              placeholder="••••••••"
              class="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all outfit"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full bg-primary text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:bg-[#5355e1] active:scale-95 ubuntu"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')
const confirmPassword = ref('')

function handleSubmit() {
  if (password.value && password.value === confirmPassword.value) {
    alert('Password reset successfully!')
    router.push('/login')
  }
}
</script>
