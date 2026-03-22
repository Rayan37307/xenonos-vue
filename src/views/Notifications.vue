<template>
  <AppLayout>
    <div class="space-y-8 max-w-5xl mx-auto w-full">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 class="text-4xl font-bold text-white tracking-tight font-headline uppercase">Notifications</h1>
          <p class="text-slate-400 text-sm mt-2 font-medium outfit">Stay updated with your latest project activities and system alerts.</p>
        </div>
        <div class="flex items-center gap-4">
          <button class="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-white hover:bg-[#2d3a4d] transition-all ubuntu">
            <Check class="w-3.5 h-3.5" /> Mark all as read
          </button>
          <button class="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-all ubuntu">
            <Trash2 class="w-3.5 h-3.5" /> Clear all
          </button>
        </div>
      </div>

      <div class="bg-surface/60 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div class="divide-y divide-white/5">
          <div v-for="notification in notifications" :key="notification.id" @click="router.push('/notification-details')" :class="['p-6 md:p-8 flex gap-5 md:gap-6 transition-all relative group cursor-pointer', notification.unread ? 'bg-primary/[0.02] hover:bg-primary/[0.05]' : 'hover:bg-white/[0.02] opacity-75 hover:opacity-100']">
            <div v-if="notification.unread" class="absolute inset-y-0 left-0 w-1 bg-primary"></div>
            <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner group-hover:scale-105 transition-all', notification.bgClass]">
              <component :is="notification.icon" :class="['w-6 h-6', notification.textClass]" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                <h3 :class="['text-base font-bold tracking-tight font-headline group-hover:text-primary transition-colors', notification.unread ? 'text-white' : 'text-slate-300 group-hover:text-white']">{{ notification.title }}</h3>
                <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5 ubuntu shrink-0">
                  <Clock class="w-3.5 h-3.5" /> {{ notification.time }}
                </span>
              </div>
              <p class="text-sm text-slate-400 leading-relaxed outfit pr-8">{{ notification.message }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center pt-6">
        <button class="flex items-center gap-2 px-6 py-3 bg-surface/50 border border-white/5 rounded-full text-xs font-bold uppercase tracking-widest text-primary hover:text-white hover:bg-white/5 hover:border-white/10 transition-all shadow-xl ubuntu">
          <ChevronDown class="w-4 h-4" /> Load Older Notifications
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { Info, CheckCircle2, AlertCircle, AlertTriangle, Clock, Check, Trash2, ChevronDown } from 'lucide-vue-next'

const router = useRouter()

const notifications = [
  { id: 1, title: 'Project Update', message: 'Neo-Finance App Redesign has been moved to "In Progress" by Alex Rivera.', time: '2 minutes ago', unread: true, icon: Info, bgClass: 'bg-blue-500/10 border border-blue-500/20', textClass: 'text-blue-400' },
  { id: 2, title: 'New Deliverable', message: 'A new file Brand_Guidelines_v2.pdf has been uploaded to the assets folder.', time: '1 hour ago', unread: true, icon: CheckCircle2, bgClass: 'bg-emerald-500/10 border border-emerald-500/20', textClass: 'text-emerald-400' },
  { id: 3, title: 'Billing Alert', message: 'Your invoice for March 2026 is now available for review and payment.', time: '3 hours ago', unread: false, icon: AlertCircle, bgClass: 'bg-amber-500/10 border border-amber-500/20', textClass: 'text-amber-400' },
  { id: 4, title: 'System Maintenance', message: 'The Nexus platform will undergo scheduled maintenance on Sunday at 02:00 UTC.', time: '5 hours ago', unread: false, icon: Info, bgClass: 'bg-blue-500/10 border border-blue-500/20', textClass: 'text-blue-400' },
  { id: 5, title: 'Security Login Alert', message: 'New login detected from a Chrome browser on Windows.', time: 'Yesterday', unread: false, icon: AlertTriangle, bgClass: 'bg-red-500/10 border border-red-500/20', textClass: 'text-red-400' }
]
</script>
