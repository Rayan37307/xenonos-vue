<template>
  <header
    class="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-20 z-40 bg-surface-container/80 backdrop-blur-xl flex items-center justify-between px-10 border-b border-white/5"
  >
    <div class="flex items-center gap-4 lg:gap-10 min-w-fit">
      <button
        @click="$emit('toggle-menu')"
        class="p-2 md:hidden text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
      >
        <Menu class="w-6 h-6" />
      </button>
      <h2 class="text-xl font-bold text-white tracking-tight font-headline">
        Command Center
      </h2>

      <nav class="hidden xl:flex items-center gap-8">
        <button
          @click="router.push('/settings')"
          class="px-5 py-2 bg-surface-container-high text-on-surface text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:text-white hover:bg-[#2d3a4d] transition-all border border-white/5 shadow-xl ubuntu"
        >
          Settings
        </button>
        <button
          @click="supportAction"
          class="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition-all ubuntu"
        >
          Support
        </button>
      </nav>
    </div>

    <div class="flex-1 flex justify-center px-16 hidden lg:flex">
      <div class="relative w-full max-w-2xl group">
        <Search
          class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors w-[18px] h-[18px]"
        />
        <input
          type="text"
          placeholder="Search workspace..."
          class="w-full bg-surface-container-high/50 border border-white/5 rounded-[1.25rem] py-3 pl-14 pr-6 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-high transition-all shadow-inner outfit"
        />
      </div>
    </div>

    <div class="flex items-center gap-8 min-w-fit">
      <div class="flex items-center gap-2">
        <button
          @click="router.push('/notifications')"
          class="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all relative group"
        >
          <Bell class="w-[22px] h-[22px]" />
          <span
            class="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-surface-container group-hover:scale-125 transition-transform"
          ></span>
        </button>
        <button
          @click="supportAction"
          class="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all hidden sm:block"
        >
          <HelpCircle class="w-[22px] h-[22px]" />
        </button>
      </div>

      <div class="h-8 w-px bg-white/10 hidden sm:block"></div>

      <button
        @click="router.push('/profile')"
        class="flex items-center gap-4 group"
      >
        <div class="flex items-center gap-3 hidden lg:flex">
          <p class="text-sm font-bold text-white group-hover:text-primary transition-colors tracking-tight outfit">
            {{ authStore.userName }}
          </p>
          <ChevronDown class="text-slate-600 group-hover:text-white transition-colors w-4 h-4" />
        </div>
        <div
          class="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-primary to-transparent border border-white/5 shadow-2xl group-hover:scale-105 transition-transform shrink-0"
        >
          <img
            :src="authStore.userAvatar"
            alt="User Avatar"
            class="w-full h-full rounded-full object-cover border-2 border-surface-container"
          />
        </div>
      </button>
    </div>
  </header>
</template>

<script setup>
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  ChevronDown
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

defineEmits(['toggle-menu'])
const authStore = useAuthStore()
const router = useRouter()

function supportAction() {
  alert('Support ticketing system is offline.')
}
</script>
