<template>
  <AppLayout>
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-4xl font-bold font-headline text-white tracking-tight uppercase">Clients</h1>
          <p class="text-slate-400 text-sm mt-2 max-w-md font-medium outfit">Manage your client relationships and accounts.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="relative">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              v-model="searchQuery"
              @input="debounceSearch"
              type="text" 
              placeholder="Search clients..." 
              class="pl-10 pr-4 py-2 bg-surface-container/80 border border-white/5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 outfit"
            />
          </div>
          <div class="flex p-1 bg-surface-container/80 backdrop-blur-md border border-white/5 rounded-xl">
            <button 
              @click="filterStatus = 'all'; fetchClients()"
              :class="['px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ubuntu', filterStatus === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300']"
            >All</button>
            <button 
              @click="filterStatus = 'active'; fetchClients()"
              :class="['px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ubuntu', filterStatus === 'active' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300']"
            >Active</button>
            <button 
              @click="filterStatus = 'inactive'; fetchClients()"
              :class="['px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ubuntu', filterStatus === 'inactive' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300']"
            >Inactive</button>
          </div>
          <button 
            @click="showCreateModal = true"
            class="px-5 py-2 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-primary/90 transition-all ubuntu flex items-center gap-2"
          >
            <Plus class="w-3.5 h-3.5" />
            Add Client
          </button>
        </div>
      </div>

      <div v-if="clientsStore.loading" class="bg-surface/60 border border-white/5 rounded-2xl p-12 text-center">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p class="text-slate-400 text-sm mt-4 outfit">Loading clients...</p>
      </div>

      <div v-else-if="clientsStore.clients.length === 0" class="bg-surface/60 border border-white/5 rounded-2xl p-12 text-center">
        <Users class="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white font-headline mb-2">No Clients Found</h3>
        <p class="text-slate-400 text-sm outfit mb-6">Add your first client to get started.</p>
        <button 
          @click="showCreateModal = true"
          class="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-primary/90 transition-all ubuntu"
        >
          Add First Client
        </button>
      </div>

      <div v-else>
        <div class="bg-surface/60 border border-white/5 rounded-2xl overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="border-b border-white/5">
                <th class="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 ubuntu">Client</th>
                <th class="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 ubuntu">Company</th>
                <th class="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 ubuntu">Status</th>
                <th class="text-center px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 ubuntu">Projects</th>
                <th class="text-center px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 ubuntu">Invoices</th>
                <th class="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 ubuntu">Joined</th>
                <th class="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 ubuntu">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="client in clientsStore.clients" 
                :key="client.id"
                class="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                @click="viewClient(client.id)"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                      <span class="text-primary font-bold text-sm">{{ client.user?.name?.charAt(0) || '?' }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-white outfit">{{ client.user?.name || 'N/A' }}</p>
                      <p class="text-xs text-slate-500 outfit">{{ client.user?.email || '' }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-slate-300 outfit">{{ client.company_name || '—' }}</p>
                </td>
                <td class="px-6 py-4">
                  <span :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ubuntu', statusClass(client.status)]">
                    {{ client.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="text-sm text-white space-font">{{ client.projects_count || 0 }}</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="text-sm text-white space-font">{{ client.invoices_count || 0 }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs text-slate-400 outfit">{{ formatDate(client.created_at) }}</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2" @click.stop>
                    <button @click="viewClient(client.id)" class="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-white/5">
                      <Eye class="w-4 h-4" />
                    </button>
                    <button @click="confirmDelete(client)" class="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="clientsStore.pagination.last_page > 1" class="flex items-center justify-between mt-6">
          <p class="text-sm text-slate-400 outfit">
            Showing {{ ((clientsStore.pagination.current_page - 1) * clientsStore.pagination.per_page) + 1 }} to {{ Math.min(clientsStore.pagination.current_page * clientsStore.pagination.per_page, clientsStore.pagination.total) }} of {{ clientsStore.pagination.total }} clients
          </p>
          <div class="flex gap-2">
            <button 
              @click="goToPage(clientsStore.pagination.current_page - 1)"
              :disabled="clientsStore.pagination.current_page <= 1"
              class="px-4 py-2 bg-surface-container/80 border border-white/5 rounded-xl text-sm text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all outfit"
            >
              Previous
            </button>
            <button 
              @click="goToPage(clientsStore.pagination.current_page + 1)"
              :disabled="clientsStore.pagination.current_page >= clientsStore.pagination.last_page"
              class="px-4 py-2 bg-surface-container/80 border border-white/5 rounded-xl text-sm text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all outfit"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showCreateModal = false">
      <div class="bg-surface border border-white/10 rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl">
        <h2 class="text-2xl font-bold text-white font-headline mb-6">Add New Client</h2>
        <form @submit.prevent="handleCreate" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ubuntu">Full Name *</label>
              <input v-model="createForm.name" type="text" required class="w-full px-4 py-3 bg-surface-container/80 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 outfit" placeholder="John Doe" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ubuntu">Email *</label>
              <input v-model="createForm.email" type="email" required class="w-full px-4 py-3 bg-surface-container/80 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 outfit" placeholder="john@example.com" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ubuntu">Company Name</label>
            <input v-model="createForm.company_name" type="text" class="w-full px-4 py-3 bg-surface-container/80 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 outfit" placeholder="Acme Corp" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ubuntu">Phone</label>
              <input v-model="createForm.phone" type="text" class="w-full px-4 py-3 bg-surface-container/80 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 outfit" placeholder="+1 234 567 890" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ubuntu">Status</label>
              <select v-model="createForm.status" class="w-full px-4 py-3 bg-surface-container/80 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 outfit">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ubuntu">Address</label>
            <textarea v-model="createForm.address" rows="2" class="w-full px-4 py-3 bg-surface-container/80 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 outfit resize-none" placeholder="123 Main St, City, Country"></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ubuntu">Notes</label>
            <textarea v-model="createForm.notes" rows="2" class="w-full px-4 py-3 bg-surface-container/80 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 outfit resize-none" placeholder="Admin notes..."></textarea>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showCreateModal = false" class="px-6 py-3 bg-surface-container/80 border border-white/5 rounded-xl text-sm text-slate-400 hover:text-white transition-all outfit">Cancel</button>
            <button type="submit" :disabled="clientsStore.loading" class="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-primary/90 transition-all ubuntu disabled:opacity-50">
              {{ clientsStore.loading ? 'Creating...' : 'Create Client' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showDeleteModal = false">
      <div class="bg-surface border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl text-center">
        <div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle class="w-8 h-8 text-red-400" />
        </div>
        <h3 class="text-xl font-bold text-white font-headline mb-2">Delete Client</h3>
        <p class="text-slate-400 text-sm outfit mb-6">Are you sure you want to delete <strong class="text-white">{{ clientToDelete?.user?.name }}</strong>? This action cannot be undone.</p>
        <div class="flex justify-center gap-3">
          <button @click="showDeleteModal = false" class="px-6 py-3 bg-surface-container/80 border border-white/5 rounded-xl text-sm text-slate-400 hover:text-white transition-all outfit">Cancel</button>
          <button @click="handleDelete" :disabled="clientsStore.loading" class="px-6 py-3 bg-red-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all ubuntu disabled:opacity-50">
            {{ clientsStore.loading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { Search, Plus, Eye, Trash2, Users, AlertTriangle } from 'lucide-vue-next'
import { useClientsStore } from '@/stores/clients'

const router = useRouter()
const clientsStore = useClientsStore()

const searchQuery = ref('')
const filterStatus = ref('all')
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const clientToDelete = ref(null)
let searchTimeout = null

const createForm = ref({
  name: '',
  email: '',
  company_name: '',
  phone: '',
  address: '',
  status: 'active',
  notes: ''
})

function debounceSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchClients()
  }, 300)
}

function fetchClients() {
  const params = {
    page: clientsStore.pagination.current_page,
    per_page: 15,
  }
  if (filterStatus.value !== 'all') params.status = filterStatus.value
  if (searchQuery.value) params.search = searchQuery.value
  clientsStore.fetchClients(params)
}

function goToPage(page) {
  if (page < 1 || page > clientsStore.pagination.last_page) return
  clientsStore.pagination.current_page = page
  fetchClients()
}

function viewClient(id) {
  router.push(`/clients/${id}`)
}

function confirmDelete(client) {
  clientToDelete.value = client
  showDeleteModal.value = true
}

async function handleDelete() {
  try {
    await clientsStore.removeClient(clientToDelete.value.id)
    showDeleteModal.value = false
    clientToDelete.value = null
  } catch (err) {
    alert('Failed to delete client: ' + (err.response?.data?.message || 'Unknown error'))
  }
}

async function handleCreate() {
  try {
    await clientsStore.createNewClient(createForm.value)
    showCreateModal.value = false
    createForm.value = { name: '', email: '', company_name: '', phone: '', address: '', status: 'active', notes: '' }
    fetchClients()
  } catch (err) {
    alert('Failed to create client: ' + (err.response?.data?.message || 'Unknown error'))
  }
}

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

onMounted(() => {
  fetchClients()
})
</script>
