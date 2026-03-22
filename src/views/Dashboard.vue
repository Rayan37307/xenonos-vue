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
                <div class="text-4xl font-bold text-white tracking-tight space-font">{{ dashboardData.totalProjects }}</div>
              </div>
              <div class="mt-6 flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest relative z-10 ubuntu">
                <Folder class="w-3.5 h-3.5" />
                <span>+{{ dashboardData.projectsThisMonth }} this month</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div class="bg-surface/50 border border-white/5 p-8 rounded-2xl flex flex-col justify-between group relative overflow-hidden transition-all hover:-translate-y-1 hover:border-white/10 shadow-xl">
              <div class="space-y-1 relative z-10">
                <span class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ubuntu">Completed</span>
                <div class="text-4xl font-bold text-white tracking-tight space-font">{{ dashboardData.completionPercentage }}%</div>
              </div>
              <div class="mt-6 space-y-2 relative z-10">
                <div class="w-full h-1.5 bg-surface rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div class="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.4)]" :style="{ width: dashboardData.completionPercentage + '%' }"></div>
                </div>
              </div>
              <div class="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div class="bg-surface/50 border border-white/5 p-8 rounded-2xl flex flex-col justify-between group relative overflow-hidden transition-all hover:-translate-y-1 hover:border-white/10 shadow-xl">
              <div class="space-y-1 relative z-10">
                <span class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ubuntu">Ongoing Tasks</span>
                <div class="text-4xl font-bold text-white tracking-tight space-font">{{ dashboardData.ongoingTasks }}</div>
              </div>
              <div class="mt-6 flex items-center gap-2 text-amber-400 text-[10px] font-bold uppercase tracking-widest relative z-10 ubuntu">
                <Zap class="w-3.5 h-3.5" />
                <span>{{ dashboardData.tasksDueToday }} due today</span>
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
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <template v-if="activeProjects.length > 0">
                    <div v-for="project in activeProjects" :key="project.id" @click="router.push(`/project-details?id=${project.id}`)"
                      class="bg-surface/60 border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-all group cursor-pointer shadow-xl relative overflow-hidden">
                      <div class="flex justify-between items-start mb-8">
                        <div class="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                          <Zap class="w-6 h-6" />
                        </div>
                        <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border" :class="project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'">{{ project.status || 'active' }}</span>
                      </div>
                      <h4 class="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors tracking-tight font-headline">{{ project.name || project.title || 'Unnamed project' }}</h4>
                      <p class="text-sm text-slate-500 mb-8 line-clamp-1 italic outfit">{{ project.description || 'No description available.' }}</p>
                      <div class="space-y-4">
                        <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 ubuntu">
                          <span>Progress</span>
                          <span class="text-white space-font">{{ getProgress(project) }}%</span>
                        </div>
                        <div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden p-0.5 border border-white/5">
                          <div class="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]" :style="{ width: getProgress(project) + '%' }"></div>
                        </div>
                      </div>
                      <div class="mt-8 flex justify-between items-center pt-8 border-t border-white/5">
                        <div class="flex -space-x-3">
                          <img v-for="(member, idx) in (project.team_members || project.workers || [])" :key="idx" class="w-8 h-8 rounded-xl border-2 border-surface-container object-cover shadow-lg"
                            :src="typeof member === 'string' ? member : (member.avatar || member.image || 'https://i.pravatar.cc/150?u='+idx)" alt="Team">
                        </div>
                        <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest ubuntu">{{ formatDueDate(project.deadline || project.due_date || project.dueDate) }}</div>
                      </div>
                    </div>
                  </template>
                  <div v-else class="bg-surface-container-high/30 p-8 rounded-2xl text-slate-300 text-sm">
                    No active projects to show.
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
                  <template v-if="serviceOrders.length > 0">
                    <div v-for="order in serviceOrders" :key="order.id" @click="router.push('/services')" class="deletable-item bg-surface-container-high/30 p-5 rounded-2xl flex items-center justify-between border border-white/5 hover:bg-surface-container-high/50 focus-within:border-primary/50 transition-all cursor-pointer group">
                      <div class="flex items-center gap-5">
                        <div class="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                          <Folder class="w-6 h-6" />
                        </div>
                        <div>
                          <p class="text-base font-bold text-white tracking-tight outfit">{{ order.title }}</p>
                          <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 ubuntu">{{ order.subtitle }} • {{ order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A' }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-4">
                        <span class="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border text-blue-400 bg-blue-500/10 border-blue-500/20 ubuntu">{{ order.status || 'Processing' }}</span>
                        <button @click.stop="deleteItem" class="p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center">
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </template>
                  <div v-else class="text-slate-400 text-sm">No service orders available.</div>
                </div>
              </section>

              <!-- Notifications Section -->
              <section class="bg-surface/60 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div class="p-8 flex justify-between items-center border-b border-white/5 bg-surface-container/50">
                  <h3 class="text-xl font-bold text-white tracking-tight font-headline">Notifications</h3>
                  <button class="p-2 text-slate-500 hover:text-white transition-colors">
                    <MoreVertical class="w-5 h-5" />
                  </button>
                </div>
                <div class="p-8 space-y-4">
                  <template v-if="notifications.length > 0">
                    <div v-for="notification in notifications" :key="notification.id" @click="router.push('/notification-details')" class="bg-surface-container-high/30 p-5 rounded-2xl flex items-center justify-between border border-white/5 hover:bg-surface-container-high/50 transition-all cursor-pointer group">
                      <div class="flex items-center gap-5">
                        <div class="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                          <Bell class="w-6 h-6" />
                        </div>
                        <div>
                          <p class="text-base font-bold text-white tracking-tight outfit">{{ notification.title }}</p>
                          <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 ubuntu">{{ notification.subtitle }} • {{ notification.time ? new Date(notification.time).toLocaleString() : 'Unknown' }}</p>
                        </div>
                      </div>
                      <button class="px-6 py-2 rounded-xl bg-surface-container-high text-on-surface text-[10px] font-bold uppercase tracking-widest hover:bg-[#2d3a4d] transition-all ubuntu">
                        View Details
                      </button>
                    </div>
                  </template>
                  <div v-else class="text-slate-400 text-sm">No notifications yet.</div>
                </div>
              </section>
            </div>

            <!-- Right Column -->
            <div class="col-span-1 lg:col-span-4 space-y-8">
              <section class="bg-surface/60 border border-white/5 rounded-2xl p-8 shadow-xl">
                <h3 class="text-xl font-bold text-white tracking-tight mb-8 font-headline">Recent Activity</h3>
                <div class="space-y-8 relative">
                  <div class="absolute left-[19px] top-2 bottom-2 w-px bg-white/5"></div>
                  <template v-if="recentActivity.length > 0">
                    <div v-for="activity in recentActivity" :key="activity.id" class="flex gap-6 relative z-10">
                      <div class="w-10 h-10 rounded-xl bg-surface-container border border-white/5 flex items-center justify-center text-primary shadow-xl shrink-0">
                        <CheckCircle class="w-4 h-4 text-emerald-400" />
                      </div>
                      <div class="space-y-1.5">
                        <p class="text-sm text-on-surface leading-relaxed font-medium outfit">{{ activity.message }}</p>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest ubuntu space-font">{{ activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Just now' }}</p>
                      </div>
                    </div>
                  </template>
                  <div v-else class="text-slate-400 text-sm">No recent activity.</div>
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
                  <div class="flex justify-between items-end">
                    <div class="space-y-1">
                      <p class="text-[10px] text-slate-500 uppercase font-bold tracking-widest ubuntu">Latest Invoice</p>
                      <p class="text-4xl font-bold text-white tracking-tight space-font">$4,250.00</p>
                    </div>
                    <span class="px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-lg uppercase tracking-widest border border-amber-500/20 ubuntu">Pending</span>
                  </div>
                </div>
              </section>

              <!-- Recent Files -->
              <section class="bg-surface/60 border border-white/5 rounded-2xl p-8 shadow-xl">
                <div class="flex items-center justify-between mb-8">
                  <h3 class="text-xl font-bold text-white tracking-tight font-headline">Recent Files</h3>
                  <Folder class="w-5 h-5 text-slate-500" />
                </div>
                <div class="space-y-4">
                  <div @click="router.push('/files')" class="bg-surface p-4 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group shadow-inner">
                    <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all">
                      <FileText class="w-5 h-5" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-bold text-white truncate outfit">Project_Scope_V2.pdf</p>
                      <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 ubuntu"><span class="space-font">1.2 MB</span> • Oct 04</p>
                    </div>
                  </div>
                  <div @click="router.push('/files')" class="bg-surface p-4 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group shadow-inner">
                    <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <FileSpreadsheet class="w-5 h-5" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-bold text-white truncate outfit">Final_Invoicing.csv</p>
                      <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 ubuntu"><span class="space-font">420 KB</span> • Oct 03</p>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import { authAPI } from '@/services/api'
