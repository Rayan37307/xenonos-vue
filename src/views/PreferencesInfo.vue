<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex flex-col gap-4">
        <RouterLink to="/settings" class="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest group w-fit ubuntu">
          <ChevronLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Settings
        </RouterLink>
        <h1 class="text-4xl font-bold tracking-tight text-white font-headline">Preferences & System Info</h1>
        <p class="text-slate-400 text-sm max-w-2xl outfit leading-relaxed">Manage your regional settings, view account lineage, and check system health.</p>
      </div>

      <!-- Top Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Localization -->
        <div class="lg:col-span-2 bg-surface-container/50 border border-white/5 rounded-3xl p-8 md:p-10 shadow-xl">
          <div class="flex items-center gap-3 text-primary mb-8">
            <Globe class="w-6 h-6" />
            <h3 class="text-xl font-bold text-white font-headline">Localization</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Default Time Zone</label>
              <div class="relative group">
                <select class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm shadow-inner cursor-pointer">
                  <option>UTC-08:00 Pacific Time (US & Canada)</option>
                  <option>UTC+00:00 London (GMT)</option>
                  <option>UTC+01:00 Berlin (CET)</option>
                </select>
                <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-primary transition-colors w-5 h-5" />
              </div>
            </div>
            <div class="space-y-4">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Date Format</label>
              <label class="flex items-center gap-4 p-4 rounded-xl bg-surface border border-primary/30 cursor-pointer hover:border-primary/50 transition-all group shadow-inner shadow-[0_0_10px_rgba(99,102,241,0.05)]">
                <div class="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                  <div class="w-2.5 h-2.5 rounded-full bg-primary"></div>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center w-full justify-between">
                  <span class="text-sm font-bold text-white space-font tracking-wide">DD/MM/YYYY</span>
                  <span class="text-[9px] text-primary uppercase tracking-widest font-bold ubuntu">(International)</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Account Metadata -->
        <div class="bg-surface-container/50 border border-white/5 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-tr from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex items-center gap-3 text-primary mb-4 relative z-10">
            <Zap class="w-6 h-6" />
            <h3 class="text-xl font-bold text-white font-headline">Account Metadata</h3>
          </div>
          <p class="text-xs text-slate-400 outfit leading-relaxed mb-6 relative z-10">System-generated audit data for this workspace identity node.</p>
          <div class="p-6 rounded-2xl bg-surface border border-white/5 space-y-5 relative z-10 shadow-inner">
            <div class="flex flex-col gap-1">
              <p class="text-[9px] uppercase tracking-widest text-primary font-bold ubuntu">Account Created</p>
              <p class="text-sm text-white font-bold space-font tracking-wide">Oct 12, 2023</p>
            </div>
            <div class="flex flex-col gap-1">
              <p class="text-[9px] uppercase tracking-widest text-primary font-bold ubuntu">Plan Type</p>
              <p class="text-sm text-emerald-400 font-bold space-font tracking-wide">Enterprise</p>
            </div>
            <div class="flex flex-col gap-1">
              <p class="text-[9px] uppercase tracking-widest text-primary font-bold ubuntu">Workspace ID</p>
              <p class="text-sm text-white font-bold font-mono tracking-widest">#7F42A9B1</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Cache Management -->
      <div class="bg-surface-container/50 border border-amber-500/20 rounded-3xl p-8 md:p-10 shadow-xl shadow-[0_0_20px_rgba(245,158,11,0.05)] relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-amber-500/[0.03] pointer-events-none"></div>
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div class="space-y-2">
            <h4 class="text-2xl font-bold text-amber-500 font-headline">Advanced Cache Management</h4>
            <p class="text-sm text-slate-400 outfit leading-relaxed max-w-xl">Clear application cache to resolve frontend sync issues. This will <span class="text-white font-bold">not</span> delete persistent project data.</p>
          </div>
          <button class="px-8 py-4 rounded-xl bg-surface border border-amber-500/30 text-amber-500 font-bold text-[10px] uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] ubuntu whitespace-nowrap">
            Purge Cache
          </button>
        </div>
        <div class="mt-8 pt-8 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between relative z-10 gap-4">
          <div class="flex items-center gap-3">
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
            <p class="text-[10px] text-emerald-400 uppercase tracking-widest font-bold ubuntu">System Status: Operational</p>
          </div>
          <p class="text-[9px] text-slate-500 uppercase tracking-widest font-bold ubuntu space-font">Last check: 1 minute ago</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { Globe, Zap, ChevronDown, ChevronLeft } from 'lucide-vue-next'
</script>
