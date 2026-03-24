<template>
  <AppLayout>
    <div class="space-y-8 max-w-5xl mx-auto w-full">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 class="text-4xl font-bold text-white tracking-tight font-headline uppercase">Notifications</h1>
          <p class="text-slate-400 text-sm mt-2 font-medium outfit">Stay updated with your latest project activities and system alerts.</p>
        </div>
        <div class="flex items-center gap-4">
          <button 
            @click="markAllAsRead"
            :disabled="notificationsStore.loading"
            class="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-white hover:bg-[#2d3a4d] transition-all ubuntu disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check class="w-3.5 h-3.5" /> Mark all as read
          </button>
        </div>
      </div>

      <div v-if="notificationsStore.loading" class="bg-surface/60 border border-white/5 rounded-2xl p-12 text-center">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p class="text-slate-400 text-sm mt-4 outfit">Loading notifications...</p>
      </div>

      <div v-else-if="notifications.length === 0" class="bg-surface/60 border border-white/5 rounded-2xl p-12 text-center">
        <Info class="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white font-headline mb-2">No Notifications</h3>
        <p class="text-slate-400 text-sm outfit">You're all caught up! No new notifications at the moment.</p>
      </div>

      <div v-else class="bg-surface/60 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div class="divide-y divide-white/5">
          <div 
            v-for="notification in notifications" 
            :key="notification.id" 
            @click="handleNotificationClick(notification)"
            :class="['p-6 md:p-8 flex gap-5 md:gap-6 transition-all relative group cursor-pointer', notification.unread ? 'bg-primary/[0.02] hover:bg-primary/[0.05]' : 'hover:bg-white/[0.02] opacity-75 hover:opacity-100']"
          >
            <div v-if="notification.unread" class="absolute inset-y-0 left-0 w-1 bg-primary"></div>
            <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner group-hover:scale-105 transition-all', notification.bgClass]">
              <component :is="getIconComponent(notification.icon)" :class="['w-6 h-6', notification.textClass]" />
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

      <div v-if="notifications.length > 0" class="flex justify-center pt-6">
        <button class="flex items-center gap-2 px-6 py-3 bg-surface/50 border border-white/5 rounded-full text-xs font-bold uppercase tracking-widest text-primary hover:text-white hover:bg-white/5 hover:border-white/10 transition-all shadow-xl ubuntu">
          <ChevronDown class="w-4 h-4" /> Load Older Notifications
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { Info, CheckCircle2, AlertCircle, AlertTriangle, Clock, Check, ChevronDown } from 'lucide-vue-next'
import { useNotificationsStore } from '@/stores/notifications'

const router = useRouter()
const notificationsStore = useNotificationsStore()

// Icon mapping
const iconComponents = {
  Info,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock
}

const notifications = computed(() => notificationsStore.notifications)

function getIconComponent(iconName) {
  return iconComponents[iconName] || Info
}

async function markAllAsRead() {
  await notificationsStore.markAllNotificationsAsRead()
}

function handleNotificationClick(notification) {
  if (notification.unread) {
    notificationsStore.markNotificationAsRead(notification.id)
  }
  // Navigate to notification details page
  router.push({ name: 'NotificationDetails', query: { id: notification.id } })
}

async function loadNotifications() {
  await notificationsStore.fetchNotifications(true)
  await notificationsStore.fetchUnreadCount()
}

onMounted(() => {
  loadNotifications()
})
</script>