import {
  Folder, Zap, TrendingUp, ChevronRight, LayoutTemplate,
  MoreVertical, Bell, Trash2, CheckCircle, MessageSquare,
  FileText, FileSpreadsheet
} from 'lucide-vue-next'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopNav from '@/components/AppTopNav.vue'

const router = useRouter()
const showMobileMenu = ref(false)
const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()

const dashboardSummary = ref({
  totalProjects: 0,
  projectsThisMonth: 0,
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0
})

const dashboardData = computed(() => {
  const totalProjects = projectsStore.projects.length > 0
    ? projectsStore.projects.length
    : dashboardSummary.value.totalProjects || 0

  const projectsThisMonth = projectsStore.projects.length > 0
    ? projectsStore.projects.filter((project) => {
      const dateValue = project.created_at || project.createdAt || project.start_date || project.date
      if (!dateValue) return false
      const created = new Date(dateValue)
      const now = new Date()
      return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth()
    }).length
    : dashboardSummary.value.projectsThisMonth || 0

  const totalTasks = tasksStore.tasks.length > 0 ? tasksStore.tasks.length : dashboardSummary.value.totalTasks || 0
  const completedTasks = tasksStore.completedTasks.length > 0 ? tasksStore.completedTasks.length : dashboardSummary.value.completedTasks || 0
  const ongoingTasksCount = tasksStore.tasks.length > 0
    ? tasksStore.todoTasks.length + tasksStore.inProgressTasks.length + tasksStore.reviewTasks.length
    : (dashboardSummary.value.totalTasks || 0) - (dashboardSummary.value.completedTasks || 0)

  const tasksDueToday = tasksStore.tasks.length > 0
    ? tasksStore.tasks.filter((task) => {
      const dueValue = task.due_date || task.dueDate || task.deadline
      if (!dueValue) return false
      const due = new Date(dueValue)
      const now = new Date()
      return due.getFullYear() === now.getFullYear() && due.getMonth() === now.getMonth() && due.getDate() === now.getDate()
    }).length
    : 0

  return {
    totalProjects,
    projectsThisMonth,
    completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    ongoingTasks: ongoingTasksCount,
    tasksDueToday,
    teamBandwidth: totalProjects > 0 ? Math.min(100, Math.round((ongoingTasksCount / (totalProjects * 5 || 1)) * 100)) : 0
  }
})

