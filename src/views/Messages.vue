<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-white font-headline">Messages</h1>
      </div>
      <div class="flex flex-1 h-[600px] overflow-hidden bg-surface rounded-2xl border border-white/5">
        <!-- Channels Pane -->
        <div class="w-72 bg-surface-container/50 flex flex-col border-r border-white/5">
          <div class="p-6 space-y-8 h-full overflow-y-auto no-scrollbar">
            <!-- Channels Section -->
            <div>
              <h3 class="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 px-2 ubuntu">Channels</h3>
              <div class="space-y-1">
                <div v-if="chatStore.loading && chatStore.channels.length === 0" class="text-slate-500 text-xs px-3 py-2">
                  Loading channels...
                </div>
                <template v-else-if="chatStore.channels.length > 0">
                  <button 
                    v-for="channel in chatStore.channels" 
                    :key="channel.id"
                    @click="selectChannel(channel)"
                    :class="[
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group text-slate-400 hover:bg-white/[0.03] hover:text-slate-200',
                      currentChannel?.id === channel.id ? 'bg-primary/10 text-white shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]' : ''
                    ]"
                  >
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                      <Hash class="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                      <span class="text-sm tracking-tight font-medium outfit truncate">{{ channel.name }}</span>
                    </div>
                    <div v-if="channel.unread_count > 0" class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                  </button>
                </template>
                <div v-else class="text-slate-500 text-xs px-3 py-2">No channels available</div>
              </div>
            </div>

            <!-- Direct Messages Section -->
            <div>
              <h3 class="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 px-2 ubuntu">Direct Messages</h3>
              <div class="space-y-1 mt-4">
                <div v-if="chatStore.loading && chatStore.conversations.length === 0" class="text-slate-500 text-xs px-3 py-2">
                  Loading conversations...
                </div>
                <template v-else-if="chatStore.conversations.length > 0">
                  <div 
                    v-for="conversation in chatStore.conversations"
                    :key="conversation.id"
                    @click="selectConversation(conversation)"
                    :class="[
                      'flex items-center gap-3 px-3 py-3 cursor-pointer rounded-xl transition-all group',
                      currentConversation?.id === conversation.id ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
                    ]"
                  >
                    <div class="relative">
                      <img class="w-9 h-9 rounded-xl border border-white/5 object-cover" 
                        :src="conversation.user?.avatar || 'https://i.pravatar.cc/150?u=' + conversation.user?.id" 
                        :alt="conversation.user?.name">
                      <div v-if="isUserOnline(conversation.user?.id)" class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-container bg-emerald-500"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-bold truncate text-white tracking-tight outfit">{{ conversation.user?.name || 'Unknown' }}</p>
                      <p class="text-[10px] text-slate-500 truncate font-semibold uppercase tracking-wider mt-0.5 ubuntu">{{ conversation.user?.role || 'User' }}</p>
                    </div>
                  </div>
                </template>
                <div v-else class="text-slate-500 text-xs px-3 py-2">No conversations yet</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 bg-surface flex flex-col relative">
          <template v-if="currentChannel || currentConversation">
            <!-- Header -->
            <div class="px-6 py-5 bg-surface/80 backdrop-blur-xl border-b border-white/5">
              <h2 class="text-xl font-bold text-white tracking-tight font-headline">
                {{ currentChannel?.name || currentConversation?.user?.name || 'Select a channel' }}
              </h2>
            </div>

            <!-- Messages -->
            <div class="flex-1 overflow-y-auto px-6 py-8 space-y-6 no-scrollbar">
              <div v-if="chatStore.loading && messages.length === 0" class="flex items-center justify-center h-full">
                <div class="text-slate-500 text-sm uppercase tracking-widest font-bold ubuntu">Loading messages...</div>
              </div>

              <template v-else-if="messages.length > 0">
                <!-- Date Divider -->
                <div v-if="messages.length > 0" class="flex items-center gap-6">
                  <div class="h-px flex-1 bg-gradient-to-r from-transparent to-white"></div>
                  <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-white ubuntu">Today</span>
                  <div class="h-px flex-1 bg-gradient-to-l from-transparent to-white"></div>
                </div>

                <!-- Message Items -->
                <div v-for="message in messages" :key="message.id" class="flex items-start gap-5 group">
                  <img class="w-11 h-11 rounded-2xl border border-white/5 object-cover" 
                    :src="message.user?.avatar || 'https://i.pravatar.cc/150?u=' + message.user?.id" 
                    :alt="message.user?.name">
                  <div class="flex-1 min-w-0 space-y-2">
                    <span class="text-xs font-bold text-white tracking-tight outfit">{{ message.user?.name || 'Unknown' }}</span>
                    <div class="bg-surface-container p-5 rounded-3xl rounded-tl-none border border-white/5 text-slate-300 outfit relative">
                      {{ message.content }}
                      <div v-if="message.attachments?.length > 0" class="mt-3 space-y-2 pt-3 border-t border-white/5">
                        <div v-for="(attachment, idx) in message.attachments" :key="idx" class="text-[10px] text-primary hover:underline cursor-pointer">
                          📎 {{ attachment.name || 'Attachment' }}
                        </div>
                      </div>
                    </div>
                    <div v-if="message.reactions?.length > 0" class="flex gap-1 flex-wrap">
                      <span v-for="reaction in message.reactions" :key="reaction.emoji" class="text-xs bg-surface-container/50 px-2 py-1 rounded-full border border-white/5">
                        {{ reaction.emoji }}
                      </span>
                    </div>
                    <div class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1 ubuntu">
                      {{ formatTime(message.created_at) }}
                    </div>
                  </div>
                </div>
              </template>

              <div v-else class="flex items-center justify-center h-full">
                <div class="text-slate-500 text-sm uppercase tracking-widest font-bold ubuntu">No messages yet</div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="p-6 bg-surface border-t border-white/5">
              <form @submit.prevent="sendMessage" class="relative bg-surface-container rounded-[2rem] p-2 border border-white/5">
                <textarea 
                  v-model="messageContent"
                  class="w-full bg-transparent border-none text-white py-4 px-6 focus:ring-0 resize-none outfit" 
                  placeholder="Type a message..." 
                  rows="1"
                  @keydown.enter.ctrl="sendMessage"
                ></textarea>
                <div class="flex items-center justify-between px-3 pb-2">
                  <div class="flex items-center gap-1">
                    <button type="button" class="p-2 text-slate-500 hover:text-primary hover:bg-white/5 rounded-xl transition-all"><Smile class="w-5 h-5" /></button>
                    <button type="button" @click="triggerFileUpload" class="p-2 text-slate-500 hover:text-primary hover:bg-white/5 rounded-xl transition-all"><Paperclip class="w-5 h-5" /></button>
                    <input ref="fileInput" type="file" class="hidden" @change="handleFileSelected" />
                  </div>
                  <button 
                    type="submit"
                    :disabled="!messageContent.trim() || chatStore.loading"
                    class="bg-primary text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgba(99,102,241,0.2)] hover:bg-[#5558e6] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send class="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </template>

          <template v-else>
            <div class="flex-1 flex items-center justify-center">
              <div class="text-center">
                <Hash class="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 class="text-xl font-bold text-slate-400 font-headline mb-2">Select a channel or conversation</h3>
                <p class="text-slate-500 text-sm">Choose from the list on the left to start messaging</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import AppLayout from '@/components/AppLayout.vue'
