import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  listChatChannels,
  getChannelMessages,
  sendChannelMessage,
  listChatConversations,
  getConversationMessages,
  sendConversationMessage,
} from '@/services/api'
import { sha256Hex } from '@/utils/messageHash'

export const useMessagesStore = defineStore('messages', () => {
  const channels = ref([])
  const conversations = ref([])
  const messages = ref([])
  const activeChannelId = ref(null)
  const activeConversationId = ref(null)
  const loadingList = ref(false)
  const loadingMessages = ref(false)
  const sending = ref(false)
  const error = ref(null)

  const activeChannel = computed(() =>
    channels.value.find((c) => c.id === activeChannelId.value) ?? null
  )

  const activeConversation = computed(() =>
    conversations.value.find((c) => c.id === activeConversationId.value) ?? null
  )

  const isDmView = computed(() => activeConversationId.value != null && activeChannelId.value == null)

  async function attachHashVerification(list) {
    const out = []
    for (const m of list) {
      let hashOk = null
      if (m.content_hash && m.content) {
        const local = await sha256Hex(m.content)
        hashOk = local === m.content_hash
      }
      out.push({ ...m, _hashOk: hashOk })
    }
    return out
  }

  async function loadChannels() {
    loadingList.value = true
    error.value = null
    try {
      const data = await listChatChannels()
      channels.value = Array.isArray(data?.data) ? data.data : data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to load channels'
      channels.value = []
    } finally {
      loadingList.value = false
    }
  }

  async function loadConversations() {
    try {
      const data = await listChatConversations()
      conversations.value = Array.isArray(data?.data) ? data.data : data
    } catch (e) {
      conversations.value = []
    }
  }

  function selectChannel(id) {
    activeChannelId.value = id
    activeConversationId.value = null
    messages.value = []
  }

  function selectConversation(id) {
    activeConversationId.value = id
    activeChannelId.value = null
    messages.value = []
  }

  async function openChannel(id) {
    selectChannel(id)
    await fetchChannelMessages(id)
  }

  async function openConversation(id) {
    selectConversation(id)
    await fetchConversationMessages(id)
  }

  async function fetchMessagesForSelection() {
    if (activeChannelId.value) {
      await fetchChannelMessages(activeChannelId.value)
    } else if (activeConversationId.value) {
      await fetchConversationMessages(activeConversationId.value)
    }
  }

  async function fetchChannelMessages(channelId) {
    loadingMessages.value = true
    error.value = null
    try {
      const data = await getChannelMessages(channelId, { per_page: 50 })
      const raw = Array.isArray(data?.data) ? data.data : []
      const chronological = [...raw].reverse()
      messages.value = await attachHashVerification(chronological)
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to load messages'
      messages.value = []
    } finally {
      loadingMessages.value = false
    }
  }

  async function fetchConversationMessages(conversationId) {
    loadingMessages.value = true
    error.value = null
    try {
      const data = await getConversationMessages(conversationId, { per_page: 50 })
      const raw = Array.isArray(data?.data) ? data.data : []
      const chronological = [...raw].reverse()
      messages.value = await attachHashVerification(chronological)
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to load messages'
      messages.value = []
    } finally {
      loadingMessages.value = false
    }
  }

  async function sendCurrentMessage(text) {
    const body = text.trim()
    if (!body) return

    if (activeChannelId.value) {
      sending.value = true
      error.value = null
      try {
        const created = await sendChannelMessage(activeChannelId.value, body)
        const payload = created.data ?? created
        const withHash = await attachHashVerification([payload])
        messages.value = [...messages.value, ...withHash]
      } catch (e) {
        error.value = e.response?.data?.message || 'Failed to send'
      } finally {
        sending.value = false
      }
      return
    }

    if (activeConversationId.value) {
      sending.value = true
      error.value = null
      try {
        const created = await sendConversationMessage(activeConversationId.value, body)
        const payload = created.data ?? created
        const withHash = await attachHashVerification([payload])
        messages.value = [...messages.value, ...withHash]
      } catch (e) {
        error.value = e.response?.data?.message || 'Failed to send'
      } finally {
        sending.value = false
      }
    }
  }

  async function bootstrap() {
    await Promise.all([loadChannels(), loadConversations()])
    if (channels.value.length) {
      await openChannel(channels.value[0].id)
    } else if (conversations.value.length) {
      await openConversation(conversations.value[0].id)
    }
  }

  return {
    channels,
    conversations,
    messages,
    activeChannelId,
    activeConversationId,
    loadingList,
    loadingMessages,
    sending,
    error,
    activeChannel,
    activeConversation,
    isDmView,
    loadChannels,
    loadConversations,
    selectChannel,
    selectConversation,
    openChannel,
    openConversation,
    fetchMessagesForSelection,
    fetchChannelMessages,
    fetchConversationMessages,
    sendCurrentMessage,
    bootstrap,
  }
})
