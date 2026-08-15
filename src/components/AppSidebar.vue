<script setup lang="ts">
import {
  Bell,
  CircleHelp,
  Gavel,
  Gift,
  House,
  Mail,
  MessageCircle,
  ShieldCheck,
  ShoppingBasket,
  ShoppingCart,
  Sparkles,
  Sword,
} from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const app = useAppStore()

const mainNav = [
  { label: '仪表盘', path: '/', icon: House },
  { label: '交易中心', path: '/market', icon: ShoppingBasket },
  { label: '冒险', path: '/orders', icon: Sparkles },
  { label: '角色养成', path: '/listings', icon: Sword },
  { label: '管理后台', path: '/admin', icon: ShieldCheck },
]

const active = (path: string) => (path === '/' ? route.path === '/' : route.path.startsWith(path))
</script>

<template>
  <header class="desktop-nav">
    <RouterLink to="/" class="nav-logo">原神交易市场</RouterLink>
    <nav class="nav-links">
      <RouterLink
        v-for="item in mainNav"
        :key="item.path"
        :to="item.path"
        class="nav-link"
        :class="{ active: active(item.path) }"
      >
        <component :is="item.icon" />
        <span>{{ item.label }}</span>
      </RouterLink>
      <button class="nav-link nav-link-button"><Gavel /><span>福利中心</span></button>
    </nav>
    <div class="nav-spacer" />
    <button class="nav-icon-btn" aria-label="通知"><Bell /></button>
    <button class="nav-icon-btn" aria-label="消息"><MessageCircle /><i class="nav-dot" /></button>
    <button class="nav-icon-btn" aria-label="邮件"><Mail /></button>
    <button class="nav-icon-btn" aria-label="购物车"><ShoppingCart /></button>
    <button class="nav-icon-btn nav-online" aria-label="连接状态"><CircleHelp /></button>
    <RouterLink to="/profile" class="nav-user-trigger">
      <img src="/assets/reference/avatar-main.svg" :alt="app.displayName" />
      <span>{{ app.displayName }}</span>
    </RouterLink>
  </header>

  <header class="mobile-nav">
    <RouterLink to="/" class="mobile-logo">原神交易市场</RouterLink>
    <div class="mobile-actions">
      <button aria-label="福利"><Gift /></button>
      <button aria-label="通知"><Bell /></button>
      <button aria-label="消息"><MessageCircle /><i class="mobile-badge">3</i></button>
      <RouterLink to="/profile" class="mobile-avatar">
        <img src="/assets/reference/avatar-main.svg" :alt="app.displayName" />
      </RouterLink>
    </div>
  </header>
</template>
