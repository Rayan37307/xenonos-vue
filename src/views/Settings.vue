<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header class="space-y-3">
        <h1 class="text-5xl font-bold tracking-tight text-white font-headline">Settings Hub</h1>
        <p class="text-slate-400 max-w-2xl text-base outfit leading-relaxed">Configure your agency workspace and personal profile to match your operational workflow.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RouterLink v-for="card in settingCards" :key="card.title" :to="card.to" class="block bg-surface-container/60 border border-white/5 p-10 group cursor-pointer hover:border-[#6366F1]/50 hover:bg-surface-container transition-all duration-300 relative overflow-hidden rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:-translate-y-1">
          <div :class="['absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity', card.gradient]"></div>
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-8">
              <div :class="['w-14 h-14 rounded-2xl bg-surface-container-high text-white group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-white/5 transition-all flex items-center justify-center', card.iconBg]">
                <component :is="card.icon" class="w-7 h-7" />
              </div>
              <ChevronRight :class="['text-slate-600 group-hover:translate-x-2 transition-all w-6 h-6', card.iconColor]" />
            </div>
            <h3 class="text-2xl font-bold text-white mb-3 font-headline">{{ card.title }}</h3>
            <p class="text-slate-400 text-sm mb-10 outfit leading-relaxed">{{ card.description }}</p>
            <div class="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest group-hover:text-[#818cf8] transition-colors ubuntu">
              {{ card.action }}
              <div :class="['h-px w-6 group-hover:w-16 transition-all', card.lineColor]"></div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { Shield, Bell, Lock, Settings as SettingsIcon, ChevronRight } from 'lucide-vue-next'

const settingCards = [
  { title: 'Account & Security', description: 'Manage your credentials and login sessions tightly regulated by Xenon secure identity protocols.', to: '/account-security', icon: Shield, action: 'CONFIGURE ACCOUNT', gradient: 'from-primary/[0.05] to-transparent', iconBg: 'group-hover:bg-primary/10 group-hover:text-primary', iconColor: 'group-hover:text-primary', lineColor: 'bg-primary/30 group-hover:bg-[#818cf8]' },
  { title: 'Notifications', description: 'Control how you receive updates and alerts regarding platform operations.', to: '/notifications-settings', icon: Bell, action: 'PREFERENCES', gradient: 'from-amber-500/[0.05] to-transparent', iconBg: 'group-hover:bg-amber-500/10 group-hover:text-amber-400', iconColor: 'group-hover:text-amber-400', lineColor: 'bg-amber-500/30 group-hover:bg-amber-400' },
  { title: 'Privacy & Data', description: 'Manage your user data footprint and configure internal consent preferences strictly.', to: '/privacy-data', icon: Lock, action: 'REVIEW PRIVACY', gradient: 'from-emerald-500/[0.05] to-transparent', iconBg: 'group-hover:bg-emerald-500/10 group-hover:text-emerald-400', iconColor: 'group-hover:text-emerald-400', lineColor: 'bg-emerald-500/30 group-hover:bg-emerald-400' },
  { title: 'Preferences', description: 'System-wide display and localization settings tailored specifically for your workflow.', to: '/preferences', icon: SettingsIcon, action: 'CUSTOMIZE UI', gradient: 'from-pink-500/[0.05] to-transparent', iconBg: 'group-hover:bg-pink-500/10 group-hover:text-pink-400', iconColor: 'group-hover:text-pink-400', lineColor: 'bg-pink-500/30 group-hover:bg-pink-400' }
]
</script>
