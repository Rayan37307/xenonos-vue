import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listFiles, getFile, uploadFile, uploadExternalLink, deleteFile, downloadFile } from '@/services/api'

export const useFilesStore = defineStore('files', () => {
  // State
  const files = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    total: 0,
    page: 1,
    perPage: 20,
    totalPages: 0
  })

  // Helper to map API file to frontend format
  function mapFile(apiFile) {
    const { icon, bgClass, textClass } = getFileIconConfig(apiFile.mime_type, apiFile.is_external)
    
    return {
      id: apiFile.id,
      name: apiFile.original_name || apiFile.name,
      description: getFileDescription(apiFile.mime_type, apiFile.is_external),
      size: formatFileSize(apiFile.size, apiFile.is_external),
      modified: formatDate(apiFile.updated_at || apiFile.created_at),
      created: formatDate(apiFile.created_at),
      icon,
      bgClass,
      textClass,
      mime_type: apiFile.mime_type,
      is_external: apiFile.is_external,
      external_link: apiFile.external_link,
      url: apiFile.url,
      download_url: apiFile.download_url,
      fileable_type: apiFile.fileable_type,
      fileable_id: apiFile.fileable_id,
      uploaded_by: apiFile.uploaded_by,
      uploader: apiFile.uploader
    }
  }

  function getFileIconConfig(mimeType, isExternal) {
    if (isExternal) {
      return {
        icon: 'Link',
        bgClass: 'bg-blue-500/10 border-blue-500/20',
        textClass: 'text-blue-400'
      }
    }

    if (mimeType?.includes('pdf')) {
      return { icon: 'FileText', bgClass: 'bg-red-500/10 border-red-500/20', textClass: 'text-red-400' }
    }
    if (mimeType?.includes('image')) {
      return { icon: 'Image', bgClass: 'bg-indigo-500/10 border-indigo-500/20', textClass: 'text-indigo-400' }
    }
    if (mimeType?.includes('zip') || mimeType?.includes('rar') || mimeType?.includes('tar')) {
      return { icon: 'Archive', bgClass: 'bg-amber-500/10 border-amber-500/20', textClass: 'text-amber-400' }
    }
    if (mimeType?.includes('video')) {
      return { icon: 'Video', bgClass: 'bg-purple-500/10 border-purple-500/20', textClass: 'text-purple-400' }
    }
    if (mimeType?.includes('json') || mimeType?.includes('xml')) {
      return { icon: 'Braces', bgClass: 'bg-emerald-500/10 border-emerald-500/20', textClass: 'text-emerald-400' }
    }
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('csv') || mimeType?.includes('excel')) {
      return { icon: 'FileSpreadsheet', bgClass: 'bg-green-500/10 border-green-500/20', textClass: 'text-green-400' }
    }
    if (mimeType?.includes('word') || mimeType?.includes('document')) {
      return { icon: 'FileText', bgClass: 'bg-blue-500/10 border-blue-500/20', textClass: 'text-blue-400' }
    }

    return { icon: 'File', bgClass: 'bg-slate-500/10 border-slate-500/20', textClass: 'text-slate-400' }
  }

  function getFileDescription(mimeType, isExternal) {
    if (isExternal) {
      return 'External Link'
    }
    
    const typeMap = {
      'pdf': 'Document',
      'image': 'Image File',
      'zip': 'Archive',
      'video': 'Video File',
      'json': 'Config File',
      'spreadsheet': 'Spreadsheet',
      'word': 'Document'
    }

    for (const [key, desc] of Object.entries(typeMap)) {
      if (mimeType?.includes(key)) {
        return desc
      }
    }

    return 'File'
  }

  function formatFileSize(bytes, isExternal) {
    if (isExternal) {
      return 'External Link'
    }
    
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  function formatDate(dateString) {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Actions
  async function fetchFiles(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await listFiles(params)
      const apiFiles = response.files?.data || response.files || []
      files.value = apiFiles.map(mapFile)
      
      // Handle pagination
      if (response.files?.meta) {
        pagination.value = {
          total: response.files.meta.total || 0,
          page: response.files.meta.current_page || 1,
          perPage: response.files.meta.per_page || 20,
          totalPages: response.files.meta.last_page || 0
        }
      }
      
      return files.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load files'
      console.error('Failed to fetch files:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function uploadNewFile(file, options = {}) {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (options.name) formData.append('name', options.name)
      if (options.fileable_type) formData.append('fileable_type', options.fileable_type)
      if (options.fileable_id) formData.append('fileable_id', options.fileable_id)

      const response = await uploadFile(formData)
      await fetchFiles()
      return response.file
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to upload file'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadExternalLinkData(link, name, options = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await uploadExternalLink({
        external_link: link,
        name: name,
        ...options
      })
      await fetchFiles()
      return response.file
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add external link'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteFileById(fileId) {
    loading.value = true
    error.value = null
    try {
      await deleteFile(fileId)
      files.value = files.value.filter(f => f.id !== fileId)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete file'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function downloadFileById(fileId) {
    try {
      const response = await downloadFile(fileId)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to download file'
      throw err
    }
  }

  function clearFiles() {
    files.value = []
    error.value = null
  }

  return {
    files,
    loading,
    error,
    pagination,
    fetchFiles,
    uploadNewFile,
    uploadExternalLinkData,
    deleteFileById,
    downloadFileById,
    clearFiles
  }
})
