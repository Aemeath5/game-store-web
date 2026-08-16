<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Boxes,
  CheckCircle2,
  ChevronRight,
  Gamepad2,
  Image,
  LockKeyhole,
  LogOut,
  Pencil,
  ReceiptText,
  ShoppingBag,
  Tag,
  UserRound,
  X,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { apiErrorMessage } from '@/lib/auth'
import { useAppStore } from '@/stores/app'

const app = useAppStore()
const router = useRouter()
const numberFormatter = new Intl.NumberFormat('zh-CN')
const editing = ref(false)
const saving = ref(false)
const saveError = ref('')
const draftName = ref('')
const draftAvatar = ref('avatar_main')
const draftCover = ref('cover_profile')

const avatarPresets = [
  { id: 'avatar_main', label: '旅行者', src: '/assets/reference/avatar-main.svg' },
  { id: 'avatar_2', label: '头像 2', src: '/assets/reference/avatar-2.svg' },
  { id: 'avatar_3', label: '头像 3', src: '/assets/reference/avatar-3.svg' },
  { id: 'avatar_4', label: '头像 4', src: '/assets/reference/avatar-4.svg' },
]
const coverPresets = [
  { id: 'cover_profile', label: '个人主页', src: '/assets/reference/profile-banner.svg' },
  { id: 'cover_dashboard', label: '蓝色横幅', src: '/assets/reference/dashboard-banner.svg' },
  { id: 'cover_hero', label: '主题横幅', src: '/assets/hero.svg' },
]

const avatarSrc = computed(() => avatarPresets.find(item => item.id === app.currentUser?.avatar)?.src || avatarPresets[0].src)
const coverSrc = computed(() => coverPresets.find(item => item.id === app.currentUser?.cover)?.src || coverPresets[0].src)
const inventoryCount = computed(() => app.inventoryTotal == null ? '—' : numberFormatter.format(app.inventoryTotal))
const playerStatus = computed(() => app.playerLoading ? '正在读取' : app.playerError ? '读取失败' : app.playerSnapshot ? '已同步' : '等待同步')
const currency = computed(() => app.playerSnapshot?.currency)
const transactionLinks = computed(() => [
  { label: '我的挂单', desc: '查看正在出售的游戏道具', path: '/listings', icon: Tag, count: '—' },
  { label: '购买记录', desc: '查看已经购买的游戏道具', path: '/orders', icon: ShoppingBag, count: '—' },
  { label: '背包管理', desc: '查看游戏存档中的背包道具', path: '/listings', icon: Boxes, count: inventoryCount.value },
])

watch(editing, (open) => {
  if (!open)
    return
  draftName.value = app.currentUser?.nickname || ''
  draftAvatar.value = app.currentUser?.avatar || 'avatar_main'
  draftCover.value = app.currentUser?.cover || 'cover_profile'
  saveError.value = ''
})

function formatAmount(value: number | null | undefined) {
  return value == null ? '—' : numberFormatter.format(value)
}

async function saveProfile() {
  saving.value = true
  saveError.value = ''
  try {
    await app.saveStoreProfile(draftName.value.trim(), draftAvatar.value, draftCover.value)
    editing.value = false
  }
  catch (cause) {
    saveError.value = apiErrorMessage(cause, '商城资料保存失败，请稍后重试。')
  }
  finally {
    saving.value = false
  }
}

function logout() {
  app.logout()
  router.replace('/login')
}
</script>