const activeProjects = computed(() => {
  const activeStatuses = ['active', 'in_progress', 'pending', 'planning', 'on_hold']
  return projectsStore.projects
    .filter((project) => activeStatuses.includes((project.status || '').toLowerCase()))
    .slice(0, 2)
})

const serviceOrders = computed(() => tasksStore.tasks.slice(0, 3).map((task) => ({
  id: task.id,
  title: task.title || task.name || 'Untitled task',
  subtitle: task.project_name ? `Project: ${task.project_name}` : `Task ID: ${task.id}`,
  status: task.status || 'processing',
  createdAt: task.created_at || task.createdAt
})))

const notifications = computed(() => tasksStore.tasks.slice(-2).reverse().map((task) => ({
  id: task.id,
  title: task.title || task.name || 'Update available',
  subtitle: task.project_name ? `Project: ${task.project_name}` : `Task ID: ${task.id}`,
  time: task.updated_at || task.updatedAt || task.created_at || task.createdAt
})))

const recentActivity = computed(() => tasksStore.tasks.slice(-3).reverse().map((task) => ({
  id: task.id,
  message: `Task "${task.title || task.name || 'Untitled'}" is ${task.status || 'updated'}`,
  timestamp: task.updated_at || task.updatedAt || task.created_at || task.createdAt
})))

function formatDueDate(dateString) {
  if (!dateString) return 'No deadline'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'No deadline'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getProgress(project) {
  if (!project) return 0
  if (project.status === 'completed') return 100
  return project.progress || 0
}

onMounted(async () => {
  await Promise.all([projectsStore.fetchProjects(), tasksStore.fetchTasks()])

  try {
    const response = await authAPI.getDashboard()
    const data = response.data

    if (data?.stats) {
      const payload = data.stats
      dashboardSummary.value = {
        totalProjects: payload.total_projects || payload.totalProjects || 0,
        projectsThisMonth: payload.active_projects || payload.activeProjects || 0,
        totalTasks: payload.total_tasks || payload.totalTasks || 0,
        completedTasks: payload.completed_tasks || payload.completedTasks || 0,
        pendingTasks: payload.pending_tasks || payload.pendingTasks || 0
      }
    }
  } catch (error) {
    console.error('Failed to fetch dashboard API data:', error)
  }
})

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
</script>
