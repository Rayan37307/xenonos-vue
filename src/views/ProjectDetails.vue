<template>
  <AppLayout>
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Loading State -->
      <div v-if="loading" class="bg-surface/60 border border-white/5 rounded-3xl p-12 text-center">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p class="text-slate-400 text-sm mt-4 outfit">Loading project...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-surface/60 border border-white/5 rounded-3xl p-12 text-center">
        <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white font-headline mb-2">Project Not Found</h3>
        <p class="text-slate-400 text-sm outfit mb-6">{{ error }}</p>
        <button 
          @click="router.push('/projects')"
          class="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-primary/90 transition-all ubuntu"
        >
          Back to Projects
        </button>
      </div>

      <!-- Project Content -->
      <div v-else-if="project" class="space-y-8">
        <!-- Navigation & Actions -->
        <div class="flex justify-between items-center">
          <button 
            @click="router.push('/projects')" 
            class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span class="text-sm font-medium outfit">Back to Projects</span>
          </button>
          <div class="flex gap-3">
            <button class="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
              <MoreVertical class="w-5 h-5" />
            </button>
            <button 
              @click="editProject"
              class="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] ubuntu"
            >
              Edit Project
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column (Project Info & Objectives) -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Main Project Card -->
            <div class="bg-surface/60 border border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div class="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>

              <div class="flex flex-wrap gap-3 mb-6 relative z-10">
                <span :class="['px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ubuntu', statusClass(project.status)]">
                  {{ formatStatus(project.status) }}
                </span>
                <span class="px-3 py-1 bg-white/5 text-slate-400 text-[11px] font-bold uppercase tracking-wider rounded-full border border-white/10 flex items-center gap-1.5 ubuntu">
                  <Calendar class="w-3.5 h-3.5" />
                  Deadline: <span class="space-font">{{ formatDate(project.deadline) }}</span>
                </span>
              </div>

              <h1 class="text-3xl font-bold text-white tracking-tight mb-4 font-headline uppercase relative z-10">{{ project.name }}</h1>
              <p class="text-slate-400 leading-relaxed text-lg outfit relative z-10">
                {{ project.description || 'No description provided.' }}
              </p>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 p-6 bg-surface-container/50 rounded-2xl border border-white/5 backdrop-blur-md relative z-10">
                <div class="space-y-1">
                  <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider ubuntu">Project Lead</p>
                  <div class="flex items-center gap-2">
                    <img 
                      v-if="project.client?.avatar" 
                      :src="project.client.avatar" 
                      class="w-6 h-6 rounded-full border border-surface-container" 
                      :alt="project.client.name"
                    />
                    <div v-else class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary border border-surface-container">
                      {{ getInitials(project.client?.name || 'Client') }}
                    </div>
                    <p class="text-sm font-bold text-white outfit">{{ project.client?.name || 'Client Name' }}</p>
                  </div>
                </div>
                <div class="space-y-1">
                  <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider ubuntu">Team Members</p>
                  <div class="flex -space-x-2">
                    <template v-for="(worker, index) in project.workers?.slice(0, 4)" :key="index">
                      <img 
                        v-if="worker.avatar" 
                        :src="worker.avatar" 
                        class="w-6 h-6 rounded-full border-2 border-surface-container" 
                        :alt="worker.name"
                      />
                      <div v-else class="w-6 h-6 rounded-full bg-primary/20 border-2 border-surface-container flex items-center justify-center text-[8px] font-bold text-primary">
                        {{ getInitials(worker.name || 'W') }}
                      </div>
                    </template>
                    <div v-if="project.workers?.length > 4" class="w-6 h-6 rounded-full bg-surface-container-high border-2 border-surface-container flex items-center justify-center text-[8px] font-bold text-slate-400 space-font">
                      +{{ project.workers.length - 4 }}
                    </div>
                  </div>
                </div>
                <div class="space-y-1">
                  <p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider ubuntu">Total Budget</p>
                  <p class="text-sm font-bold text-white space-font">{{ formatCurrency(project.budget) }}</p>
                </div>
              </div>
            </div>

            <!-- Progress Section -->
            <div class="bg-surface/60 border border-white/5 rounded-3xl p-8 shadow-xl">
              <h2 class="text-xl font-bold text-white tracking-tight mb-6 font-headline">Project Progress</h2>
              <div class="space-y-6">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-slate-400 outfit">Overall Completion</span>
                  <span class="text-sm font-bold text-white space-font">{{ project.progress }}%</span>
                </div>
                <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden border border-white/5">
                  <div 
                    class="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)] transition-all duration-1000" 
                    :style="{ width: project.progress + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Key Objectives / Tasks -->
            <div class="bg-surface/60 border border-white/5 rounded-3xl p-8 shadow-xl">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-white tracking-tight font-headline">Tasks</h2>
                <button 
                  @click="createTask"
                  class="text-primary hover:text-primary/80 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ubuntu"
                >
                  <Plus class="w-4 h-4" /> Add Task
                </button>
              </div>
              
              <div v-if="tasksLoading" class="text-center py-8">
                <div class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
              
              <div v-else-if="tasks.length === 0" class="text-center py-8 text-slate-500">
                <p class="text-sm outfit">No tasks yet. Create the first task for this project.</p>
              </div>
              
              <div v-else class="space-y-3">
                <div 
                  v-for="task in tasks" 
                  :key="task.id"
                  class="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/5 group hover:border-primary/30 hover:bg-white/[0.04] transition-all cursor-pointer"
                  @click="toggleTaskStatus(task)"
                >
                  <div :class="['w-6 h-6 rounded-lg flex items-center justify-center border transition-colors', task.status === 'completed' ? 'bg-primary border-primary text-white' : 'border-white/10 text-transparent hover:border-primary/50']">
                    <CheckCircle2 class="w-4 h-4" />
                  </div>
                  <span :class="['text-sm font-medium outfit', task.status === 'completed' ? 'text-slate-400 line-through' : 'text-white']">
                    {{ task.title }}
                  </span>
                  <span :class="['ml-auto px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ubuntu', priorityClass(task.priority)]">
                    {{ task.priority }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column (Assets & Discussion) -->
          <div class="space-y-8">
            <!-- Recent Assets -->
            <div class="bg-surface/60 border border-white/5 rounded-3xl p-6 shadow-xl">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-lg font-bold text-white tracking-tight font-headline">Recent Assets</h2>
                <button @click="router.push('/files')" class="text-primary hover:text-primary/80 text-xs font-bold uppercase tracking-wider transition-colors ubuntu">
                  View All
                </button>
              </div>
              <div v-if="filesLoading" class="text-center py-8">
                <div class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
              <div v-else-if="files.length === 0" class="text-center py-8 text-slate-500">
                <p class="text-sm outfit">No assets uploaded yet.</p>
              </div>
              <div v-else class="space-y-3">
                <div 
                  v-for="file in files" 
                  :key="file.id"
                  class="flex items-center gap-3 p-3 bg-surface-container/50 rounded-xl border border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer group"
                  @click="downloadFile(file)"
                >
                  <div :class="['w-10 h-10 rounded-lg flex items-center justify-center transition-colors', getFileBgClass(file.mime_type)]">
                    <component :is="getFileIcon(file.mime_type)" :class="['w-5 h-5', getFileTextColor(file.mime_type)]" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-white truncate outfit">{{ file.original_name || file.name }}</p>
                    <p class="text-[11px] text-slate-500 space-font mt-0.5">{{ file.formatted_size || formatFileSize(file.size) }}</p>
                  </div>
                  <button class="p-2 text-slate-500 hover:text-white transition-colors">
                    <Download class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Latest Discussion -->
            <div class="bg-surface/60 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none z-0"></div>
              <div class="relative z-10 flex justify-between items-center mb-6">
                <h2 class="text-lg font-bold text-white tracking-tight font-headline">Latest Discussion</h2>
                <button @click="router.push('/messages')" class="text-primary hover:text-primary/80 text-xs font-bold uppercase tracking-wider transition-colors ubuntu">
                  Open Chat
                </button>
              </div>
              <div v-if="messagesLoading" class="text-center py-8">
                <div class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
              <div v-else-if="messages.length === 0" class="text-center py-8 text-slate-500 relative z-10">
                <p class="text-sm outfit">No messages yet. Start the conversation!</p>
              </div>
              <div v-else class="space-y-4 relative z-10">
                <div 
                  v-for="message in messages" 
                  :key="message.id"
                  class="flex gap-3"
                >
                  <img 
                    :src="message.sender?.avatar || `https://i.pravatar.cc/150?u=${message.sender_id}`" 
                    class="w-8 h-8 rounded-lg shrink-0 border border-white/5" 
                    :alt="message.sender?.name || 'User'"
                  />
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <p class="text-xs font-bold text-white outfit">{{ message.sender?.name || 'User' }}</p>
                      <span class="text-[10px] text-slate-500 space-font">{{ formatTimeAgo(message.created_at) }}</span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed bg-surface-container p-3 rounded-xl rounded-tl-none border border-white/5 shadow-inner outfit">
                      {{ message.body }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Activity Feed -->
            <div class="bg-surface/60 border border-white/5 rounded-3xl p-6 shadow-xl">
              <h2 class="text-lg font-bold text-white tracking-tight mb-6 font-headline">Recent Activity</h2>
              <div v-if="activityLoading" class="text-center py-8">
                <div class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
              <div v-else-if="activityFeed.length === 0" class="text-center py-8 text-slate-500">
                <p class="text-sm outfit">No recent activity.</p>
              </div>
              <div v-else class="space-y-4 relative">
                <div class="absolute left-[15px] top-2 bottom-2 w-px bg-white/5"></div>
                <div 
                  v-for="(activity, index) in activityFeed" 
                  :key="index"
                  class="flex gap-4 relative z-10"
                >
                  <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/5', activity.bgClass]">
                    <component :is="activity.icon" :class="['w-4 h-4', activity.iconClass]" />
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm text-slate-300 leading-relaxed outfit">{{ activity.description }}</p>
                    <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest ubuntu space-font">{{ activity.time }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { 
  ArrowLeft, 
  MoreVertical, 
  Calendar, 
  CheckCircle2, 
  Plus,
  Download,
  FileText,
  Image,
  FileSpreadsheet,
  Folder,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  User
} from 'lucide-vue-next'
import { getProject } from '@/services/api'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

// State
const loading = ref(true)
const error = ref(null)
const project = ref(null)
const tasks = ref([])
const tasksLoading = ref(false)
const files = ref([])
const filesLoading = ref(false)
const messages = ref([])
const messagesLoading = ref(false)
const activityFeed = ref([])
const activityLoading = ref(false)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Methods
function formatStatus(status) {
  const statusMap = {
    'active': 'In Progress',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'pending': 'Pending',
    'on_hold': 'On Hold',
    'cancelled': 'Cancelled'
  }
  return statusMap[status] || status
}

function statusClass(status) {
  const classes = {
    'active': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'in_progress': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'completed': 'bg-slate-500/10 text-slate-400 border-white/10',
    'pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'on_hold': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'cancelled': 'bg-red-500/10 text-red-400 border-red-500/20'
  }
  return classes[status] || classes.pending
}

function priorityClass(priority) {
  const classes = {
    'low': 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    'medium': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    'high': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    'urgent': 'bg-red-500/10 text-red-400 border border-red-500/20'
  }
  return classes[priority] || classes.medium
}

function formatDate(dateString) {
  if (!dateString) return 'TBD'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
  if (!amount) return '$0.00'
  return '$' + parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatFileSize(bytes) {
  if (!bytes) return '0 KB'
  const k = 1024
  const sizes = ['KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function getFileIcon(mimeType) {
  if (mimeType?.includes('pdf')) return FileText
  if (mimeType?.includes('image')) return Image
  if (mimeType?.includes('spreadsheet') || mimeType?.includes('csv') || mimeType?.includes('excel')) return FileSpreadsheet
  return FileText
}

function getFileBgClass(mimeType) {
  if (mimeType?.includes('pdf')) return 'bg-red-400/10 text-red-400 group-hover:bg-red-500'
  if (mimeType?.includes('image')) return 'bg-purple-400/10 text-purple-400 group-hover:bg-purple-500'
  if (mimeType?.includes('spreadsheet') || mimeType?.includes('csv')) return 'bg-emerald-400/10 text-emerald-400 group-hover:bg-emerald-500'
  return 'bg-slate-400/10 text-slate-400 group-hover:bg-slate-500'
}

function getFileTextColor(mimeType) {
  if (mimeType?.includes('pdf')) return 'text-red-400'
  if (mimeType?.includes('image')) return 'text-purple-400'
  if (mimeType?.includes('spreadsheet') || mimeType?.includes('csv')) return 'text-emerald-400'
  return 'text-slate-400'
}

async function loadProject() {
  const projectId = route.params.id || route.query.id
  
  if (!projectId) {
    error.value = 'Project ID is required'
    loading.value = false
    return
  }

  try {
    const response = await getProject(projectId)
    project.value = response.project || response.data || response
    loading.value = false
    
    // Load related data
    loadTasks(projectId)
    loadFiles(projectId)
    loadMessages(projectId)
    generateActivityFeed()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load project'
    loading.value = false
  }
}

async function loadTasks(projectId) {
  tasksLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      params: { project_id: projectId }
    })
    tasks.value = response.data.tasks || response.data || []
  } catch (err) {
    console.error('Failed to load tasks:', err)
    tasks.value = []
  } finally {
    tasksLoading.value = false
  }
}

