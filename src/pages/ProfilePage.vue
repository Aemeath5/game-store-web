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
  { label: '我的挂单', path: '/listings', icon: Tag, count: '—' },
  { label: '购买记录', path: '/orders', icon: ShoppingBag, count: '—' },
  { label: '背包道具', path: '/listings', icon: Boxes, count: inventoryCount.value },
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
  <div class="profile-page-v3">
    <section class="profile-hero-v3">
      <div class="profile-cover-v3" :style="{ backgroundImage: `url(${coverSrc})` }">
        <div class="profile-cover-shade" />
        <button type="button" class="profile-edit-v3" @click="editing = true"><Pencil /> 编辑资料</button>
      </div>

      <div class="profile-identity-v3">
        <span class="profile-avatar-v3"><img :src="avatarSrc" :alt="app.displayName"></span>
        <h1>{{ app.displayName }}</h1>
        <p>商城用户 #{{ app.currentUser?.id || '—' }}</p>
      </div>

      <nav class="profile-shortcuts-v3">
        <RouterLink v-for="item in transactionLinks" :key="item.label" :to="item.path">
          <strong>{{ item.count }}</strong>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </section>

    <main class="profile-content-v3">
      <section class="profile-panel-v3 game-panel-v3">
        <header>
          <div><Gamepad2 /><strong>游戏账号</strong></div>
          <span class="sync-chip-v3" :class="{ error: app.playerError }"><CheckCircle2 /> {{ playerStatus }}</span>
        </header>
        <div class="game-id-v3">
          <div><span>游戏昵称</span><strong>{{ app.gameDisplayName }}</strong></div>
          <div><span>UID</span><strong>{{ app.playerUid || '—' }}</strong></div>
        </div>
        <div class="currency-grid-v3">
          <div><span>原石</span><strong>{{ formatAmount(currency?.primogem) }}</strong></div>
          <div><span>摩拉</span><strong>{{ formatAmount(currency?.mora) }}</strong></div>
          <div><span>创世结晶</span><strong>{{ formatAmount(currency?.genesis_crystal) }}</strong></div>
          <div><span>背包道具</span><strong>{{ inventoryCount }}</strong></div>
        </div>
      </section>

      <section class="profile-panel-v3">
        <header>
          <div><ReceiptText /><strong>我的交易</strong></div>
          <RouterLink to="/orders">全部记录 <ChevronRight /></RouterLink>
        </header>
        <div class="profile-menu-v3">
          <RouterLink v-for="item in transactionLinks" :key="`menu-${item.label}`" :to="item.path">
            <span class="profile-menu-icon-v3"><component :is="item.icon" /></span>
            <span class="profile-menu-copy-v3"><strong>{{ item.label }}</strong><small>{{ item.label === '背包道具' ? '查看与管理游戏背包' : '查看商城交易记录' }}</small></span>
            <b>{{ item.count }}</b><ChevronRight />
          </RouterLink>
        </div>
      </section>

      <section class="profile-panel-v3">
        <header><div><Image /><strong>账号设置</strong></div></header>
        <div class="profile-menu-v3">
          <button type="button" @click="editing = true">
            <span class="profile-menu-icon-v3"><Pencil /></span>
            <span class="profile-menu-copy-v3"><strong>商城资料</strong><small>修改商城昵称、头像与封面</small></span>
            <ChevronRight />
          </button>
          <button type="button">
            <span class="profile-menu-icon-v3"><LockKeyhole /></span>
            <span class="profile-menu-copy-v3"><strong>账户安全</strong><small>登录密码与账号安全</small></span>
            <ChevronRight />
          </button>
          <button type="button" class="profile-logout-v3" @click="logout">
            <span class="profile-menu-icon-v3"><LogOut /></span>
            <span class="profile-menu-copy-v3"><strong>退出登录</strong><small>退出当前商城账号</small></span>
            <ChevronRight />
          </button>
        </div>
      </section>
    </main>

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
