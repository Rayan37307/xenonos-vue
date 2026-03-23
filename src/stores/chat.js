import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { channelsAPI, channelMessagesAPI, conversationsAPI, messagesAPI, chatUtilsAPI } from '@/services/chatAPI'

export const useChatStore = defineStore('chat', () => {
  // State
  const channels = ref([])
  const currentChannel = ref(null)
  const channelMessages = ref([])
  
  const conversations = ref([])
  const currentConversation = ref(null)
  const conversationMessages = ref([])
  
  const loading = ref(false)
  const error = ref(null)
  const onlineUsers = ref({})

  // Computed
  const hasUnreadChannels = computed(() => 
    channels.value.some(c => c.unread_count > 0)
  )

  const hasUnreadConversations = computed(() => 
    conversations.value.some(c => c.unread_count > 0)
  )

  const totalUnreadCount = computed(() => {
    const channelUnread = channels.value.reduce((sum, c) => sum + (c.unread_count || 0), 0)
    const conversationUnread = conversations.value.reduce((sum, c) => sum + (c.unread_count || 0), 0)
    return channelUnread + conversationUnread
  })

  // Channels Actions
  async function fetchChannels(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await channelsAPI.list(params)
      const payload = response.data
      channels.value = Array.isArray(payload) ? payload : (payload.data || [])
      return { success: true, data: channels.value }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch channels'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchChannel(id) {
    loading.value = true
    error.value = null
    try {
      const response = await channelsAPI.get(id)
      currentChannel.value = response.data
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch channel'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function createChannel(data) {
    loading.value = true
    error.value = null
    try {
      const response = await channelsAPI.create(data)
      channels.value.push(response.data)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create channel'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateChannel(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await channelsAPI.update(id, data)
      const index = channels.value.findIndex(c => c.id === id)
      if (index !== -1) {
        channels.value[index] = response.data
      }
      if (currentChannel.value?.id === id) {
        currentChannel.value = response.data
      }
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update channel'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function deleteChannel(id) {
    loading.value = true
    error.value = null
    try {
      await channelsAPI.delete(id)
      channels.value = channels.value.filter(c => c.id !== id)
      if (currentChannel.value?.id === id) {
        currentChannel.value = null
      }
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete channel'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function addChannelMember(channelId, userId) {
    loading.value = true
    error.value = null
    try {
      await channelsAPI.addMember(channelId, userId)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add member'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function removeChannelMember(channelId, userId) {
    loading.value = true
    error.value = null
    try {
      await channelsAPI.removeMember(channelId, userId)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to remove member'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Channel Messages Actions
  async function fetchChannelMessages(channelId, params = { page: 1, per_page: 20 }) {
    loading.value = true
    error.value = null
    try {
      const response = await channelMessagesAPI.list(channelId, params)
      const payload = response.data
      channelMessages.value = Array.isArray(payload) ? payload : (payload.data || [])
      return { success: true, data: channelMessages.value }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch messages'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function sendChannelMessage(channelId, content, attachments = []) {
    loading.value = true
    error.value = null
    try {
      const isMultipart = attachments.length > 0
      let payload

      if (isMultipart) {
        payload = new FormData()
        payload.append('content', content)
        attachments.forEach((file, index) => {
          payload.append(`attachments[${index}]`, file)
        })
      } else {
        payload = { content }
      }

      const response = await channelMessagesAPI.send(channelId, payload)
      channelMessages.value.push(response.data)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to send message'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Conversations Actions (Direct Messages)
  async function fetchConversations(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await conversationsAPI.list(params)
      const payload = response.data
      conversations.value = Array.isArray(payload) ? payload : (payload.data || [])
      return { success: true, data: conversations.value }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch conversations'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function startConversation(userId) {
    loading.value = true
    error.value = null
    try {
      const response = await conversationsAPI.create(userId)
      const existingIndex = conversations.value.findIndex(c => c.id === response.data.id)
      if (existingIndex === -1) {
        conversations.value.unshift(response.data)
      }
      currentConversation.value = response.data
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to start conversation'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchConversationMessages(conversationId, params = { page: 1, per_page: 20 }) {
    loading.value = true
    error.value = null
    try {
      const response = await conversationsAPI.getMessages(conversationId, params)
      const payload = response.data
      conversationMessages.value = Array.isArray(payload) ? payload : (payload.data || [])
      return { success: true, data: conversationMessages.value }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch messages'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function sendDirectMessage(conversationId, content, attachments = []) {
    loading.value = true
    error.value = null
    try {
      const isMultipart = attachments.length > 0
      let payload

      if (isMultipart) {
        payload = new FormData()
        payload.append('content', content)
        attachments.forEach((file, index) => {
          payload.append(`attachments[${index}]`, file)
        })
      } else {
        payload = { content }
      }

      const response = await conversationsAPI.send(conversationId, payload)
      conversationMessages.value.push(response.data)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to send message'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Message Actions (Edit, Delete, Reactions)
  async function editMessage(messageId, content) {
    loading.value = true
    error.value = null
    try {
      const response = await messagesAPI.edit(messageId, content)
      
      // Update in channelMessages
      let msgIndex = channelMessages.value.findIndex(m => m.id === messageId)
      if (msgIndex !== -1) {
        channelMessages.value[msgIndex] = response.data
      }
      
      // Update in conversationMessages
      msgIndex = conversationMessages.value.findIndex(m => m.id === messageId)
      if (msgIndex !== -1) {
        conversationMessages.value[msgIndex] = response.data
      }
      
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to edit message'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function deleteMessage(messageId) {
    loading.value = true
    error.value = null
    try {
      await messagesAPI.delete(messageId)
      channelMessages.value = channelMessages.value.filter(m => m.id !== messageId)
      conversationMessages.value = conversationMessages.value.filter(m => m.id !== messageId)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete message'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function markMessageAsRead(messageId) {
    loading.value = true
    error.value = null
    try {
      await messagesAPI.markAsRead(messageId)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to mark as read'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function addMessageReaction(messageId, emoji) {
    loading.value = true
    error.value = null
    try {
      const response = await messagesAPI.addReaction(messageId, emoji)
      
      // Update reactions in channelMessages
      let msgIndex = channelMessages.value.findIndex(m => m.id === messageId)
      if (msgIndex !== -1) {
        channelMessages.value[msgIndex].reactions = response.data.reactions
      }
      
      // Update reactions in conversationMessages
      msgIndex = conversationMessages.value.findIndex(m => m.id === messageId)
      if (msgIndex !== -1) {
        conversationMessages.value[msgIndex].reactions = response.data.reactions
      }
      
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add reaction'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function removeMessageReaction(messageId, emoji) {
    loading.value = true
    error.value = null
    try {
      const response = await messagesAPI.removeReaction(messageId, emoji)
      
      // Update reactions in channelMessages
      let msgIndex = channelMessages.value.findIndex(m => m.id === messageId)
      if (msgIndex !== -1) {
        channelMessages.value[msgIndex].reactions = response.data.reactions
      }
      
      // Update reactions in conversationMessages
      msgIndex = conversationMessages.value.findIndex(m => m.id === messageId)
      if (msgIndex !== -1) {
        conversationMessages.value[msgIndex].reactions = response.data.reactions
      }
      
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to remove reaction'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Utility Actions
  async function fetchOnlineStatus(userIds = []) {
    try {
      const response = await chatUtilsAPI.getOnlineStatus(userIds)
      onlineUsers.value = response.data.data || {}
      return { success: true, data: onlineUsers.value }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  async function searchMessages(query, params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await chatUtilsAPI.search(query, params)
      const payload = response.data
      const results = Array.isArray(payload) ? payload : (payload.data || [])
      return { success: true, data: results }
    } catch (err) {
      error.value = err.response?.data?.message || 'Search failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function uploadFile(file) {
    loading.value = true
    error.value = null
    try {
      const response = await chatUtilsAPI.upload(file)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Upload failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Clear Actions
  function clearCurrentChannel() {
    currentChannel.value = null
    channelMessages.value = []
  }

  function clearCurrentConversation() {
    currentConversation.value = null
    conversationMessages.value = []
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    channels,
    currentChannel,
    channelMessages,
    conversations,
    currentConversation,
    conversationMessages,
    loading,
    error,
    onlineUsers,
    
    // Computed
    hasUnreadChannels,
    hasUnreadConversations,
    totalUnreadCount,
    
    // Channel Actions
    fetchChannels,
    fetchChannel,
    createChannel,
    updateChannel,
    deleteChannel,
    addChannelMember,
    removeChannelMember,
    
    // Channel Messages Actions
    fetchChannelMessages,
    sendChannelMessage,
    
    // Conversation Actions
    fetchConversations,
    startConversation,
    fetchConversationMessages,
    sendDirectMessage,
    
    // Message Actions
    editMessage,
    deleteMessage,
    markMessageAsRead,
    addMessageReaction,
    removeMessageReaction,
    
    // Utility Actions
    fetchOnlineStatus,
    searchMessages,
    uploadFile,
    
    // Clear Actions
    clearCurrentChannel,
    clearCurrentConversation,
    clearError
  }
})
