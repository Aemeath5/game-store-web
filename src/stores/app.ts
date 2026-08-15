import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { api } from '@/lib/http'
import type { ApiEnvelope, AuthUser } from '@/lib/auth'
import { apiErrorMessage, clearAccessToken, getAccessToken } from '@/lib/auth'
import type { PlayerSnapshot } from '@/types/player'

export const useAppStore = defineStore('app', () => {
  const unreadMessages = ref(3)
  const loggedIn = ref(Boolean(getAccessToken()))
  const currentUser = ref<AuthUser | null>(null)
  const playerSnapshot = ref<PlayerSnapshot | null>(null)
  const playerLoading = ref(false)
  const playerError = ref('')
  let playerRequestId = 0

  const displayName = computed(() => {
    const playerNickname = playerSnapshot.value?.nickname?.trim()
    if (playerNickname)
      return playerNickname
    const nickname = currentUser.value?.nickname?.trim()
    if (nickname)
      return nickname
    if (playerUid.value)
      return `UID ${playerUid.value}`
    return 'Aemeath'
  })
  const playerUid = computed(() => playerSnapshot.value?.uid || currentUser.value?.game_uid || 0)
  const inventoryTotal = computed(() => playerSnapshot.value?.inventory.total ?? null)
  const userInitial = computed(() => displayName.value.slice(0, 1).toUpperCase())

  function setAuthenticatedUser(user: AuthUser) {
    currentUser.value = user
    loggedIn.value = true
  }

  async function hydrateCurrentUser() {
    if (currentUser.value)
      return currentUser.value

    const response = await api.get<ApiEnvelope<AuthUser>>('/auth/me')
    setAuthenticatedUser(response.data.data)
    return response.data.data
  }

  async function loadPlayerSnapshot(page = 1, pageSize = 100, force = false) {
    const cached = playerSnapshot.value
    if (!force && cached?.inventory.page === page && cached.inventory.page_size === pageSize)
      return cached

    const requestId = ++playerRequestId
    playerLoading.value = true
    playerError.value = ''

    try {
      const response = await api.get<ApiEnvelope<PlayerSnapshot>>('/player/me', {
        params: { page, page_size: pageSize },
      })
      const snapshot = response.data.data

      if (requestId === playerRequestId) {
        playerSnapshot.value = snapshot
        if (currentUser.value) {
          currentUser.value = {
            ...currentUser.value,
            game_uid: snapshot.uid,
            nickname: snapshot.nickname || currentUser.value.nickname,
          }
        }
      }
      return snapshot
    }
    catch (cause) {
      if (requestId === playerRequestId)
        playerError.value = apiErrorMessage(cause, '玩家数据读取失败，请稍后重试。')
      throw cause
    }
    finally {
      if (requestId === playerRequestId)
        playerLoading.value = false
    }
  }

  function logout() {
    playerRequestId++
    clearAccessToken()
    currentUser.value = null
    playerSnapshot.value = null
    playerLoading.value = false
    playerError.value = ''
    loggedIn.value = false
  }

  return {
    unreadMessages,
    loggedIn,
    currentUser,
    playerSnapshot,
    playerLoading,
    playerError,
    displayName,
    playerUid,
    inventoryTotal,
    userInitial,
    setAuthenticatedUser,
    hydrateCurrentUser,
    loadPlayerSnapshot,
    logout,
  }
})
