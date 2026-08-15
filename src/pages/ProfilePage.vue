<script setup lang="ts">
import { computed } from 'vue'
import {
  Bell,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Gamepad2,
  History,
  LockKeyhole,
  LogOut,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  Tag,
  UserRound,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const app = useAppStore()
const router = useRouter()
const numberFormatter = new Intl.NumberFormat('zh-CN')

const playerStatus = computed(() => {
  if (app.playerLoading)
    return '正在读取玩家数据'
  if (app.playerError)
    return '玩家数据读取失败'
  if (app.playerSnapshot)
    return '玩家数据已同步'
  return '等待玩家数据'
})
const playerUid = computed(() => app.playerUid ? `UID ${app.playerUid}` : '等待关联')
const inventoryCount = computed(() => app.inventoryTotal == null ? '—' : numberFormatter.format(app.inventoryTotal))
const transactionLinks = computed(() => [
  { label: '我的挂单', desc: '查看正在出售的游戏道具', path: '/listings', icon: Tag, count: '—' },
  { label: '购买记录', desc: '查看已经购买的游戏道具', path: '/orders', icon: ShoppingBag, count: '—' },
  { label: '成交记录', desc: '查看自动交易完成记录', path: '/orders', icon: PackageCheck, count: '—' },
  { label: '背包管理', desc: '查看游戏存档中的背包道具', path: '/listings', icon: Boxes, count: inventoryCount.value },
])

const accountLinks = computed(() => [
  { label: '游戏账号', desc: '商城身份与游戏 UID', icon: Gamepad2, value: playerUid.value },
  { label: '账户安全', desc: '登录密码与账号安全', icon: LockKeyhole, value: '安全' },
  { label: '玩家存档', desc: '商城后端读取的游戏数据版本', icon: History, value: app.playerSnapshot ? `版本 ${app.playerSnapshot.data_version}` : '未读取' },
  { label: '通知设置', desc: '交易完成与系统通知', icon: Bell, value: '' },
])

function logout() {
  app.logout()
  router.replace('/login')
}
</script>

<template>
  <div class="profile-page-v2">
    <div class="profile-container-v2">
      <section class="profile-account-card">
        <header class="profile-account-head">
          <div class="profile-account-main">
            <span class="profile-account-avatar">
              <img src="/assets/reference/avatar-main.svg" :alt="app.displayName" />
            </span>
            <div class="profile-account-copy">
              <div class="profile-account-name">
                <h1>{{ app.displayName }}</h1>
                <span :class="{ error: app.playerError }"><CheckCircle2 /> {{ playerStatus }}</span>
              </div>
              <p v-if="app.playerUid">UID {{ app.playerUid }}</p>
              <p v-else>登录后自动关联游戏角色 UID</p>
            </div>
          </div>
          <RouterLink to="/listings" class="profile-account-action"><Boxes /> 背包管理</RouterLink>
        </header>

        <div class="profile-account-body">
          <div class="profile-stats-v2">
            <RouterLink to="/listings"><strong>—</strong><span>我的挂单</span></RouterLink>
            <RouterLink to="/orders"><strong>—</strong><span>购买记录</span></RouterLink>
            <RouterLink to="/orders"><strong>—</strong><span>已完成交易</span></RouterLink>
            <RouterLink to="/listings"><strong>{{ inventoryCount }}</strong><span>背包道具</span></RouterLink>
          </div>
        </div>
      </section>

      <section class="profile-section-v2">
        <header class="profile-section-head">
          <div><ReceiptText /><span>我的交易</span></div>
          <RouterLink to="/orders">全部记录 <ChevronRight /></RouterLink>
        </header>
        <div class="profile-transaction-grid">
          <RouterLink v-for="item in transactionLinks" :key="item.label" :to="item.path" class="profile-transaction-item">
            <span class="profile-transaction-icon"><component :is="item.icon" /></span>
            <div class="profile-transaction-copy">
              <strong>{{ item.label }}</strong>
              <small>{{ item.desc }}</small>
            </div>
            <b>{{ item.count }}</b>
            <ChevronRight class="profile-row-arrow" />
          </RouterLink>
        </div>
      </section>

      <section class="profile-section-v2">
        <header class="profile-section-head">
          <div><UserRound /><span>账号与商城</span></div>
        </header>
        <div class="profile-account-list">
          <button v-for="item in accountLinks" :key="item.label" type="button" class="profile-account-row">
            <span class="profile-row-icon"><component :is="item.icon" /></span>
            <span class="profile-row-copy"><strong>{{ item.label }}</strong><small>{{ item.desc }}</small></span>
            <span v-if="item.value" class="profile-row-value">{{ item.value }}</span>
            <ChevronRight class="profile-row-arrow" />
          </button>
          <button type="button" class="profile-account-row profile-logout" @click="logout">
            <span class="profile-row-icon"><LogOut /></span>
            <span class="profile-row-copy"><strong>退出登录</strong><small>退出当前商城账号</small></span>
            <ChevronRight class="profile-row-arrow" />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
