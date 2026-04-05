<template>
  <AppLayout>
    <div v-if="clientsStore.loading" class="bg-surface/60 border border-white/5 rounded-2xl p-12 text-center">
      <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      <p class="text-slate-400 text-sm mt-4 outfit">Loading client details...</p>
    </div>

    <div v-else-if="!client" class="bg-surface/60 border border-white/5 rounded-2xl p-12 text-center">
      <Users class="w-16 h-16 text-slate-600 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-white font-headline mb-2">Client Not Found</h3>
      <button @click="router.push('/clients')" class="mt-4 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-primary/90 transition-all ubuntu">
        Back to Clients
      </button>
    </div>

    <div v-else class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <button @click="router.push('/clients')" class="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-4xl font-bold font-headline text-white tracking-tight uppercase">{{ client.company_name || client.user?.name || 'Client' }}</h1>
            <p class="text-slate-400 text-sm mt-1 outfit">{{ client.user?.email }} · Joined {{ formatDate(client.created_at) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span :class="['px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border ubuntu', statusClass(client.status)]">
            {{ client.status }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-surface/60 border border-white/5 rounded-2xl p-6">
          <div class="flex items-center gap-3 mb-2">
            <FolderOpen class="w-5 h-5 text-primary" />
            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500 ubuntu">Projects</span>
          </div>
          <p class="text-3xl font-bold text-white space-font">{{ client.projects_count || 0 }}</p>
        </div>
        <div class="bg-surface/60 border border-white/5 rounded-2xl p-6">
          <div class="flex items-center gap-3 mb-2">
            <FileText class="w-5 h-5 text-emerald-400" />
            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500 ubuntu">Invoices</span>
          </div>
          <p class="text-3xl font-bold text-white space-font">{{ client.invoices_count || 0 }}</p>
        </div>
        <div class="bg-surface/60 border border-white/5 rounded-2xl p-6">
          <div class="flex items-center gap-3 mb-2">
            <Layers class="w-5 h-5 text-amber-400" />
            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500 ubuntu">Service Orders</span>
          </div>
          <p class="text-3xl font-bold text-white space-font">{{ client.service_orders_count || 0 }}</p>
        </div>
        <div class="bg-surface/60 border border-white/5 rounded-2xl p-6">
          <div class="flex items-center gap-3 mb-2">
            <Phone class="w-5 h-5 text-blue-400" />
            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500 ubuntu">Phone</span>
          </div>
          <p class="text-lg font-bold text-white outfit">{{ client.phone || '—' }}</p>
        </div>
      </div>

      <div class="bg-surface/60 border border-white/5 rounded-2xl overflow-hidden">
        <div class="flex border-b border-white/5">
          <button 
            v-for="tab in tabs" 
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="['px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all ubuntu', activeTab === tab.key ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300']"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="p-6">
          <div v-if="activeTab === 'overview'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4 ubuntu">Contact Information</h3>
                <dl class="space-y-3">
                  <div class="flex justify-between py-2 border-b border-white/5">
                    <dt class="text-xs text-slate-500 uppercase ubuntu">Full Name</dt>
                    <dd class="text-sm text-white outfit">{{ client.user?.name || '—' }}</dd>
                  </div>
                  <div class="flex justify-between py-2 border-b border-white/5">
                    <dt class="text-xs text-slate-500 uppercase ubuntu">Email</dt>
                    <dd class="text-sm text-white outfit">{{ client.user?.email || '—' }}</dd>
                  </div>
                  <div class="flex justify-between py-2 border-b border-white/5">
                    <dt class="text-xs text-slate-500 uppercase ubuntu">Phone</dt>
                    <dd class="text-sm text-white outfit">{{ client.phone || '—' }}</dd>
                  </div>
                  <div class="flex justify-between py-2 border-b border-white/5">
                    <dt class="text-xs text-slate-500 uppercase ubuntu">Company</dt>
                    <dd class="text-sm text-white outfit">{{ client.company_name || '—' }}</dd>
                  </div>
                  <div class="flex justify-between py-2 border-b border-white/5">
                    <dt class="text-xs text-slate-500 uppercase ubuntu">Address</dt>
                    <dd class="text-sm text-white outfit">{{ client.address || '—' }}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4 ubuntu">Admin Notes</h3>
                <div class="bg-surface-container/50 border border-white/5 rounded-xl p-4">
                  <p class="text-sm text-slate-300 outfit">{{ client.notes || 'No notes added yet.' }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'projects'">
            <div v-if="client.projects?.length" class="space-y-3">
              <div v-for="project in client.projects" :key="project.id" class="flex items-center justify-between p-4 bg-surface-container/50 border border-white/5 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer" @click="router.push(`/project-details?id=${project.id}`)">
                <div>
                  <p class="text-sm font-medium text-white outfit">{{ project.name }}</p>
                  <p class="text-xs text-slate-500 outfit">{{ project.status }}</p>
                </div>
                <span :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ubuntu', projectStatusClass(project.status)]">
                  {{ project.status }}
                </span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <FolderOpen class="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p class="text-slate-400 text-sm outfit">No projects assigned to this client.</p>
            </div>
          </div>

          <div v-if="activeTab === 'invoices'">
            <div v-if="client.invoices?.length" class="space-y-3">
              <div v-for="invoice in client.invoices" :key="invoice.id" class="flex items-center justify-between p-4 bg-surface-container/50 border border-white/5 rounded-xl">
                <div>
                  <p class="text-sm font-medium text-white outfit">Invoice #{{ invoice.id }}</p>
                  <p class="text-xs text-slate-500 outfit">{{ formatDate(invoice.date_issued) }}</p>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-sm font-bold text-white space-font">${{ invoice.amount }}</span>
                  <span :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ubuntu', invoiceStatusClass(invoice.status)]">
                    {{ invoice.status }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <FileText class="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p class="text-slate-400 text-sm outfit">No invoices for this client.</p>
            </div>
          </div>

          <div v-if="activeTab === 'service-orders'">
            <div v-if="client.service_orders?.length" class="space-y-3">
              <div v-for="order in client.service_orders" :key="order.id" class="flex items-center justify-between p-4 bg-surface-container/50 border border-white/5 rounded-xl">
                <div>
                  <p class="text-sm font-medium text-white outfit">{{ order.title }}</p>
                  <p class="text-xs text-slate-500 outfit">{{ order.service_type }}</p>
                </div>
                <span :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ubuntu', serviceOrderStatusClass(order.status)]">
                  {{ order.status }}
                </span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <Layers class="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p class="text-slate-400 text-sm outfit">No service orders from this client.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { ArrowLeft, Users, FolderOpen, FileText, Layers, Phone } from 'lucide-vue-next'
import { useClientsStore } from '@/stores/clients'

const router = useRouter()
const route = useRoute()
const clientsStore = useClientsStore()

const activeTab = ref('overview')

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'projects', label: 'Projects' },
  { key: 'invoices', label: 'Invoices' },
  { key: 'service-orders', label: 'Service Orders' }
]

const client = computed(() => clientsStore.currentClient)

function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusClass(status) {
  const classes = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    inactive: 'bg-slate-500/10 text-slate-400 border-white/10'
  }
  return classes[status] || classes.inactive
}

function projectStatusClass(status) {
  const classes = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    completed: 'bg-slate-500/10 text-slate-400 border-white/10',
    planning: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    on_hold: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20'
  }
  return classes[status] || classes.planning
}

function invoiceStatusClass(status) {
  const classes = {
    paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    unpaid: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    overdue: 'bg-red-500/10 text-red-400 border-red-500/20'
  }
  return classes[status] || classes.unpaid
}

function serviceOrderStatusClass(status) {
  const classes = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    in_progress: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20'
  }
  return classes[status] || classes.pending
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    clientsStore.fetchClient(id)
  }
})
</script>
