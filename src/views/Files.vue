<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold text-white tracking-tight font-headline uppercase">Files & Deliverables</h1>
          <p class="text-slate-400 text-sm mt-2 max-w-lg font-medium outfit">Access all project assets, brand guidelines, and high-fidelity downloadables.</p>
        </div>
        <div class="flex items-center gap-4">
          <button 
            @click="showUploadModal = true"
            class="px-6 py-3.5 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:bg-[#5355e1] ubuntu flex items-center gap-2"
          >
            <Plus class="w-4 h-4" /> Upload File
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="filesStore.loading && files.length === 0" class="bg-surface/60 border border-white/5 rounded-2xl p-12 text-center">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p class="text-slate-400 text-sm mt-4 outfit">Loading files...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="files.length === 0 && !filesStore.loading" class="bg-surface/60 border border-white/5 rounded-2xl p-12 text-center">
        <Archive class="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white font-headline mb-2">No Files Yet</h3>
        <p class="text-slate-400 text-sm outfit mb-6">Upload files or add external links to get started.</p>
        <button 
          @click="showUploadModal = true"
          class="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#5355e1] transition-all ubuntu"
        >
          Upload Your First File
        </button>
      </div>

      <!-- Files Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="file in files" 
          :key="file.id" 
          class="group bg-surface/60 border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 shadow-xl"
        >
          <div class="flex items-start justify-between mb-6">
            <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center group-hover:text-white transition-all shadow-inner border', file.bgClass, file.textClass]">
              <component :is="getIconComponent(file.icon)" class="w-7 h-7" />
            </div>
            <button 
              @click="confirmDelete(file)"
              class="p-2 text-slate-500 hover:text-red-400 transition-colors"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
          <h3 class="text-lg font-bold text-white mb-1 truncate group-hover:text-primary transition-colors font-headline" :title="file.name">{{ file.name }}</h3>
          <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6 ubuntu">{{ file.description }}</p>
          <div class="grid grid-cols-2 gap-4 py-4 border-t border-white/5">
            <div>
              <p class="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1 ubuntu">Size</p>
              <p class="text-sm font-bold text-slate-300 space-font">{{ file.size }}</p>
            </div>
            <div>
              <p class="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1 ubuntu">Modified</p>
              <p class="text-sm font-bold text-slate-300 space-font">{{ file.modified }}</p>
            </div>
          </div>
          <button 
            @click="handleDownload(file)"
            class="w-full mt-4 py-3 bg-surface-container border border-white/5 text-slate-300 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 ubuntu"
          >
            <Download class="w-4 h-4" /> {{ file.is_external ? 'Open Link' : 'Download File' }}
          </button>
        </div>
      </div>

      <!-- Upload Modal -->
      <div v-if="showUploadModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showUploadModal = false">
        <div class="bg-surface border border-white/5 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-bold text-white font-headline">Upload File</h2>
            <button @click="showUploadModal = false" class="text-slate-500 hover:text-white transition-colors">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Tab Selection -->
          <div class="flex gap-2 mb-6 p-1 bg-surface-container rounded-xl">
            <button 
              @click="uploadTab = 'file'"
              :class="['flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ubuntu', uploadTab === 'file' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white']"
            >
              File Upload
            </button>
            <button 
              @click="uploadTab = 'link'"
              :class="['flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ubuntu', uploadTab === 'link' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white']"
            >
              External Link
            </button>
          </div>

          <!-- File Upload Form -->
          <div v-if="uploadTab === 'file'" class="space-y-6">
            <div class="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer" @click="$refs.fileInput.click()" @dragover.prevent @drop.prevent="handleDrop">
              <input ref="fileInput" type="file" @change="handleFileSelect" class="hidden" accept="*/*" />
              <CloudUpload class="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p class="text-white font-bold mb-1 outfit">{{ selectedFile ? selectedFile.name : 'Drop file here or click to browse' }}</p>
              <p class="text-slate-500 text-xs ubuntu">Maximum file size: 100MB. For larger files, use external link.</p>
            </div>
            <div v-if="selectedFile" class="bg-surface-container-high rounded-xl p-4 flex items-center gap-4">
              <File class="w-8 h-8 text-primary" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-white truncate outfit">{{ selectedFile.name }}</p>
                <p class="text-xs text-slate-500">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
              <button @click="selectedFile = null" class="text-slate-500 hover:text-red-400">
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- External Link Form -->
          <div v-if="uploadTab === 'link'" class="space-y-6">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ubuntu">File Name</label>
              <input 
                v-model="externalLinkData.name"
                type="text" 
                placeholder="e.g., Project Assets"
                class="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors outfit"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ubuntu">External Link</label>
              <input 
                v-model="externalLinkData.link"
                type="url" 
                placeholder="https://drive.google.com/..."
                class="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors outfit"
              />
              <p class="text-slate-500 text-xs mt-2 ubuntu">Supports Google Drive, Dropbox, OneDrive, and other cloud storage links.</p>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="uploadError" class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle class="w-5 h-5 text-red-400" />
            <p class="text-sm text-red-400 outfit">{{ uploadError }}</p>
          </div>

          <!-- Submit Button -->
          <button 
            @click="handleUpload"
            :disabled="uploading || (uploadTab === 'file' && !selectedFile) || (uploadTab === 'link' && !externalLinkData.link)"
            class="w-full py-4 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:bg-[#5355e1] disabled:opacity-50 disabled:cursor-not-allowed ubuntu flex items-center justify-center gap-2"
          >
            <Upload v-if="!uploading" class="w-4 h-4" />
            <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            {{ uploading ? 'Uploading...' : 'Upload' }}
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { 
  FileText, Image, Archive, Video, Braces, Download, MoreHorizontal, 
  Filter, Plus, Trash2, X, CloudUpload, File, Upload, Link as LinkIcon,
  AlertCircle
} from 'lucide-vue-next'
import { useFilesStore } from '@/stores/files'

