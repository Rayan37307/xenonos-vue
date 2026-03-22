<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex flex-col gap-4">
        <RouterLink to="/settings" class="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest group w-fit ubuntu">
          <ChevronLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Settings
        </RouterLink>
        <h1 class="text-4xl font-bold tracking-tight text-white font-headline">Security Hub</h1>
        <p class="text-slate-400 text-sm max-w-2xl outfit leading-relaxed">Manage your account credentials, authentication methods, and monitor your session activity.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Change Password -->
        <div class="lg:col-span-2 bg-surface-container/50 border border-white/5 rounded-3xl p-8 shadow-xl">
          <div class="flex items-center gap-3 text-primary mb-8">
            <Key class="w-6 h-6" />
            <h3 class="text-xl font-bold text-white font-headline">Change Password</h3>
          </div>
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Current Password</label>
              <input type="password" placeholder="••••••••••••" class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono tracking-[0.2em]" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">New Password</label>
                <input type="password" placeholder="••••••••••••" class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono tracking-[0.2em]" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Confirm New Password</label>
                <input type="password" placeholder="••••••••••••" class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono tracking-[0.2em]" />
              </div>
            </div>
            <div class="pt-4">
              <button class="bg-primary text-white px-8 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:bg-[#5355e1] active:scale-95 ubuntu">Update Password</button>
            </div>
          </div>
        </div>

        <!-- 2FA -->
        <div class="space-y-8">
          <div class="bg-surface-container/50 border border-white/5 rounded-3xl p-8 shadow-xl">
            <div class="flex items-center gap-3 text-primary mb-6">
              <Shield class="w-6 h-6" />
              <h3 class="text-xl font-bold text-white font-headline">Two-Factor Auth</h3>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 hover:border-primary/30 transition-all cursor-pointer shadow-inner">
                <div class="flex items-center gap-3">
                  <Smartphone class="w-5 h-5 text-slate-400" />
                  <div>
                    <p class="text-sm font-bold text-white outfit">Authenticator App</p>
                    <p class="text-[9px] text-primary font-bold uppercase tracking-widest mt-0.5 ubuntu">Recommended</p>
                  </div>
                </div>
                <div class="w-11 h-6 bg-primary rounded-full relative transition-colors border border-white/5">
                  <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all"></div>
                </div>
              </div>
              <div class="flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 hover:border-slate-500/30 transition-all cursor-pointer opacity-70">
                <div class="flex items-center gap-3">
                  <Mail class="w-5 h-5 text-slate-400" />
                  <div>
                    <p class="text-sm font-bold text-white outfit">SMS Authentication</p>
                    <p class="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 space-font">+1 (555) ••• 42</p>
                  </div>
                </div>
                <div class="w-11 h-6 bg-surface-container-high rounded-full relative transition-colors border border-white/5 shadow-inner">
                  <div class="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full shadow-sm transition-all"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Connected Devices -->
      <div class="bg-surface-container/50 border border-white/5 rounded-3xl p-8 md:p-10 shadow-xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-8 mb-8 gap-4">
          <div class="flex items-center gap-3 text-primary">
            <Monitor class="w-6 h-6" />
            <h3 class="text-2xl font-bold text-white font-headline">Connected Devices</h3>
          </div>
          <button class="text-[10px] font-bold text-primary hover:text-white transition-colors uppercase tracking-widest bg-primary/10 hover:bg-primary/20 px-4 py-2.5 rounded-xl ubuntu self-start sm:self-auto border border-primary/20">Sign out of all sessions</button>
        </div>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-surface/80 border border-white/5 group hover:border-primary/30 transition-all gap-6 shadow-inner relative overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
            <div class="flex items-center gap-6 pl-2">
              <div class="p-4 rounded-xl bg-surface-container-high text-primary shadow-xl">
                <Monitor class="w-6 h-6" />
              </div>
              <div class="space-y-1">
                <h4 class="text-lg font-bold text-white font-headline">MacBook Pro 16"</h4>
                <p class="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ubuntu">San Francisco, CA <span class="text-slate-600 mx-2">•</span> <span class="text-primary">Current Session</span></p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest border border-primary/20 ubuntu shadow-[0_0_10px_rgba(99,102,241,0.2)]">Active Now</span>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-surface/80 border border-white/5 group hover:border-primary/30 transition-all gap-6 shadow-inner">
            <div class="flex items-center gap-6 pl-3">
              <div class="p-4 rounded-xl bg-surface-container-high text-slate-400 shadow-xl group-hover:text-amber-400 transition-colors">
                <Smartphone class="w-6 h-6" />
              </div>
              <div class="space-y-1">
                <h4 class="text-lg font-bold text-white font-headline">iPhone 15 Pro</h4>
                <p class="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ubuntu">London, UK <span class="text-slate-600 mx-2">•</span> <span class="space-font">2 hours ago</span></p>
              </div>
            </div>
            <button class="px-6 py-2.5 rounded-xl bg-surface-container-high border border-white/5 text-slate-300 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all ubuntu shadow-xl">Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { Key, Shield, Smartphone, Monitor, Mail, ChevronLeft } from 'lucide-vue-next'
</script>
