<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-white font-headline">Messages</h1>
      </div>
      <div class="flex flex-1 h-[600px] overflow-hidden bg-surface rounded-2xl border border-white/5">
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
              <div class="space-y-1 mt-4">
                <div class="flex items-center gap-3 px-3 py-3 cursor-pointer rounded-xl transition-all group bg-white/[0.04]">
                  <div class="relative">
                    <img class="w-9 h-9 rounded-xl border border-white/5 object-cover" src="https://i.pravatar.cc/150?u=sarah" alt="Sarah">
                    <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-container bg-emerald-500"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold truncate text-white tracking-tight outfit">Sarah Jenkins</p>
                    <p class="text-[10px] text-slate-500 truncate font-semibold uppercase tracking-wider mt-0.5 ubuntu">Head of Design</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 bg-surface flex flex-col relative">
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
import { Hash, Smile, Paperclip, Send } from 'lucide-vue-next'
</script>
