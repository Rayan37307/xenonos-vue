<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold text-white tracking-tight font-headline uppercase">Files & Deliverables</h1>
          <p class="text-slate-400 text-sm mt-2 max-w-lg font-medium outfit">Access all project assets, brand guidelines, and high-fidelity downloadables.</p>
        </div>
        <div class="flex items-center gap-4">
          <button class="px-6 py-3.5 bg-surface-container-high border border-white/5 text-slate-300 rounded-xl text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-[#2d3a4d] hover:text-white transition-all ubuntu">
            <Filter class="w-4 h-4" /> Filter
          </button>
          <button class="px-6 py-3.5 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:bg-[#5355e1] ubuntu flex items-center gap-2">
            <Plus class="w-4 h-4" /> Request Upload
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="file in files" :key="file.name" class="group bg-surface/60 border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 shadow-xl">
          <div class="flex items-start justify-between mb-6">
            <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center group-hover:text-white transition-all shadow-inner border', file.bgClass, file.textClass]">
              <component :is="file.icon" class="w-7 h-7" />
            </div>
            <button class="p-2 text-slate-500 hover:text-white transition-colors">
              <MoreHorizontal class="w-5 h-5" />
            </button>
          </div>
          <h3 class="text-lg font-bold text-white mb-1 truncate group-hover:text-primary transition-colors font-headline">{{ file.name }}</h3>
          <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6 ubuntu">{{ file.description }}</p>
          <div class="grid grid-cols-2 gap-4 py-4 border-t border-white/5">
            <div>
              <p class="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1 ubuntu">Size</p>
              <p class="text-sm font-bold text-slate-300 space-font">{{ file.size }}</p>
            </div>
            <div>
              <p class="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1 ubuntu">Modified</p>
              <p class="text-sm font-bold text-slate-300 space-font">{{ file.modified }}</p>
            </div>
          </div>
          <button class="w-full mt-4 py-3 bg-surface-container border border-white/5 text-slate-300 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 ubuntu">
            <Download class="w-4 h-4" /> Download File
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { FileText, Image, Archive, Video, Braces, Download, MoreHorizontal, Filter, Plus } from 'lucide-vue-next'

const files = [
  { name: 'Q4_Performance_Audit.pdf', description: 'Strategic Review 2026', size: '12.4 MB', modified: 'Oct 24, 2026', icon: FileText, bgClass: 'bg-red-500/10 border-red-500/20', textClass: 'text-red-500' },
  { name: 'Landing_Hero_V2_Draft.png', description: 'SaaS Website Overhaul', size: '4.8 MB', modified: 'Nov 02, 2026', icon: Image, bgClass: 'bg-indigo-500/10 border-indigo-500/20', textClass: 'text-indigo-400' },
  { name: 'Brand_Identity_Full_Pack.zip', description: 'Rebranding Phase 1', size: '142.0 MB', modified: 'Oct 12, 2026', icon: Archive, bgClass: 'bg-amber-500/10 border-amber-500/20', textClass: 'text-amber-500' },
  { name: 'Explainer_Video_Final.mp4', description: 'Social Media Ads', size: '88.5 MB', modified: 'Nov 15, 2026', icon: Video, bgClass: 'bg-purple-500/10 border-purple-500/20', textClass: 'text-purple-400' },
  { name: 'App_Config_Production.json', description: 'Core Platform', size: '42 KB', modified: 'Nov 18, 2026', icon: Braces, bgClass: 'bg-emerald-500/10 border-emerald-500/20', textClass: 'text-emerald-400' }
]
</script>
