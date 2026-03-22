<template>
  <div class="flex min-h-screen bg-surface">
    <AppSidebar @toggle-menu="toggleMobileMenu" />
    <div v-if="showMobileMenu" @click="toggleMobileMenu" class="fixed inset-0 bg-black/50 z-50 md:hidden"></div>
    <main class="ml-0 md:ml-64 min-h-screen flex flex-col pt-20 w-full">
      <AppTopNav @toggle-menu="toggleMobileMenu" />
      <div class="px-10 pb-12 pt-8 flex-1">
        <slot />
      </div>
      <footer class="px-10 py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold ubuntu bg-surface/80 backdrop-blur-md">
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
            Systems Operational
          </span>
          <span class="h-1 w-1 bg-white/10 rounded-full"></span>
          <span class="space-font">Last Updated: 2 mins ago</span>
        </div>
        <div>© 2026 Xenon Studios • v3.1.0-nexus</div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopNav from '@/components/AppTopNav.vue'

const showMobileMenu = ref(false)
function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}
</script>
