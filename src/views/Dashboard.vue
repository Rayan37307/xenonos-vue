<template>
  <div class="flex min-h-screen bg-surface">
    <AppSidebar @toggle-menu="toggleMobileMenu" />
    
    <div
      id="mobile-overlay"
      v-if="showMobileMenu"
      @click="toggleMobileMenu"
      class="fixed inset-0 bg-black/50 z-50 md:hidden"
    ></div>

    <main class="ml-0 md:ml-64 min-h-screen flex flex-col pt-20 w-full">
      <AppTopNav @toggle-menu="toggleMobileMenu" />

      <div class="px-10 pb-12 pt-8 flex-1">
        <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <!-- Header Section -->
          <section class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div class="space-y-1">
              <h1 class="text-4xl font-bold text-white tracking-tight font-headline uppercase">Command Center</h1>
              <p class="text-on-surface-variant text-sm font-medium outfit max-w-lg">
                Real-time overview of your digital ecosystem performance and project health.
              </p>
            </div>
            <div class="flex items-center gap-4">
              <button @click="router.push('/projects')" class="bg-surface-container-high border border-white/5 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-[#2d3a4d] transition-all active:scale-95 ubuntu">
                View All Projects
              </button>
              <button @click="router.push('/services')" class="bg-primary text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:bg-[#5355e1] active:scale-95 ubuntu">
                Order New Service
              </button>
            </div>
          </section>

          <!-- Stats Cards Row -->
          <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-surface/50 border border-white/5 p-8 rounded-2xl flex flex-col justify-between group relative overflow-hidden transition-all hover:-translate-y-1 hover:border-white/10 shadow-xl">
              <div class="space-y-1 relative z-10">
                <span class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ubuntu">Total Projects</span>
                <div class="text-4xl font-bold text-white tracking-tight space-font">{{ dashboardStore.stats.totalProjects }}</div>
              </div>
              <div class="mt-6 flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest relative z-10 ubuntu">
                <Folder class="w-3.5 h-3.5" />
                <span>{{ activeProjectsCount }} active</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div class="bg-surface/50 border border-white/5 p-8 rounded-2xl flex flex-col justify-between group relative overflow-hidden transition-all hover:-translate-y-1 hover:border-white/10 shadow-xl">
              <div class="space-y-1 relative z-10">
                <span class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ubuntu">Completed</span>
                <div class="text-4xl font-bold text-white tracking-tight space-font">{{ dashboardStore.stats.completionRate }}%</div>
              </div>
              <div class="mt-6 space-y-2 relative z-10">
                <div class="w-full h-1.5 bg-surface rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div class="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.4)]" :style="{ width: dashboardStore.stats.completionRate + '%' }"></div>
                </div>
              </div>
              <div class="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div class="bg-surface/50 border border-white/5 p-8 rounded-2xl flex flex-col justify-between group relative overflow-hidden transition-all hover:-translate-y-1 hover:border-white/10 shadow-xl">
              <div class="space-y-1 relative z-10">
                <span class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ubuntu">Ongoing Tasks</span>
                <div class="text-4xl font-bold text-white tracking-tight space-font">{{ dashboardStore.stats.ongoingTasks }}</div>
              </div>
              <div class="mt-6 flex items-center gap-2 text-amber-400 text-[10px] font-bold uppercase tracking-widest relative z-10 ubuntu">
                <Zap class="w-3.5 h-3.5" />
                <span>{{ dashboardStore.stats.tasksDueToday }} due today</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </section>

          <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <!-- Left Column -->
            <div class="col-span-1 lg:col-span-8 space-y-10">
              <!-- Active Projects -->
              <section class="space-y-6">
                <div class="flex justify-between items-center px-2">
                  <h3 class="text-xl font-bold text-white tracking-tight font-headline">Active Projects</h3>
                  <button @click="router.push('/projects')" class="text-[10px] text-primary font-bold uppercase tracking-widest hover:text-[#818cf8] transition-colors flex items-center gap-1 ubuntu">
                    See More <ChevronRight class="w-3.5 h-3.5" />
                  </button>
                </div>
                <div v-if="dashboardStore.loading" class="text-center py-8">
                  <div class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                </div>
                <div v-else-if="dashboardStore.recentProjects.length === 0" class="text-center py-8 text-slate-500">
                  <p class="text-sm outfit">No active projects found.</p>
                </div>
                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    v-for="project in dashboardStore.recentProjects" 
                    :key="project.id"
                    @click="viewProject(project.id)"
                    class="bg-surface/60 border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-all group cursor-pointer shadow-xl relative overflow-hidden"
                  >
                    <div class="flex justify-between items-start mb-8">
                      <div class="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                        <component :is="getIconComponent(project.icon)" class="w-6 h-6" />
                      </div>
                      <span :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ubuntu', project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20']">
                        {{ project.status }}
                      </span>
                    </div>
                    <h4 class="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors tracking-tight font-headline">{{ project.name }}</h4>
                    <p class="text-sm text-slate-500 mb-8 line-clamp-1 italic outfit">{{ project.description || 'Project description' }}</p>
                    <div class="space-y-4">
                      <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 ubuntu">
                        <span>Progress</span>
                        <span class="text-white space-font">{{ project.progress }}%</span>
                      </div>
                      <div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div class="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]" :style="{ width: project.progress + '%' }"></div>
                      </div>
                    </div>
                    <div class="mt-8 flex justify-between items-center pt-8 border-t border-white/5">
                      <div class="flex -space-x-3">
                        <img v-for="(member, i) in project.team.slice(0, 3)" :key="i" class="w-8 h-8 rounded-xl border-2 border-surface-container object-cover shadow-lg" :src="member" alt="Team">
                        <div v-if="project.team.length > 3" class="w-8 h-8 rounded-xl bg-surface-container-high border-2 border-surface-container flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-lg space-font">+{{ project.team.length - 3 }}</div>
                      </div>
                      <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest ubuntu">{{ formatDate(project.deadline) }}</div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Service Orders -->
              <section class="bg-surface/60 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div class="p-8 flex justify-between items-center border-b border-white/5 bg-surface-container/50">
                  <h3 class="text-xl font-bold text-white tracking-tight font-headline">Service Orders</h3>
                  <button class="p-2 text-slate-500 hover:text-white transition-colors">
                    <MoreVertical class="w-5 h-5" />
                  </button>
                </div>
                <div class="p-8 space-y-4">
                  <div v-if="dashboardStore.loading" class="text-center py-8">
                    <div class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  </div>
                  <div v-else-if="dashboardStore.recentServices.length === 0" class="text-center py-8 text-slate-500">
                    <p class="text-sm outfit">No service orders found.</p>
                  </div>
                  <div 
                    v-for="service in dashboardStore.recentServices" 
                    :key="service.id"
                    @click="viewService(service.id)"
                    class="deletable-item bg-surface-container-high/30 p-5 rounded-2xl flex items-center justify-between border border-white/5 hover:bg-surface-container-high/50 focus-within:border-primary/50 transition-all cursor-pointer group"
                  >
                    <div class="flex items-center gap-5">
                      <div class="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                        <Folder class="w-6 h-6" />
                      </div>
                      <div>
                        <p class="text-base font-bold text-white tracking-tight outfit">{{ service.name }}</p>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 ubuntu">Order <span class="space-font">#{{ service.orderNumber || service.id.slice(0, 8) }}</span> • {{ formatTimeAgo(service.created_at) }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-4">
                      <span :class="['px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ubuntu', service.status === 'processing' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-slate-400 bg-slate-500/10 border-slate-500/20']">
                        {{ service.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Notifications Section -->
              <section class="bg-surface/60 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div class="p-8 flex justify-between items-center border-b border-white/5 bg-surface-container/50">
                  <h3 class="text-xl font-bold text-white tracking-tight font-headline">Notifications</h3>
                  <button @click="router.push('/notifications')" class="p-2 text-slate-500 hover:text-white transition-colors">
                    <MoreVertical class="w-5 h-5" />
                  </button>
                </div>
                <div class="p-8 space-y-4">
                  <div v-if="dashboardStore.loading" class="text-center py-8">
                    <div class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  </div>
                  <div v-else-if="dashboardStore.recentNotifications.length === 0" class="text-center py-8 text-slate-500">
                    <p class="text-sm outfit">No new notifications.</p>
                  </div>
                  <div 
                    v-for="notification in dashboardStore.recentNotifications" 
                    :key="notification.id"
                    @click="viewNotification(notification.id)"
                    class="bg-surface-container-high/30 p-5 rounded-2xl flex items-center justify-between border border-white/5 hover:bg-surface-container-high/50 transition-all cursor-pointer group"
                  >
                    <div class="flex items-center gap-5">
                      <div class="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                        <Bell class="w-6 h-6" />
                      </div>
                      <div>
                        <p class="text-base font-bold text-white tracking-tight outfit">{{ notification.title }}</p>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 ubuntu">{{ formatTimeAgo(notification.created_at) }}</p>
                      </div>
                    </div>
                    <button class="px-6 py-2 rounded-xl bg-surface-container-high text-on-surface text-[10px] font-bold uppercase tracking-widest hover:bg-[#2d3a4d] transition-all ubuntu">
                      View Details
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <!-- Right Column -->
            <div class="col-span-1 lg:col-span-4 space-y-8">
              <section class="bg-surface/60 border border-white/5 rounded-2xl p-8 shadow-xl">
                <h3 class="text-xl font-bold text-white tracking-tight mb-8 font-headline">Recent Activity</h3>
                <div v-if="dashboardStore.loading" class="text-center py-8">
                  <div class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                </div>
                <div v-else-if="dashboardStore.activityFeed.length === 0" class="text-center py-8 text-slate-500">
                  <p class="text-sm outfit">No recent activity.</p>
                </div>
                <div v-else class="space-y-8 relative">
                  <div class="absolute left-[19px] top-2 bottom-2 w-px bg-white/5"></div>
                  <div 
                    v-for="(activity, index) in dashboardStore.activityFeed" 
                    :key="index"
                    class="flex gap-6 relative z-10"
                  >
                    <div class="w-10 h-10 rounded-xl bg-surface-container border border-white/5 flex items-center justify-center text-primary shadow-xl shrink-0">
                      <component :is="getActivityIcon(activity.icon)" :class="['w-4 h-4', getActivityIconColor(activity.icon)]" />
                    </div>
                    <div class="space-y-1.5">
                      <p class="text-sm text-on-surface leading-relaxed font-medium outfit">{{ activity.description }}</p>
                      <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest ubuntu space-font">{{ activity.time }}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section @click="router.push('/billing')" class="cursor-pointer bg-surface/60 border border-white/5 rounded-2xl p-8 shadow-xl relative overflow-hidden group">
                <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                <div class="flex items-center gap-3 mb-8">
                  <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileText class="w-5 h-5" />
                  </div>
                  <h3 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ubuntu">Billing Summary</h3>
                </div>
                <div class="space-y-8 relative z-10">
                  <div v-if="dashboardStore.recentInvoices.length > 0" class="flex justify-between items-end">
                    <div class="space-y-1">
                      <p class="text-[10px] text-slate-500 uppercase font-bold tracking-widest ubuntu">Latest Invoice</p>
                      <p class="text-4xl font-bold text-white tracking-tight space-font">${{ formatCurrency(dashboardStore.recentInvoices[0].amount) }}</p>
                    </div>
                    <span :class="['px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-lg uppercase tracking-widest border border-amber-500/20 ubuntu', dashboardStore.recentInvoices[0].status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : '']">
                      {{ dashboardStore.recentInvoices[0].status }}
                    </span>
                  </div>
                  <div v-else class="text-center py-4 text-slate-500">
                    <p class="text-sm outfit">No pending invoices</p>
                  </div>
                </div>
              </section>

              <!-- Recent Files -->
              <section class="bg-surface/60 border border-white/5 rounded-2xl p-8 shadow-xl">
                <div class="flex items-center justify-between mb-8">
                  <h3 class="text-xl font-bold text-white tracking-tight font-headline">Recent Files</h3>
                  <Folder class="w-5 h-5 text-slate-500" />
                </div>
                <div v-if="dashboardStore.loading" class="text-center py-8">
                  <div class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                </div>
                <div v-else-if="dashboardStore.recentFiles.length === 0" class="text-center py-8 text-slate-500">
                  <p class="text-sm outfit">No recent files.</p>
                </div>
                <div v-else class="space-y-4">
                  <div 
                    v-for="file in dashboardStore.recentFiles" 
                    :key="file.id"
                    @click="viewFile(file.id)"
                    class="bg-surface p-4 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group shadow-inner"
                  >
                    <div :class="['w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center transition-all', getFileColor(file.icon)]">
                      <component :is="getIconComponent(file.icon)" :class="['w-5 h-5', getFileTextColor(file.icon)]" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-bold text-white truncate outfit">{{ file.name }}</p>
                      <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 ubuntu"><span class="space-font">{{ file.size }}</span> • {{ formatDate(file.created_at) }}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <footer class="px-10 py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold ubuntu bg-surface/80 backdrop-blur-md mt-10">
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
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Folder, Zap, TrendingUp, ChevronRight, LayoutTemplate,
  MoreVertical, Bell, Trash2, CheckCircle, MessageSquare,
  FileText, FileSpreadsheet, Palette, Server, Image,
  CheckCircle2, AlertCircle, AlertTriangle
} from 'lucide-vue-next'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopNav from '@/components/AppTopNav.vue'
import { useDashboardStore } from '@/stores/dashboard'

const router = useRouter()
const dashboardStore = useDashboardStore()

const showMobileMenu = ref(false)

// Computed
const activeProjectsCount = computed(() => {
  return dashboardStore.stats.totalProjects - dashboardStore.stats.completionRate
})

const bandwidthStatus = computed(() => {
  const bandwidth = dashboardStore.stats.teamBandwidth
  if (bandwidth >= 90) return 'At capacity'
  if (bandwidth >= 70) return 'Near capacity'
  if (bandwidth >= 50) return 'Moderate'
  return 'Available'
})

// Icon mapping
const iconComponents = {
  Folder,
  Zap,
  LayoutTemplate,
  Smartphone: Palette,
  Server,
  FileText,
  FileSpreadsheet,
  Image,
  Bell,
  CheckCircle: CheckCircle2,
  MessageSquare,
  AlertCircle,
  AlertTriangle
}

function getIconComponent(iconName) {
  return iconComponents[iconName] || Folder
}

function getActivityIcon(iconName) {
  return iconComponents[iconName] || CheckCircle2
}

function getActivityIconColor(iconName) {
  const colors = {
    CheckCircle: 'text-emerald-400',
    MessageSquare: 'text-blue-400',
    FileText: 'text-purple-400',
    Bell: 'text-primary',
    Folder: 'text-amber-400'
  }
  return colors[iconName] || 'text-primary'
}

function getFileColor(iconName) {
  const colors = {
    FileText: 'text-red-400 group-hover:bg-red-500',
    FileSpreadsheet: 'text-emerald-400 group-hover:bg-emerald-500',
    Image: 'text-purple-400 group-hover:bg-purple-500'
  }
  return colors[iconName] || 'text-slate-400 group-hover:bg-slate-500'
}

function getFileTextColor(iconName) {
  const colors = {
    FileText: 'text-red-400',
    FileSpreadsheet: 'text-emerald-400',
    Image: 'text-purple-400'
  }
  return colors[iconName] || 'text-slate-400'
}

function formatDate(dateString) {
  if (!dateString) return 'TBD'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatTimeAgo(dateString) {
  if (!dateString) return 'Just now'
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return formatDate(dateString)
}

function formatCurrency(amount) {
  if (!amount) return '0.00'
  return parseFloat(amount).toFixed(2)
}

function viewProject(id) {
  router.push(`/project-details?id=${id}`)
}

function viewService(id) {
  router.push(`/services?id=${id}`)
}

function viewNotification(id) {
  router.push({ name: 'NotificationDetails', query: { id } })
}

function viewFile(id) {
  router.push(`/files?id=${id}`)
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

function deleteItem() {
  if (confirm('Are you sure you want to delete this item?')) {
    // Handle deletion
  }
}

function createNewProject() {
  alert('Project creation wizard would open here.')
}

function supportAction() {
  alert('Support ticketing system is offline.')
}

onMounted(() => {
  dashboardStore.fetchDashboardData()
})
</script>
