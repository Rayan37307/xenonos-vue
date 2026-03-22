<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-white font-headline">Notification Details</h1>
      </div>
      <div class="bg-surface-container/50 border border-white/5 rounded-2xl p-12 text-center">
        <BellRing class="w-16 h-16 text-slate-500 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white mb-2">Notification Details View</h3>
        <p class="text-slate-400 outfit">This page shows detailed notification information.</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { BellRing } from 'lucide-vue-next'
</script>
