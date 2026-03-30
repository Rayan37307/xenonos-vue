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
            <button @click="openOrderModal(service)" :class="['px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] active:scale-95 flex items-center gap-2 ubuntu', service.buttonClass]">
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
            <button @click="openOrderModal(null)" class="w-full py-3.5 bg-surface-container-high border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#2d3a4d] transition-all shadow-xl ubuntu">
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

    <!-- Service Order Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" @click.self="closeModal">
      <div class="bg-surface rounded-2xl border border-white/10 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 class="text-xl font-bold text-white font-headline">{{ selectedService ? selectedService.title : 'Custom Request' }}</h2>
            <p class="text-xs text-slate-400 mt-1 outfit">Submit your service order proposal</p>
          </div>
          <button @click="closeModal" class="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="submitOrder" class="p-6 space-y-5">
          <!-- Service Type (hidden if selected service) -->
          <div v-if="!selectedService">
            <label class="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ubuntu">Service Type</label>
            <select v-model="form.service_type" class="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outfit">
              <option value="">Select a service type</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Cloud Infrastructure">Cloud Infrastructure</option>
              <option value="Security Audit">Security Audit</option>
              <option value="Consulting">Consulting</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Title -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ubuntu">Project Title</label>
            <input 
              v-model="form.title" 
              type="text" 
              required
              :placeholder="selectedService ? selectedService.title + ' Project' : 'Enter project title'"
              class="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outfit"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ubuntu">Description</label>
            <textarea 
              v-model="form.description" 
              required
              rows="4"
              placeholder="Describe your project requirements, goals, and any specific features you need..."
              class="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outfit resize-none"
            ></textarea>
          </div>

          <!-- Budget Range -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ubuntu">Min Budget ($)</label>
              <input 
                v-model.number="form.budget_min" 
                type="number" 
                min="0"
                placeholder="5000"
                class="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outfit"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ubuntu">Max Budget ($)</label>
              <input 
                v-model.number="form.budget_max" 
                type="number" 
                min="0"
                placeholder="10000"
                class="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outfit"
              />
            </div>
          </div>

          <!-- Deadline -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ubuntu">Expected Deadline</label>
            <input 
              v-model="form.deadline" 
              type="date" 
              :min="new Date().toISOString().split('T')[0]"
              class="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outfit [color-scheme:dark]"
            />
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full py-4 bg-primary hover:bg-[#5355e1] disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] active:scale-[0.98] text-[10px] ubuntu flex items-center justify-center gap-2"
          >
            <span v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ submitting ? 'Submitting...' : 'Submit Proposal' }}</span>
          </button>

          <p class="text-xs text-slate-500 text-center outfit">
            An admin will review your proposal and get back to you within 24-48 hours.
          </p>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" @click.self="closeSuccessModal">
      <div class="bg-surface rounded-2xl border border-white/10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden p-8 text-center">
        <div class="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check class="w-8 h-8 text-emerald-400" />
        </div>
        <h2 class="text-2xl font-bold text-white font-headline mb-3">Proposal Submitted!</h2>
        <p class="text-sm text-slate-400 outfit leading-relaxed mb-6">
          Your service order has been successfully submitted. Our team will review your proposal and contact you soon.
        </p>
        <button @click="closeSuccessModal" class="px-8 py-3 bg-primary hover:bg-[#5355e1] text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl text-[10px] ubuntu">
          Got It
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { ref, reactive } from 'vue'
import { Brush, Code, Cloud, Shield, Sparkles, ArrowRight, X, Check } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { createServiceOrder } from '@/services/api'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const services = [
  { title: 'Custom UI/UX Design', description: 'Transformation of your digital identity through high-fidelity prototypes and conversion-optimized interfaces.', tags: ['Design Systems', 'User Testing'], price: '$4,999', priceUnit: '/project', icon: Brush, iconBg: 'bg-primary/10', iconBorder: 'border-primary/20', iconText: 'text-primary', titleHover: 'group-hover:text-primary', gradient: 'from-primary/[0.02] to-transparent', borderHover: 'hover:border-primary/30', buttonClass: 'bg-primary text-white hover:bg-[#5355e1]' },
  { title: 'Full-stack Engineering', description: 'End-to-end engineering from scalable backends to reactive frontends. Built for high performance.', tags: ['React', 'Node.js'], price: '$120', priceUnit: '/hr', icon: Code, iconBg: 'bg-amber-500/10', iconBorder: 'border-amber-500/20', iconText: 'text-amber-400', titleHover: 'group-hover:text-amber-400', gradient: 'from-orange-500/[0.02] to-transparent', borderHover: 'hover:border-orange-500/30', buttonClass: 'w-10 h-10 rounded-xl bg-surface-container-high border border-white/5 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-surface hover:border-transparent transition-all shadow-xl' },
  { title: 'Cloud Infrastructure', description: 'AWS/Azure architecture setup with automated CI/CD pipelines and 99.9% uptime guarantee.', tags: ['DevOps', 'Security'], price: '$1,250', priceUnit: '/mo', icon: Cloud, iconBg: 'bg-primary/10', iconBorder: 'border-primary/20', iconText: 'text-primary', titleHover: 'group-hover:text-primary', gradient: 'from-primary/[0.02] to-transparent', borderHover: 'hover:border-primary/30', buttonClass: 'w-10 h-10 rounded-xl bg-surface-container-high border border-white/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-transparent transition-all shadow-xl' },
  { title: 'Security Audit', description: 'Comprehensive penetration testing and vulnerability assessment for enterprise applications.', tags: ['Pentest', 'Compliance'], price: '$2,800', priceUnit: '/audit', icon: Shield, iconBg: 'bg-rose-500/10', iconBorder: 'border-rose-500/20', iconText: 'text-rose-400', titleHover: 'group-hover:text-rose-400', gradient: 'from-rose-500/[0.02] to-transparent', borderHover: 'hover:border-rose-500/30', buttonClass: 'w-10 h-10 rounded-xl bg-surface-container-high border border-white/5 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white hover:border-transparent transition-all shadow-xl' }
]

const showModal = ref(false)
const showSuccessModal = ref(false)
const submitting = ref(false)
const selectedService = ref(null)

const form = reactive({
  service_type: '',
  title: '',
  description: '',
  budget_min: null,
  budget_max: null,
  deadline: ''
})

function openOrderModal(service) {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  selectedService.value = service
  if (service) {
    form.service_type = service.title
    form.title = ''
  }
  form.description = ''
  form.budget_min = null
  form.budget_max = null
  form.deadline = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedService.value = null
}

function closeSuccessModal() {
  showSuccessModal.value = false
  closeModal()
}

async function submitOrder() {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  submitting.value = true
  
  try {
    const payload = {
      service_type: selectedService.value ? selectedService.value.title : form.service_type,
      title: form.title,
      description: form.description,
      budget_min: form.budget_min,
      budget_max: form.budget_max,
      deadline: form.deadline || null
    }

    await createServiceOrder(payload)
    
    showModal.value = false
    showSuccessModal.value = true
  } catch (error) {
    console.error('Failed to submit service order:', error)
    alert(error.response?.data?.message || 'Failed to submit service order. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>
