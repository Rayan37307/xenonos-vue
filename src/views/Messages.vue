<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-white font-headline">Messages</h1>
      </div>
      <div class="flex flex-1 h-[600px] overflow-hidden bg-surface rounded-2xl border border-white/5 relative">
        <!-- Channels Pane -->
        <div class="w-72 bg-surface-container/50 flex flex-col border-r border-white/5">
          <div class="p-6 space-y-8 h-full overflow-y-auto no-scrollbar">
            <div>
              <h3 class="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 px-2 ubuntu">Channels</h3>
              <div v-if="msgStore.loadingList" class="px-2 text-xs text-slate-500 outfit">Loading…</div>
              <div v-else class="space-y-1">
                <button
                  v-for="ch in msgStore.channels"
                  :key="ch.id"
                  type="button"
                  class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group text-left"
                  :class="
                    msgStore.activeChannelId === ch.id && !msgStore.activeConversationId
                      ? 'bg-primary/10 text-white shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]'
                      : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
                  "
                  @click="msgStore.openChannel(ch.id)"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <Hash class="w-4 h-4 shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    <span class="text-sm tracking-tight font-medium outfit truncate">{{ ch.name }}</span>
                  </div>
                  <div
                    v-if="ch.unread_count > 0"
                    class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.8)] shrink-0"
                  />
                </button>
                <p v-if="!msgStore.channels.length" class="px-2 text-xs text-slate-500 outfit">
                  No channels yet. Seed the API or create one in admin.
                </p>
              </div>
            </div>
            <div>
              <h3 class="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 px-2 ubuntu">Direct Messages</h3>
              <div class="space-y-1">
                <button
                  v-for="conv in msgStore.conversations"
                  :key="conv.id"
                  type="button"
                  class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                  :class="
                    msgStore.activeConversationId === conv.id
                      ? 'bg-primary/10 text-white'
                      : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
                  "
                  @click="msgStore.openConversation(conv.id)"
                >
                  <img
                    class="w-8 h-8 rounded-xl border border-white/5 object-cover shrink-0"
                    :src="conv.user?.avatar || fallbackAvatar(conv.user?.name)"
                    :alt="conv.user?.name"
                  />
                  <span class="text-sm tracking-tight font-medium outfit truncate">{{ conv.user?.name }}</span>
                </button>
                <p v-if="!msgStore.conversations.length" class="px-2 text-xs text-slate-500 outfit">
                  No direct messages yet.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 bg-surface flex flex-col relative min-h-0">
          <div class="px-6 py-5 bg-surface/80 backdrop-blur-xl border-b border-white/5 shrink-0">
            <h2 class="text-xl font-bold text-white tracking-tight font-headline">
              <template v-if="msgStore.activeConversation">
                {{ msgStore.activeConversation.user?.name }}
              </template>
              <template v-else-if="msgStore.activeChannel">
                {{ msgStore.activeChannel.name }}
              </template>
              <template v-else>Messages</template>
            </h2>
            <p v-if="msgStore.error" class="text-rose-400 text-xs mt-1 outfit">{{ msgStore.error }}</p>
          </div>

          <div ref="threadEl" class="flex-1 overflow-y-auto px-6 py-8 space-y-6 no-scrollbar min-h-0">
            <div v-if="msgStore.loadingMessages" class="text-center text-slate-500 text-sm outfit py-12">Loading messages…</div>
            <template v-else>
              <div class="flex items-center gap-6">
                <div class="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
                <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 ubuntu">Today</span>
                <div class="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
              </div>

              <div
                v-for="m in msgStore.messages"
                :key="m.id"
                class="flex items-start gap-5"
                :class="{ 'flex-row-reverse': isOwnMessage(m) }"
              >
                <img
                  class="w-11 h-11 rounded-2xl border border-white/5 object-cover shrink-0"
                  :src="m.user?.avatar || fallbackAvatar(m.user?.name)"
                  :alt="m.user?.name"
                />
                <div class="space-y-1 max-w-[min(100%,42rem)]" :class="{ 'items-end flex flex-col': isOwnMessage(m) }">
                  <span class="text-xs font-bold text-white tracking-tight outfit px-1">{{ m.user?.name }}</span>
                  <div
                    class="bg-surface-container p-5 rounded-3xl border border-white/5 text-slate-300 outfit"
                    :class="isOwnMessage(m) ? 'rounded-tr-none' : 'rounded-tl-none'"
                  >
                    <p class="whitespace-pre-wrap break-words">{{ m.content }}</p>
                    <p
                      v-if="m._hashOk === false"
                      class="text-[10px] text-amber-400/90 mt-2 ubuntu tracking-wide"
                    >
                      Content hash mismatch — message may have been altered.
                    </p>
                  </div>
                </div>
              </div>

              <p v-if="!msgStore.messages.length && (msgStore.activeChannelId || msgStore.activeConversationId)" class="text-center text-slate-500 text-sm outfit py-8">
                No messages yet. Say hello below.
              </p>
            </template>
          </div>

          <div class="p-6 bg-surface border-t border-white/5 shrink-0">
            <div class="relative bg-surface-container rounded-[2rem] p-2 border border-white/5">
              <textarea
                v-model="draft"
                class="w-full bg-transparent border-none text-white py-4 px-6 focus:ring-0 resize-none outfit"
                placeholder="Type a message..."
                rows="1"
                :disabled="!canSend"
                @keydown.enter.exact.prevent="submit"
              />
              <div class="flex items-center justify-between px-3 pb-2">
                <div class="flex items-center gap-1">
                  <button type="button" class="p-2 text-slate-500 hover:text-primary hover:bg-white/5 rounded-xl transition-all" disabled>
                    <Smile class="w-5 h-5" />
                  </button>
                  <button type="button" class="p-2 text-slate-500 hover:text-primary hover:bg-white/5 rounded-xl transition-all" disabled>
                    <Paperclip class="w-5 h-5" />
                  </button>
                </div>
                <button
                  type="button"
                  class="bg-primary text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgba(99,102,241,0.2)] hover:bg-[#5558e6] transition-all disabled:opacity-40"
                  :disabled="!canSend || msgStore.sending || !draft.trim()"
                  @click="submit"
                >
                  <Send class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { Hash, Smile, Paperclip, Send } from 'lucide-vue-next'
import { useMessagesStore } from '@/stores/messages'
const msgStore = useMessagesStore()
const draft = ref('')
const threadEl = ref(null)

const canSend = computed(() => !!(msgStore.activeChannelId || msgStore.activeConversationId))

function fallbackAvatar(name) {
  const q = encodeURIComponent(name || '?')
  return `https://ui-avatars.com/api/?name=${q}&background=1e293b&color=94a3b8&size=128`
}

function isOwnMessage(m) {
  const uid = getUserId()
  if (uid == null) return false
  return String(m.user_id) === String(uid)
}

function getUserId() {
  try {
    const u = JSON.parse(localStorage.getItem('auth_user') || '{}')
    return u.id
  } catch {
    return null
  }
}

async function submit() {
  const t = draft.value.trim()
  if (!t || !canSend.value || msgStore.sending) return
  await msgStore.sendCurrentMessage(t)
  draft.value = ''
  await nextTick()
  scrollToBottom()
}

function scrollToBottom() {
  const el = threadEl.value
  if (el) el.scrollTop = el.scrollHeight
}

onMounted(async () => {
  await msgStore.bootstrap()
  await nextTick()
  scrollToBottom()
})

watch(
  () => msgStore.messages.length,
  async () => {
    await nextTick()
    scrollToBottom()
  }
)
</script>
