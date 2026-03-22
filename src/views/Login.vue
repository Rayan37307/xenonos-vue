<template>
  <div class="min-h-screen flex bg-surface">
    <!-- Left Split: Visual Showcase -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-surface-container flex-col justify-between p-12 border-r border-white/5 overflow-hidden">
      <div class="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="relative z-10 flex items-center gap-4">
        <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
          <span class="text-white font-black text-2xl space-font">X</span>
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight font-headline">Xenon OS</h1>
      </div>

      <div class="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h2 class="text-5xl font-bold text-white font-headline leading-tight">
          Secure access to your <br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">digital command center.</span>
        </h2>
        <p class="text-slate-400 text-lg max-w-xl outfit leading-relaxed">
          Log in to coordinate projects, deploy high-end creative solutions, and manage your agency deliverables in real-time.
        </p>

        <div class="flex items-center gap-4 pt-4">
          <div class="flex items-center -space-x-3">
            <img src="https://i.pravatar.cc/100?img=1" class="w-10 h-10 rounded-full border-2 border-surface-container">
            <img src="https://i.pravatar.cc/100?img=2" class="w-10 h-10 rounded-full border-2 border-surface-container">
            <img src="https://i.pravatar.cc/100?img=3" class="w-10 h-10 rounded-full border-2 border-surface-container">
          </div>
          <div class="space-y-1">
            <div class="flex gap-1">
              <Star v-for="i in 5" :key="i" class="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </div>
            <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold ubuntu">Trusted by top agencies</p>
          </div>
        </div>
      </div>

      <div class="relative z-10 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold ubuntu">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
          Systems Operational
        </div>
        <span>v3.1.0-nexus</span>
      </div>
    </div>

    <!-- Right Split: Auth Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 relative">
      <div class="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <div class="flex lg:hidden items-center justify-center gap-3 mb-10">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <span class="text-white font-black text-xl space-font">X</span>
          </div>
          <h1 class="text-xl font-bold text-white tracking-tight font-headline">Xenon OS</h1>
        </div>

        <div class="space-y-3 text-center sm:text-left">
          <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-white font-headline">Welcome back</h2>
          <p class="text-slate-400 text-sm outfit">Enter your credentials to access your workspace.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] uppercase tracking-widest text-primary font-bold ml-1 ubuntu">Email Address</label>
            <div class="relative group">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input
                v-model="email"
                type="email"
                placeholder="alex@agency.com"
                required
                class="w-full bg-surface-container-high/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-container-high transition-all font-mono text-sm shadow-inner"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between ml-1">
              <label class="text-[10px] uppercase tracking-widest text-primary font-bold ubuntu">Password</label>
              <RouterLink to="/forgot-password" class="text-[10px] uppercase tracking-widest text-slate-500 hover:text-white font-bold ubuntu transition-colors">Forgot?</RouterLink>
            </div>
            <div class="relative group">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="••••••••••••"
                required
                class="w-full bg-surface-container-high/50 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface-container-high transition-all font-mono text-sm shadow-inner tracking-[0.2em]"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <Eye v-if="!showPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <div
              @click="rememberMe = !rememberMe"
              class="w-4 h-4 rounded border border-white/10 bg-surface-container-high flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
            >
              <Check v-if="rememberMe" class="w-3 h-3 text-primary" />
            </div>
            <label class="text-xs text-slate-400 cursor-pointer outfit">Remember this device for 30 days</label>
          </div>

          <button
            type="submit"
            class="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#5355e1] text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 mt-4 group ubuntu"
          >
            Authenticate Session
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div class="relative py-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/5"></div>
          </div>
          <div class="relative flex justify-center text-xs">
            <span class="bg-surface px-4 text-slate-500 uppercase tracking-widest font-bold ubuntu text-[9px]">Or continue with</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button type="button" class="flex items-center justify-center gap-3 p-4 rounded-xl bg-surface-container border border-white/5 hover:border-primary/30 hover:bg-surface-container-high transition-all group shadow-inner">
            <div class="w-4 h-4 bg-white rounded-[2px] group-hover:scale-110 transition-transform"></div>
            <span class="text-[10px] font-bold text-white uppercase tracking-widest ubuntu">Google</span>
          </button>
          <button type="button" class="flex items-center justify-center gap-3 p-4 rounded-xl bg-surface-container border border-white/5 hover:border-primary/30 hover:bg-surface-container-high transition-all group shadow-inner">
            <Github class="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            <span class="text-[10px] font-bold text-white uppercase tracking-widest ubuntu">GitHub</span>
          </button>
        </div>

        <p class="text-center text-xs text-slate-500 outfit pt-6">
          Don't have an agency account yet?
          <RouterLink to="/signup" class="text-white hover:text-primary font-bold transition-colors ml-1">Request Access</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Mail, Lock, Eye, EyeOff, Check, ArrowRight, Star, Github
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

function handleLogin() {
  if (email.value && password.value) {
    authStore.login(email.value)
    router.push('/dashboard')
  }
}
</script>
