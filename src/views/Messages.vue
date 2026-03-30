<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-white font-headline">Messages</h1>
      </div>
      <div class="flex flex-1 h-[600px] overflow-hidden bg-surface rounded-2xl border border-white/5 relative">
        <!-- Channels Pane -->
        <div class="w-72 bg-surface-container/50 flex flex-col border-r border-white/5">
          <div class="p-6 space-y-8 h-full overflow-y-auto no-scrollbar">
            <div>
              <h3 class="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 px-2 ubuntu">Channels</h3>
              <div class="space-y-1">
                <button class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group text-slate-400 hover:bg-white/[0.03] hover:text-slate-200">
                  <div class="flex items-center gap-3">
                    <Hash class="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    <span class="text-sm tracking-tight font-medium outfit">Supports</span>
                  </div>
                </button>
                <button class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group bg-primary/10 text-white shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]">
                  <div class="flex items-center gap-3">
                    <Hash class="w-4 h-4 text-primary" />
                    <span class="text-sm tracking-tight font-semibold outfit">feedback</span>
                  </div>
                  <div class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                </button>
              </div>
            </div>
            <div>
              <h3 class="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 px-2 ubuntu">Direct Messages</h3>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 bg-surface flex flex-col relative">
          <!-- Blur Overlay for Chat Area -->
          <div class="absolute inset-0 bg-surface/60 backdrop-blur-md z-10"></div>
          
          <!-- Development Notice -->
          <div class="absolute inset-0 z-20 flex items-center justify-center p-8">
            <div class="text-center max-w-md">
              <div class="w-20 h-20 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                <Code class="w-10 h-10 text-primary" />
              </div>
              <h2 class="text-2xl font-bold text-white font-headline mb-3">Under Development</h2>
              <p class="text-slate-400 text-sm outfit leading-relaxed mb-2">
                We're currently building this messaging feature to bring you a better experience.
              </p>
              <p class="text-slate-500 text-xs font-medium uppercase tracking-widest ubuntu mt-6">
                Coming Soon
              </p>
            </div>
          </div>

          <!-- Original Content (Blurred) -->
          <div class="px-6 py-5 bg-surface/80 backdrop-blur-xl border-b border-white/5">
            <h2 class="text-xl font-bold text-white tracking-tight font-headline">Neo-Finance Redesign</h2>
          </div>
          <div class="flex-1 overflow-y-auto px-6 py-8 space-y-6 no-scrollbar">
            <div class="flex items-center gap-6">
              <div class="h-px flex-1 bg-gradient-to-r from-transparent to-white"></div>
              <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-white ubuntu">Today</span>
              <div class="h-px flex-1 bg-gradient-to-l from-transparent to-white"></div>
            </div>
            <div class="flex items-start gap-5">
              <img class="w-11 h-11 rounded-2xl border border-white/5 object-cover" src="https://i.pravatar.cc/150?u=sarah" alt="Sarah">
              <div class="space-y-2">
                <span class="text-xs font-bold text-white tracking-tight outfit">Sarah Jenkins</span>
                <div class="bg-surface-container p-5 rounded-3xl rounded-tl-none border border-white/5 text-slate-300 outfit">
                  I've just uploaded the updated design assets for the dashboard.
                </div>
              </div>
            </div>
          </div>
          <div class="p-6 bg-surface border-t border-white/5">
            <div class="relative bg-surface-container rounded-[2rem] p-2 border border-white/5">
              <textarea class="w-full bg-transparent border-none text-white py-4 px-6 focus:ring-0 resize-none outfit" placeholder="Type a message..." rows="1"></textarea>
              <div class="flex items-center justify-between px-3 pb-2">
                <div class="flex items-center gap-1">
                  <button class="p-2 text-slate-500 hover:text-primary hover:bg-white/5 rounded-xl transition-all"><Smile class="w-5 h-5" /></button>
                  <button class="p-2 text-slate-500 hover:text-primary hover:bg-white/5 rounded-xl transition-all"><Paperclip class="w-5 h-5" /></button>
                </div>
                <button class="bg-primary text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgba(99,102,241,0.2)] hover:bg-[#5558e6] transition-all">
                  <Send class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { Hash, Smile, Paperclip, Send, Code } from 'lucide-vue-next'
</script>