async function loadFiles(projectId) {
  filesLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/files`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    // Filter files related to this project (if project_id is available)
    const allFiles = response.data.files || response.data || []
    files.value = allFiles.slice(0, 3) // Show only recent 3
  } catch (err) {
    console.error('Failed to load files:', err)
    files.value = []
  } finally {
    filesLoading.value = false
  }
}

async function loadMessages(projectId) {
  messagesLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/chat/messages/project/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    messages.value = (response.data.messages || response.data || []).slice(-3) // Show only last 3
  } catch (err) {
    console.error('Failed to load messages:', err)
    messages.value = []
  } finally {
    messagesLoading.value = false
  }
}

function generateActivityFeed() {
  const activities = []
  
  // Add project creation
  if (project.value?.created_at) {
    activities.push({
      description: 'Project created',
      time: formatTimeAgo(project.value.created_at),
      icon: Folder,
      iconClass: 'text-primary',
      bgClass: 'bg-primary/10 border border-primary/20'
    })
  }
  
  // Add task completions
  tasks.value.forEach(task => {
    if (task.status === 'completed' && task.updated_at) {
      activities.push({
        description: `Task "${task.title}" completed`,
        time: formatTimeAgo(task.updated_at),
        icon: CheckCircle,
        iconClass: 'text-emerald-400',
        bgClass: 'bg-emerald-500/10 border border-emerald-500/20'
      })
    }
  })
  
  // Add messages
  messages.value.forEach(message => {
    activities.push({
      description: `${message.sender?.name || 'User'} posted a message`,
      time: formatTimeAgo(message.created_at),
      icon: MessageSquare,
      iconClass: 'text-blue-400',
      bgClass: 'bg-blue-500/10 border border-blue-500/20'
    })
  })
  
  // Sort by time and limit
  activityFeed.value = activities.sort((a, b) => {
    return new Date(b.time) - new Date(a.time)
  }).slice(0, 5)
}

function editProject() {
  alert('Project edit modal would open here.')
}

function createTask() {
  const title = prompt('Enter task title:')
  if (!title) return
  
  alert('Task creation would be implemented with a modal form.')
}

function toggleTaskStatus(task) {
  if (task.status === 'completed') {
    task.status = 'todo'
  } else {
    task.status = 'completed'
  }
  // In production, call API to update task status
}

function downloadFile(file) {
  if (file.url) {
    window.open(file.url, '_blank')
  }
}

onMounted(() => {
  loadProject()
})
</script>
