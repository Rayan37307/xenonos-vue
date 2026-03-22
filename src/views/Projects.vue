<template>
  <AppLayout>
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-4xl font-bold font-headline text-white tracking-tight uppercase">Projects List</h1>
          <p class="text-slate-400 text-sm mt-2 max-w-md font-medium outfit">Manage and monitor your active digital ecosystems.</p>
        </div>
        <div class="flex p-1 bg-surface-container/80 backdrop-blur-md border border-white/5 rounded-xl">
          <button class="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all bg-primary text-white shadow-lg shadow-primary/20 ubuntu">All</button>
          <button class="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all text-slate-500 hover:text-slate-300 ubuntu">Active</button>
          <button class="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all text-slate-500 hover:text-slate-300 ubuntu">Completed</button>
          <button class="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all text-slate-500 hover:text-slate-300 ubuntu">Pending</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in projects" :key="project.id" @click="router.push('/project-details')" class="group bg-surface/50 border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 shadow-xl cursor-pointer">
          <div class="flex justify-between items-start mb-6">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary transition-colors shadow-inner">
              <component :is="project.icon" class="w-6 h-6 text-primary group-hover:text-white transition-colors" />
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
                <span class="text-[10px] font-bold uppercase tracking-widest ubuntu">{{ project.dueDate }}</span>
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
import AppLayout from '@/components/AppLayout.vue'
import { Zap, Terminal, Smartphone, Calendar, Plus } from 'lucide-vue-next'

const router = useRouter()

const projects = [
  {
    id: 1,
    title: 'Neo-Finance App Redesign',
    description: 'A complete overhaul of the Neo-Finance mobile application, focusing on improving user experience, modernizing the visual design, and integrating new crypto-fiat bridge features.',
    status: 'active',
    progress: 65,
    icon: Zap,
    team: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2', 'https://i.pravatar.cc/150?u=3'],
    dueDate: 'Oct 24, 2026'
  },
  {
    id: 2,
    title: 'Enterprise Dashboard',
    description: 'Developing a scalable dashboard solution for managing enterprise resources and team allocation with real-time analytics.',
    status: 'pending',
    progress: 12,
    icon: Terminal,
    team: ['https://i.pravatar.cc/150?u=4'],
    dueDate: 'Nov 12, 2026'
  },
  {
    id: 3,
    title: 'Elysian App Redesign',
    description: 'Full ecosystem visual overhaul for the Elysian mobile app focusing on modern glassmorphism principles and premium typography.',
    status: 'completed',
    progress: 100,
    icon: Smartphone,
    team: ['https://i.pravatar.cc/150?u=5', 'https://i.pravatar.cc/150?u=6'],
    dueDate: 'Aug 15, 2026'
  }
]

function statusClass(status) {
  const classes = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    completed: 'bg-slate-500/10 text-slate-400 border-white/10'
  }
  return classes[status] || ''
}

function createNewProject() {
  alert('Project creation wizard would open here.')
}
</script>
