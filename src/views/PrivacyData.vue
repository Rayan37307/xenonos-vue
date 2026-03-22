<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex flex-col gap-4">
        <RouterLink to="/settings" class="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest group w-fit ubuntu">
          <ChevronLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Settings
        </RouterLink>
        <h1 class="text-4xl font-bold tracking-tight text-white font-headline">Privacy & Data</h1>
        <p class="text-slate-400 text-sm max-w-2xl outfit leading-relaxed">Control your digital footprint, manage data portability, and configure communication preferences.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-surface-container/50 border border-white/5 rounded-2xl p-6 flex items-center gap-5 shadow-inner">
          <div class="w-14 h-14 rounded-xl bg-surface-container-high text-white flex items-center justify-center shadow-xl border border-white/5">
            <Eye class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xl font-bold text-white font-headline">2 Devices</p>
            <p class="text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-0.5 ubuntu">Currently active sessions</p>
          </div>
        </div>
        <div class="bg-surface-container/50 border border-white/5 rounded-2xl p-6 flex items-center gap-5 shadow-inner">
          <div class="w-14 h-14 rounded-xl bg-surface-container-high text-emerald-400 flex items-center justify-center shadow-xl border border-white/5">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xl font-bold text-white font-headline">2FA Enabled</p>
            <p class="text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-0.5 ubuntu">Authenticator app active</p>
          </div>
        </div>
        <div class="bg-surface-container/50 border border-white/5 rounded-2xl p-6 flex items-center gap-5 shadow-inner relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="w-14 h-14 rounded-xl bg-surface-container-high text-emerald-400 flex items-center justify-center shadow-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] z-10">
            <Lock class="w-6 h-6" />
          </div>
          <div class="z-10">
            <p class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 font-headline">Score: 98%</p>
            <p class="text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-0.5 ubuntu">Top-tier protection</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Communication -->
          <div class="bg-surface-container/50 border border-white/5 rounded-3xl p-8 md:p-10 shadow-xl">
            <div class="flex items-center gap-3 text-primary mb-8">
              <Mail class="w-6 h-6" />
              <h3 class="text-xl font-bold text-white font-headline">Communication Options</h3>
            </div>
            <div class="space-y-6">
              <div v-for="option in communicationOptions" :key="option.id" class="flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] p-4 -mx-4 rounded-xl transition-all">
                <div class="space-y-1">
                  <p class="text-sm font-bold text-white group-hover:text-primary transition-colors font-headline tracking-wide">{{ option.name }}</p>
                  <p class="text-xs text-slate-500 outfit">{{ option.description }}</p>
                </div>
                <div @click="option.active = !option.active" :class="['w-12 h-6 rounded-full relative transition-colors border', option.active ? 'bg-primary border-primary' : 'bg-surface-container-high border-white/5 shadow-inner']">
                  <div :class="['absolute top-[2px] w-4 h-4 bg-white rounded-full shadow-sm transition-all', option.active ? 'right-1' : 'left-1 bg-white/50']"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- GDPR -->
          <div class="bg-surface-container/50 border border-white/5 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="flex items-center gap-3 text-primary mb-6 relative z-10">
              <Shield class="w-6 h-6" />
              <h3 class="text-xl font-bold text-white font-headline">GDPR & Regulatory Compliance</h3>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed outfit relative z-10 mb-8">Xenon System OS is fully compliant with GDPR. Your data is strictly encrypted at rest and in transit.</p>
            <button class="text-xs font-bold text-primary hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors relative z-10 ubuntu bg-surface-container-high/50 hover:bg-surface-container-high px-6 py-3 rounded-xl border border-white/5 shadow-inner">
              Read Complete Privacy Policy <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-8">
          <!-- Data Management -->
          <div class="bg-surface-container/50 border border-white/5 rounded-3xl p-8 shadow-xl">
            <div class="flex items-center gap-3 text-primary mb-6">
              <Download class="w-6 h-6" />
              <h3 class="text-xl font-bold text-white font-headline">Data Management</h3>
            </div>
            <p class="text-xs text-slate-400 mb-8 outfit leading-relaxed">Download a compiled local copy of your account activity and project history.</p>
            <div class="space-y-4 mb-8">
              <button class="w-full flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 hover:border-primary/50 hover:bg-surface-container transition-all group shadow-inner">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-slate-400 group-hover:text-blue-400 shadow-xl transition-colors">
                    <FileText class="w-5 h-5" />
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-bold text-white font-headline">Export as PDF</p>
                    <p class="text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-0.5 ubuntu">Optimized for reading</p>
                  </div>
                </div>
                <Download class="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </button>
              <button class="w-full flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 hover:border-primary/50 hover:bg-surface-container transition-all group shadow-inner">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-slate-400 group-hover:text-amber-400 shadow-xl transition-colors">
                    <span class="font-mono text-base font-bold">{"{}"}</span>
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-bold text-white font-headline">Export as JSON</p>
                    <p class="text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-0.5 ubuntu">Optimized for dev teams</p>
                  </div>
                </div>
                <Download class="w-5 h-5 text-slate-600 group-hover:text-amber-400 transition-colors" />
              </button>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="bg-surface-container/50 border border-red-500/20 rounded-3xl p-8 shadow-xl shadow-[0_0_20px_rgba(239,68,68,0.05)] relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-red-500/[0.03] pointer-events-none"></div>
            <div class="flex items-center gap-3 text-red-500 mb-6 relative z-10">
              <div class="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertTriangle class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-bold text-white font-headline">Danger Zone</h3>
            </div>
            <p class="text-xs text-slate-400 mb-8 outfit leading-relaxed relative z-10">Permanently remove your workspace and all associated data. This action is <span class="text-red-400 font-bold">irreversible</span>.</p>
            <button class="w-full relative z-10 flex items-center justify-center gap-3 py-4 rounded-xl bg-surface border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all font-bold text-[10px] uppercase tracking-widest ubuntu shadow-inner">
              <Trash2 class="w-4 h-4" /> Delete Workspace Node
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { Eye, ShieldCheck, Lock, Mail, Shield, Download, FileText, ChevronRight, AlertTriangle, Trash2, ChevronLeft } from 'lucide-vue-next'
import { ref } from 'vue'

const communicationOptions = ref([
  { id: 1, name: 'Email Marketing', description: 'Receive updates about new features and ecosystem news.', active: true },
  { id: 2, name: 'Product Surveys', description: 'Invites to help us shape the future of AgencyOS.', active: false }
])
</script>
