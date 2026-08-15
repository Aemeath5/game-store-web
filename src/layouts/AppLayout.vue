<script setup lang="ts">
import axios from 'axios'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import MobileTabBar from '@/components/MobileTabBar.vue'
import { getAccessToken } from '@/lib/auth'
import { useAppStore } from '@/stores/app'

const app = useAppStore()
const router = useRouter()

function isAuthFailure(cause: unknown) {
  if (!axios.isAxiosError(cause))
    return false
  return cause.response?.status === 401 || cause.response?.status === 403
}

onMounted(async () => {
  if (!getAccessToken())
    return

  try {
    await app.hydrateCurrentUser()
    await app.loadPlayerSnapshot()
  }
  catch (cause) {
    if (isAuthFailure(cause)) {
      app.logout()
      await router.replace('/login')
    }
  }
})
</script>

<template>
  <div class="site-shell">
    <AppSidebar />
    <main class="site-main">
      <RouterView />
    </main>
    <MobileTabBar />
  </div>
</template>
