<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Boxes,
  ChevronRight,
  CircleCheck,
  Gamepad2,
  LockKeyhole,
  LogOut,
  Pencil,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
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

const primogemIcon = '/game-assets/icons/UI_ItemIcon_201.webp'
const moraIcon = '/game-assets/icons/UI_ItemIcon_202.webp'
const genesisCrystalIcon = '/game-assets/icons/UI_ItemIcon_203.webp'

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
const currency = computed(() => app.playerSnapshot?.currency)
const inventoryCount = computed(() => app.inventoryTotal == null ? '—' : numberFormatter.format(app.inventoryTotal))
const syncLabel = computed(() => app.playerLoading ? '同步中' : app.playerError ? '同步失败' : app.playerSnapshot ? '已同步' : '未同步')

const marketEntries = computed(() => [
  { label: '我的挂单', hint: '管理正在出售的商品', value: '—', path: '/listings', icon: Tag },
  { label: '购买记录', hint: '查看历史订单记录', value: '—', path: '/orders', icon: ReceiptText },
  { label: '背包道具', hint: '查看可交易游戏道具', value: inventoryCount.value, path: '/listings', icon: Boxes },
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

async function refreshPlayer() {
  try {
    await app.loadPlayerSnapshot(1, 100, true)
  }
  catch {
    // The store already exposes the backend error state.
  }
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
  <div class="account-center-page">
    <div class="account-center-wrap">
      <section class="account-profile-head">
        <div class="account-cover" :style="{ backgroundImage: `url(${coverSrc})` }">
          <div class="account-cover-mask" />
        </div>

        <div class="account-identity-row">
          <div class="account-avatar"><img :src="avatarSrc" :alt="app.displayName"></div>
          <div class="account-name-block">
            <h1>{{ app.displayName }}</h1>
            <span>商城个人资料</span>
          </div>
          <button type="button" class="account-edit-btn" @click="editing = true"><Pencil /> 编辑资料</button>
        </div>
      </section>

      <section class="account-sheet">
        <div class="account-game-row">
          <div class="game-user-block">
            <span class="game-user-icon"><Gamepad2 /></span>
            <div class="game-user-copy">
              <span>已绑定游戏账号</span>
              <strong>{{ app.gameDisplayName }}</strong>
              <small>UID {{ app.playerUid || '—' }}</small>
            </div>
          </div>

          <div class="game-sync-area" :class="{ error: app.playerError }">
            <span><CircleCheck /> {{ syncLabel }}</span>
            <button type="button" :disabled="app.playerLoading" @click="refreshPlayer"><RefreshCw :class="{ spinning: app.playerLoading }" /></button>
          </div>
        </div>

        <div class="account-wallet-row">
          <div class="account-wallet-item">
            <img :src="primogemIcon" alt="原石">
            <div><strong>{{ formatAmount(currency?.primogem) }}</strong><span>原石</span></div>
          </div>
          <div class="account-wallet-item">
            <img :src="moraIcon" alt="摩拉">
            <div><strong>{{ formatAmount(currency?.mora) }}</strong><span>摩拉</span></div>
          </div>
          <div class="account-wallet-item">
            <img :src="genesisCrystalIcon" alt="创世结晶">
            <div><strong>{{ formatAmount(currency?.genesis_crystal) }}</strong><span>创世结晶</span></div>
          </div>
        </div>

        <div class="account-section-title">
          <div><span>商城服务</span><small>交易与背包</small></div>
        </div>

        <nav class="account-market-grid">
          <RouterLink v-for="item in marketEntries" :key="item.label" :to="item.path" class="account-market-item">
            <span class="account-market-icon"><component :is="item.icon" /></span>
            <div class="account-market-copy"><strong>{{ item.label }}</strong><small>{{ item.hint }}</small></div>
            <b>{{ item.value }}</b>
            <ChevronRight />
          </RouterLink>
        </nav>

        <div class="account-section-title account-section-title--settings">
          <div><span>账号设置</span><small>资料与安全</small></div>
        </div>

        <div class="account-setting-list">
          <button type="button" @click="editing = true">
            <span class="setting-icon"><Pencil /></span>
            <div><strong>商城资料</strong><small>修改商城昵称、头像和封面</small></div>
            <ChevronRight />
          </button>
          <button type="button">
            <span class="setting-icon"><ShieldCheck /></span>
            <div><strong>账号安全</strong><small>密码与登录安全设置</small></div>
            <ChevronRight />
          </button>
          <button type="button" class="account-logout" @click="logout">
            <span class="setting-icon"><LogOut /></span>
            <div><strong>退出登录</strong><small>退出当前商城账号</small></div>
            <ChevronRight />
          </button>
        </div>
      </section>
    </div>

    <div v-if="editing" class="store-profile-modal" @click.self="editing = false">
      <form class="store-profile-editor" @submit.prevent="saveProfile">
        <header>
          <div><strong>编辑商城资料</strong><span>只能使用商城提供的头像与封面</span></div>
          <button type="button" @click="editing = false"><X /></button>
        </header>
        <label>商城昵称<input v-model="draftName" maxlength="24" minlength="2" placeholder="输入商城昵称"></label>
        <fieldset>
          <legend>商城头像</legend>
          <div class="preset-avatar-grid">
            <button v-for="item in avatarPresets" :key="item.id" type="button" :class="{ active: draftAvatar === item.id }" @click="draftAvatar = item.id">
              <img :src="item.src" :alt="item.label"><span>{{ item.label }}</span>
            </button>
          </div>
        </fieldset>
        <fieldset>
          <legend>主页封面</legend>
          <div class="preset-cover-grid">
            <button v-for="item in coverPresets" :key="item.id" type="button" :class="{ active: draftCover === item.id }" @click="draftCover = item.id">
              <img :src="item.src" :alt="item.label"><span>{{ item.label }}</span>
            </button>
          </div>
        </fieldset>
        <p v-if="saveError" class="store-profile-error">{{ saveError }}</p>
        <footer>
          <button type="button" @click="editing = false">取消</button>
          <button type="submit" :disabled="saving || draftName.trim().length < 2">{{ saving ? '保存中…' : '保存资料' }}</button>
        </footer>
      </form>
    </div>
  </div>
</template>
