<template>
  <AppLayout>
    <div class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Page Header -->
      <header>
        <div class="flex items-center gap-3 mb-4">
          <span class="h-px w-8 bg-primary"></span>
          <span class="text-primary text-[10px] font-bold uppercase tracking-widest ubuntu">Solutions Catalog</span>
        </div>
        <h1 class="text-4xl font-bold text-white tracking-tight mb-4 max-w-2xl leading-tight font-headline">
          Elevate your <span class="text-primary">infrastructure.</span>
        </h1>
        <p class="text-slate-400 max-w-xl text-sm leading-relaxed font-medium outfit">
          Select from our suite of premium enterprise services designed to accelerate your growth.
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="service in services" :key="service.title" :class="['rounded-2xl p-8 border border-white/5 hover:bg-surface-container/50 transition-all duration-500 group flex flex-col h-full hover:-translate-y-1 shadow-xl relative overflow-hidden', service.borderHover]">
          <div :class="['absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity', service.gradient]"></div>
          <div :class="['w-14 h-14 border rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner relative z-10', service.iconBg, service.iconBorder, service.iconText]">
            <component :is="service.icon" class="w-7 h-7" />
          </div>
          <div class="flex-grow relative z-10">
            <h3 :class="['text-xl font-bold group-hover:transition-colors font-headline', service.titleHover]">{{ service.title }}</h3>
            <p class="text-sm text-slate-400 leading-relaxed mb-6 mt-3 outfit">{{ service.description }}</p>
            <div class="flex flex-wrap gap-2 mb-8">
              <span v-for="tag in service.tags" :key="tag" class="px-2.5 py-1 bg-surface-container border border-white/5 text-slate-400 text-[9px] uppercase tracking-widest rounded shadow-sm font-bold ubuntu">{{ tag }}</span>
            </div>
          </div>
          <div class="mt-auto pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
            <span class="text-2xl font-bold text-white space-font tracking-tight">
              {{ service.price }}<span class="text-[10px] text-slate-500 font-normal ml-1 tracking-widest uppercase">{{ service.priceUnit }}</span>
            </span>
            <button :class="['px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] active:scale-95 flex items-center gap-2 ubuntu', service.buttonClass]">
              Order Now <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Custom Request Box -->
        <div class="bg-surface/60 rounded-2xl p-8 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-all duration-500 group flex flex-col h-full hover:-translate-y-1 shadow-xl">
          <div class="w-14 h-14 bg-surface-container-high border border-white/10 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-inner group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/20">
            <Sparkles class="w-7 h-7" />
          </div>
          <div class="flex-grow">
            <h3 class="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors font-headline">Custom Request</h3>
            <p class="text-sm text-slate-400 leading-relaxed mb-6 mt-3 outfit">Have a unique project in mind? Our team can architect a bespoke solution tailored to your exact needs.</p>
          </div>
          <div class="mt-auto pt-6 border-t border-white/5">
            <button class="w-full py-3.5 bg-surface-container-high border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#2d3a4d] transition-all shadow-xl ubuntu">
              Open Inquiry
            </button>
          </div>
        </div>
      </div>

      <!-- CTA Banner -->
      <div class="mt-14 p-10 md:p-14 rounded-3xl bg-gradient-to-r from-[#5355e1] to-[#818cf8] flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl shadow-primary/20 relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full -mr-64 -mt-64 blur-[100px] transform group-hover:scale-110 transition-transform duration-1000"></div>
        <div class="relative z-10 max-w-xl">
          <h2 class="text-3xl font-bold mb-3 text-white font-headline tracking-tight">Ready to deploy?</h2>
          <p class="text-white/80 text-sm font-medium outfit leading-relaxed">Our elite engineering and design teams initiate most enterprise services within 24 hours of checkout.</p>
        </div>
        <div class="flex flex-wrap items-center gap-6 relative z-10 shrink-0">
          <button class="text-white/80 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors ubuntu">View Terms</button>
          <button class="px-8 py-4 bg-white text-primary font-bold uppercase tracking-widest rounded-xl shadow-2xl hover:scale-105 transition-transform active:scale-95 text-[10px] ubuntu">
            Explore Full Library
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { Brush, Code, Cloud, Shield, Sparkles, ArrowRight } from 'lucide-vue-next'

const services = [
  { title: 'Custom UI/UX Design', description: 'Transformation of your digital identity through high-fidelity prototypes and conversion-optimized interfaces.', tags: ['Design Systems', 'User Testing'], price: '$4,999', priceUnit: '/project', icon: Brush, iconBg: 'bg-primary/10', iconBorder: 'border-primary/20', iconText: 'text-primary', titleHover: 'group-hover:text-primary', gradient: 'from-primary/[0.02] to-transparent', borderHover: 'hover:border-primary/30', buttonClass: 'bg-primary text-white hover:bg-[#5355e1]' },
  { title: 'Full-stack Engineering', description: 'End-to-end engineering from scalable backends to reactive frontends. Built for high performance.', tags: ['React', 'Node.js'], price: '$120', priceUnit: '/hr', icon: Code, iconBg: 'bg-amber-500/10', iconBorder: 'border-amber-500/20', iconText: 'text-amber-400', titleHover: 'group-hover:text-amber-400', gradient: 'from-orange-500/[0.02] to-transparent', borderHover: 'hover:border-orange-500/30', buttonClass: 'w-10 h-10 rounded-xl bg-surface-container-high border border-white/5 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-surface hover:border-transparent transition-all shadow-xl' },
  { title: 'Cloud Infrastructure', description: 'AWS/Azure architecture setup with automated CI/CD pipelines and 99.9% uptime guarantee.', tags: ['DevOps', 'Security'], price: '$1,250', priceUnit: '/mo', icon: Cloud, iconBg: 'bg-primary/10', iconBorder: 'border-primary/20', iconText: 'text-primary', titleHover: 'group-hover:text-primary', gradient: 'from-primary/[0.02] to-transparent', borderHover: 'hover:border-primary/30', buttonClass: 'w-10 h-10 rounded-xl bg-surface-container-high border border-white/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-transparent transition-all shadow-xl' },
  { title: 'Security Audit', description: 'Comprehensive penetration testing and vulnerability assessment for enterprise applications.', tags: ['Pentest', 'Compliance'], price: '$2,800', priceUnit: '/audit', icon: Shield, iconBg: 'bg-rose-500/10', iconBorder: 'border-rose-500/20', iconText: 'text-rose-400', titleHover: 'group-hover:text-rose-400', gradient: 'from-rose-500/[0.02] to-transparent', borderHover: 'hover:border-rose-500/30', buttonClass: 'w-10 h-10 rounded-xl bg-surface-container-high border border-white/5 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white hover:border-transparent transition-all shadow-xl' }
]
</script>
