<template>
  <AppLayout>
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-4xl font-bold font-headline text-white tracking-tight uppercase">Projects List</h1>
          <p class="text-slate-400 text-sm mt-2 max-w-md font-medium outfit">Manage and monitor your active digital ecosystems.</p>
        </div>
        <div class="flex p-1 bg-surface-container/80 backdrop-blur-md border border-white/5 rounded-xl">
          <button 
            @click="filterStatus = 'all'"
            :class="['px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ubuntu', filterStatus === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300']"
          >All</button>
          <button 
            @click="filterStatus = 'active'"
            :class="['px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ubuntu', filterStatus === 'active' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300']"
          >Active</button>
          <button 
            @click="filterStatus = 'completed'"
            :class="['px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ubuntu', filterStatus === 'completed' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300']"
          >Completed</button>
          <button 
            @click="filterStatus = 'pending'"
            :class="['px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ubuntu', filterStatus === 'pending' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300']"
          >Pending</button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="projectsStore.loading" class="bg-surface/60 border border-white/5 rounded-2xl p-12 text-center">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p class="text-slate-400 text-sm mt-4 outfit">Loading projects...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProjects.length === 0" class="bg-surface/60 border border-white/5 rounded-2xl p-12 text-center">
        <FolderOpen class="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white font-headline mb-2">No Projects Found</h3>
        <p class="text-slate-400 text-sm outfit mb-6">Get started by creating your first project.</p>
        <button 
          @click="createNewProject"
          class="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-primary/90 transition-all ubuntu"
        >
          Create New Project
        </button>
      </div>

      <!-- Projects Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id" 
          @click="viewProject(project.id)"
          class="group bg-surface/50 border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 shadow-xl cursor-pointer"
        >
          <div class="flex justify-between items-start mb-6">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary transition-colors shadow-inner">
              <component :is="getIconComponent(project.icon)" class="w-6 h-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <span :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ubuntu', statusClass(project.status)]">
              {{ project.status }}
            </span>
          </div>
          <h3 class="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors font-headline">{{ project.title }}</h3>
          <p class="text-sm text-slate-400 line-clamp-2 mb-8 leading-relaxed outfit">{{ project.description }}</p>
          <div class="space-y-4">
            <div class="flex justify-between items-center bg-white/[0.02] p-2 rounded-lg">
              <span class="text-[11px] uppercase tracking-widest font-bold text-slate-500 ubuntu">Progress</span>
              <span class="text-xs font-bold text-white space-font">{{ project.progress }}%</span>
            </div>
            <div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden border border-white/5">
              <div class="h-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.4)] transition-all duration-1000" :style="{ width: project.progress + '%' }"></div>
            </div>
            <div class="pt-6 flex justify-between items-center border-t border-white/5 mt-4">
              <div class="flex -space-x-2">
                <img v-for="(member, i) in project.team" :key="i" class="w-8 h-8 rounded-lg border-2 border-surface-container object-cover shadow-lg" :src="member" alt="Team">
              </div>
              <div class="flex items-center gap-1.5 text-slate-500">
                <Calendar class="w-3.5 h-3.5 text-primary" />
                <span class="text-[10px] font-bold uppercase tracking-widest ubuntu">{{ formatDate(project.deadline) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div @click="createNewProject" class="group rounded-2xl p-6 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-white/[0.01] transition-all cursor-pointer shadow-xl">
          <div class="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors shadow-inner">
            <Plus class="w-6 h-6 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <div class="text-center">
            <h4 class="text-white font-bold mb-1 font-headline tracking-wide uppercase">Create New Project</h4>
            <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold ubuntu">Launch a new creative workflow</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { Zap, Terminal, Smartphone, Calendar, Plus, FolderOpen } from 'lucide-vue-next'
import { useProjectsStore } from '@/stores/projects'

const router = useRouter()
const projectsStore = useProjectsStore()

const filterStatus = ref('all')

// Icon mapping for project types
const iconComponents = {
  Zap,
  Terminal,
  Smartphone,
  FolderOpen
}

const filteredProjects = computed(() => {
  if (filterStatus.value === 'all') {
    return projectsStore.projects
  }
  return projectsStore.projects.filter(p => p.status === filterStatus.value)
})

function getIconComponent(iconName) {
  return iconComponents[iconName] || FolderOpen
}

function formatDate(dateString) {
  if (!dateString) return 'TBD'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusClass(status) {
  const classes = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    completed: 'bg-slate-500/10 text-slate-400 border-white/10'
  }
  return classes[status] || classes.pending
}

function viewProject(id) {
  router.push(`/project-details?id=${id}`)
}

async function createNewProject() {
  const name = prompt('Enter project name:')
  if (!name) return
  
  try {
    const project = await projectsStore.createNewProject({
      name: name,
      description: 'New project',
      status: 'pending'
    })
    router.push(`/project-details?id=${project.id}`)
  } catch (err) {
    alert('Failed to create project: ' + (err.response?.data?.message || 'Unknown error'))
  }
}

onMounted(() => {
  projectsStore.fetchProjects()
})
</script>