import { Hash, Smile, Paperclip, Send } from 'lucide-vue-next'

const chatStore = useChatStore()
const messageContent = ref('')
const fileInput = ref(null)
const selectedFiles = ref([])

const currentChannel = computed(() => chatStore.currentChannel)
const currentConversation = computed(() => chatStore.currentConversation)

const messages = computed(() => {
  return currentChannel.value ? chatStore.channelMessages : chatStore.conversationMessages
})

function isUserOnline(userId) {
  return chatStore.onlineUsers[userId] === 'online'
}

async function selectChannel(channel) {
  chatStore.clearCurrentConversation()
  chatStore.currentChannel = channel
  await chatStore.fetchChannelMessages(channel.id)
  
  // Fetch online status for members
  if (channel.members_count > 0) {
    await chatStore.fetchOnlineStatus([])
  }
}

async function selectConversation(conversation) {
  chatStore.clearCurrentChannel()
  chatStore.currentConversation = conversation
  await chatStore.fetchConversationMessages(conversation.id)
  
  // Fetch online status for this user
  await chatStore.fetchOnlineStatus([conversation.user?.id])
}

async function sendMessage() {
  if (!messageContent.value.trim() && selectedFiles.value.length === 0) return

  const content = messageContent.value.trim()
  
  let result
  if (currentChannel.value) {
    result = await chatStore.sendChannelMessage(
      currentChannel.value.id,
      content,
      selectedFiles.value
    )
  } else if (currentConversation.value) {
    result = await chatStore.sendDirectMessage(
      currentConversation.value.id,
      content,
      selectedFiles.value
    )
  }

  if (result.success) {
    messageContent.value = ''
    selectedFiles.value = []
  }
}

function triggerFileUpload() {
  fileInput.value?.click()
}

async function handleFileSelected(event) {
  const files = event.target.files
  if (files) {
    selectedFiles.value = Array.from(files)
  }
}

function formatTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  await Promise.all([
    chatStore.fetchChannels(),
    chatStore.fetchConversations()
  ])
})
</script>
