import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AuthUser } from '@/lib/auth'
import { clearAccessToken, getAccessToken } from '@/lib/auth'

export const useAppStore = defineStore('app', () => {
  const unreadMessages = ref(3)
  const loggedIn = ref(Boolean(getAccessToken()))
  const currentUser = ref<AuthUser | null>(null)
  const displayName = computed(() => {
    const nickname = currentUser.value?.nickname?.trim()
    if (nickname)
      return nickname
    if (currentUser.value?.game_uid)
      return `UID ${currentUser.value.game_uid}`
    return 'Aemeath'
  })
  const userInitial = computed(() => displayName.value.slice(0, 1).toUpperCase())

  function setAuthenticatedUser(user: AuthUser) {
    currentUser.value = user
    loggedIn.value = true
  }

  function logout() {
    clearAccessToken()
    currentUser.value = null
    loggedIn.value = false
  }

  return { unreadMessages, loggedIn, currentUser, displayName, userInitial, setAuthenticatedUser, logout }
})
