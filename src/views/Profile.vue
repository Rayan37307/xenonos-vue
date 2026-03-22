<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Header Area -->
      <section class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-10">
        <div class="space-y-6">
          <div class="space-y-2">
            <h1 class="text-5xl font-bold text-white tracking-tight font-headline">Your Profile</h1>
            <p class="text-slate-400 text-sm font-medium outfit">Manage your account details and billing information.</p>
          </div>
          <button class="relative group overflow-hidden bg-primary text-white px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all active:scale-95 flex items-center gap-2 ubuntu">
            <Camera class="w-4 h-4" />
            <span class="relative z-10">Edit Profile Photo</span>
          </button>
        </div>
        <div class="relative shrink-0">
          <div class="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-125"></div>
          <div class="relative w-48 h-48 rounded-full p-1.5 bg-gradient-to-tr from-primary/50 to-transparent border border-white/10 shadow-2xl">
            <img src="https://i.pravatar.cc/150?u=alex" alt="Profile" class="w-full h-full rounded-full object-cover border-4 border-surface-container" />
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Personal Information -->
        <div class="lg:col-span-7 bg-surface-container/50 border border-white/5 rounded-3xl p-8 md:p-10 space-y-8 shadow-xl">
          <div class="flex items-center gap-3 text-primary mb-2">
            <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <User class="w-6 h-6" />
            </div>
            <h3 class="text-2xl font-bold text-white tracking-tight font-headline">Personal Info</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">First Name</label>
              <input type="text" value="Alex" class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Last Name</label>
              <input type="text" value="Rivers" class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Email Address</label>
            <input type="email" value="alex.rivers@luminaprojects.com" class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Phone Number</label>
            <input type="tel" value="+1 (555) 123-4567" class="w-full bg-surface-container-high border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600 outfit font-medium space-font tracking-widest" />
          </div>
        </div>

        <!-- Account Details -->
        <div class="lg:col-span-5 bg-surface-container/50 border border-white/5 rounded-3xl p-8 md:p-10 space-y-8 shadow-xl flex flex-col">
          <div class="flex items-center gap-3 text-primary mb-2">
            <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Info class="w-6 h-6" />
            </div>
            <h3 class="text-2xl font-bold text-white tracking-tight font-headline">Account Details</h3>
          </div>
          <div class="space-y-8 flex-grow">
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">Username</label>
              <div class="bg-surface border border-white/5 rounded-xl px-5 py-4 text-white text-sm font-medium outfit shadow-inner">arivers_lead</div>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 ubuntu">User ID</label>
              <div class="flex items-center justify-between bg-surface border border-white/5 rounded-xl px-5 py-4 text-white text-sm font-bold space-font tracking-wide shadow-inner">
                <span class="text-primary">#LUM-9921-X9</span>
                <button class="text-slate-500 hover:text-white transition-colors p-1"><Copy class="w-4 h-4" /></button>
              </div>
            </div>
            <div class="space-y-4 pt-4 mt-auto">
              <div class="flex justify-between items-end">
                <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold ubuntu">Profile Completion</p>
                <p class="text-xs font-bold text-primary space-font">85%</p>
              </div>
              <div class="h-2.5 w-full bg-surface rounded-full overflow-hidden p-[1px] border border-white/5 shadow-inner">
                <div class="h-full bg-gradient-to-r from-primary to-[#818cf8] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style="width: 85%"></div>
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
import { Camera, User, Info, Copy } from 'lucide-vue-next'
</script>