<template>
  <div class="profile-page-v2">
    <div class="profile-container-v2">
      <section class="store-profile-card">
        <div class="store-profile-cover" :style="{ backgroundImage: `url(${coverSrc})` }">
          <button type="button" class="store-profile-edit" @click="editing = true"><Pencil /> 编辑商城资料</button>
        </div>
        <div class="store-profile-main">
          <span class="store-profile-avatar"><img :src="avatarSrc" :alt="app.displayName"></span>
          <div class="store-profile-copy">
            <p>STORE PROFILE</p>
            <h1>{{ app.displayName }}</h1>
            <span>商城用户 #{{ app.currentUser?.id || '—' }}</span>
          </div>
        </div>
      </section>

      <section class="profile-section-v2 game-profile-card">
        <header class="profile-section-head">
          <div><Gamepad2 /><span>已绑定游戏账号</span></div>
          <span class="game-sync-state" :class="{ error: app.playerError }"><CheckCircle2 /> {{ playerStatus }}</span>
        </header>
        <div class="game-profile-body">
          <div class="game-profile-identity">
            <strong>{{ app.gameDisplayName }}</strong>
            <span>{{ app.playerUid ? `UID ${app.playerUid}` : '尚未关联 UID' }}</span>
          </div>
          <div class="game-profile-currencies">
            <div><span>原石</span><strong>{{ formatAmount(currency?.primogem) }}</strong></div>
            <div><span>摩拉</span><strong>{{ formatAmount(currency?.mora) }}</strong></div>
            <div><span>创世结晶</span><strong>{{ formatAmount(currency?.genesis_crystal) }}</strong></div>
            <div><span>背包道具</span><strong>{{ inventoryCount }}</strong></div>
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
            <div class="profile-transaction-copy"><strong>{{ item.label }}</strong><small>{{ item.desc }}</small></div>
            <b>{{ item.count }}</b><ChevronRight class="profile-row-arrow" />
          </RouterLink>
        </div>
      </section>

      <section class="profile-section-v2">
        <header class="profile-section-head"><div><UserRound /><span>账号与商城</span></div></header>
        <div class="profile-account-list">
          <button type="button" class="profile-account-row" @click="editing = true">
            <span class="profile-row-icon"><Image /></span>
            <span class="profile-row-copy"><strong>商城资料</strong><small>商城昵称、系统头像和系统封面</small></span>
            <span class="profile-row-value">{{ app.displayName }}</span><ChevronRight class="profile-row-arrow" />
          </button>
          <button type="button" class="profile-account-row">
            <span class="profile-row-icon"><LockKeyhole /></span>
            <span class="profile-row-copy"><strong>账户安全</strong><small>登录密码与账号安全</small></span>
            <span class="profile-row-value">安全</span><ChevronRight class="profile-row-arrow" />
          </button>
          <button type="button" class="profile-account-row profile-logout" @click="logout">
            <span class="profile-row-icon"><LogOut /></span>
            <span class="profile-row-copy"><strong>退出登录</strong><small>退出当前商城账号</small></span>
            <ChevronRight class="profile-row-arrow" />
          </button>
        </div>
      </section>
    </div>

    <div v-if="editing" class="store-profile-modal" @click.self="editing = false">
      <form class="store-profile-editor" @submit.prevent="saveProfile">
        <header><div><strong>编辑商城资料</strong><span>只能选择商城提供的头像和封面</span></div><button type="button" @click="editing = false"><X /></button></header>
        <label>商城昵称<input v-model="draftName" maxlength="24" minlength="2" placeholder="输入商城昵称"></label>
        <fieldset><legend>商城头像</legend><div class="preset-avatar-grid"><button v-for="item in avatarPresets" :key="item.id" type="button" :class="{ active: draftAvatar === item.id }" @click="draftAvatar = item.id"><img :src="item.src" :alt="item.label"><span>{{ item.label }}</span></button></div></fieldset>
        <fieldset><legend>个人封面</legend><div class="preset-cover-grid"><button v-for="item in coverPresets" :key="item.id" type="button" :class="{ active: draftCover === item.id }" @click="draftCover = item.id"><img :src="item.src" :alt="item.label"><span>{{ item.label }}</span></button></div></fieldset>
        <p v-if="saveError" class="store-profile-error">{{ saveError }}</p>
        <footer><button type="button" @click="editing = false">取消</button><button type="submit" :disabled="saving || draftName.trim().length < 2">{{ saving ? '保存中…' : '保存资料' }}</button></footer>
      </form>
    </div>
  </div>
</template>