const filesStore = useFilesStore()

// State
const showUploadModal = ref(false)
const uploadTab = ref('file') // 'file' or 'link'
const selectedFile = ref(null)
const uploading = ref(false)
const uploadError = ref(null)
const externalLinkData = ref({
  name: '',
  link: ''
})

// Computed
const files = computed(() => filesStore.files)

// Icon mapping for dynamic components
const iconComponents = {
  FileText,
  Image,
  Archive,
  Video,
  Braces,
  File,
  Link: LinkIcon
}

function getIconComponent(iconName) {
  return iconComponents[iconName] || File
}

// File handling
function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    uploadError.value = null
  }
}

function handleDrop(event) {
  const file = event.dataTransfer.files[0]
  if (file) {
    selectedFile.value = file
    uploadError.value = null
  }
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

async function handleUpload() {
  uploadError.value = null
  uploading.value = true

  try {
    if (uploadTab.value === 'file' && selectedFile.value) {
      await filesStore.uploadNewFile(selectedFile.value)
    } else if (uploadTab.value === 'link' && externalLinkData.value.link) {
      await filesStore.uploadExternalLinkData(
        externalLinkData.value.link,
        externalLinkData.value.name || 'External File'
      )
    }

    // Reset and close
    selectedFile.value = null
    externalLinkData.value = { name: '', link: '' }
    showUploadModal.value = false
  } catch (err) {
    uploadError.value = err.message || 'Upload failed. Please try again.'
  } finally {
    uploading.value = false
  }
}

async function handleDownload(file) {
  try {
    if (file.is_external) {
      // Open external link in new tab
      window.open(file.external_link, '_blank')
    } else {
      // Download from server
      const response = await filesStore.downloadFileById(file.id)
      if (response.url && response.is_external) {
        window.open(response.url, '_blank')
      }
    }
  } catch (err) {
    alert('Failed to download file: ' + (err.message || 'Unknown error'))
  }
}

async function confirmDelete(file) {
  if (confirm(`Are you sure you want to delete "${file.name}"? This action cannot be undone.`)) {
    try {
      await filesStore.deleteFileById(file.id)
    } catch (err) {
      alert('Failed to delete file: ' + (err.message || 'Unknown error'))
    }
  }
}

onMounted(() => {
  filesStore.fetchFiles()
})
</script>
