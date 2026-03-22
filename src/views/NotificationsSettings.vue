<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex flex-col gap-4">
        <RouterLink to="/settings" class="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest group w-fit ubuntu">
          <ChevronLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Settings
        </RouterLink>
        <h1 class="text-4xl font-bold tracking-tight text-white font-headline">Notification Preferences</h1>
        <p class="text-slate-400 text-sm max-w-2xl outfit leading-relaxed">Customize how and when you receive updates across your workspace.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Global Activities -->
        <div class="bg-surface-container/50 border border-white/5 rounded-3xl p-8 shadow-xl">
          <div class="flex items-center gap-3 text-primary mb-8">
            <Bell class="w-6 h-6" />
            <h3 class="text-xl font-bold text-white font-headline">Global Activities</h3>
          </div>
          <div class="space-y-6">
            <div v-for="setting in globalSettings" :key="setting.id" class="flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] p-4 -mx-4 rounded-2xl transition-all">
              <div class="space-y-1">
                <p class="text-sm font-bold text-white group-hover:text-primary transition-colors font-headline tracking-wide">{{ setting.name }}</p>
                <p class="text-xs text-slate-500 outfit">{{ setting.description }}</p>
              </div>
              <div @click="setting.active = !setting.active" :class="['w-12 h-6 rounded-full relative cursor-pointer transition-colors border', setting.active ? 'bg-primary border-primary' : 'bg-surface-container-high border-white/5 shadow-inner']">
                <div :class="['absolute top-[2px] w-4 h-4 bg-white rounded-full shadow-sm transition-all shadow-[0_0_5px_rgba(0,0,0,0.3)]', setting.active ? 'right-1' : 'left-1 bg-white/50']"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Channels -->
        <div class="bg-surface-container/50 border border-white/5 rounded-3xl p-8 shadow-xl">
          <div class="flex items-center gap-3 text-primary mb-8">
            <MessageSquare class="w-6 h-6" />
            <h3 class="text-xl font-bold text-white font-headline">Chat Channels</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="channel in channels" :key="channel.id" @click="channel.active = !channel.active" :class="['flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all', channel.active ? 'bg-surface border border-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]' : 'bg-surface/50 border border-white/5 opacity-70']">
              <div class="flex items-center gap-3">
                <div :class="['w-2 h-2 rounded-full', channel.active ? 'bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-600']"></div>
                <span :class="['text-sm font-bold space-font tracking-wide', channel.active ? 'text-on-surface-variant' : 'text-slate-500']">{{ channel.name }}</span>
              </div>
              <div :class="['w-11 h-5 rounded-full relative cursor-pointer transition-colors', channel.active ? 'bg-primary' : 'bg-surface-container-high shadow-inner']">
                <div :class="['absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all', channel.active ? 'right-0.5 shadow-[0_0_5px_rgba(0,0,0,0.3)]' : 'left-0.5 bg-white/50']"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8">
        <button class="w-full sm:w-auto px-8 py-3.5 rounded-xl text-slate-500 hover:text-white font-bold text-[10px] uppercase tracking-widest transition-colors ubuntu">Discard Changes</button>
        <button class="w-full sm:w-auto bg-primary hover:bg-[#5355e1] text-white px-10 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] active:scale-95 ubuntu">Save Preferences</button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { Bell, MessageSquare, ChevronLeft } from 'lucide-vue-next'
import { ref } from 'vue'

const globalSettings = ref([
  { id: 1, name: 'Project Updates', description: 'Receive alerts for new milestones and tasks.', active: true },
  { id: 2, name: 'File Uploads', description: 'Notify when a client uploads new assets.', active: true },
  { id: 3, name: 'Billing Alerts', description: 'Status of invoices and payment confirmations.', active: false }
])

const channels = ref([
  { id: 1, name: '#general', active: true },
  { id: 2, name: '#design', active: true },
  { id: 3, name: '#feedback', active: false },
  { id: 4, name: '#dev', active: true }
])
</script>
