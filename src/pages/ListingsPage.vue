<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
  PackagePlus,
  RefreshCw,
  Search,
  Tag,
  UploadCloud,
} from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'
import type { PlayerInventoryItem } from '@/types/player'

const app = useAppStore()
const tab = ref<'inventory' | 'listing' | 'publish'>('inventory')
const keyword = ref('')
const categoryFilter = ref('all')
const selectedItemKey = ref('')
const numberFormatter = new Intl.NumberFormat('zh-CN')

const categoryPresentation: Record<string, { label: string, image: string }> = {
  material: { label: '材料', image: '/assets/reference/item-orb.svg' },
  furniture: { label: '摆设', image: '/assets/reference/item-blue.svg' },
  equip: { label: '装备', image: '/assets/reference/item-snow.svg' },
  weapon: { label: '武器', image: '/assets/reference/item-flower.svg' },
  reliquary: { label: '圣遗物', image: '/assets/reference/item-mask.svg' },
  unknown: { label: '其他道具', image: '/assets/reference/item-dragon.svg' },
}

const inventory = computed(() => app.playerSnapshot?.inventory ?? null)
const inventoryItems = computed(() => inventory.value?.items ?? [])
const currentPage = computed(() => inventory.value?.page ?? 1)
const pageCount = computed(() => {
  if (!inventory.value?.page_size)
    return 1
  return Math.max(1, Math.ceil(inventory.value.total / inventory.value.page_size))
})
const categoryOptions = computed(() => [...new Set(inventoryItems.value.map(item => item.category))].sort())
const filteredItems = computed(() => {
  const needle = keyword.value.trim().toLowerCase()
  return inventoryItems.value.filter((item) => {
    if (categoryFilter.value !== 'all' && item.category !== categoryFilter.value)
      return false
    if (!needle)
      return true
    return [item.item_id, item.guid, item.item_key, item.category, categoryLabel(item.category)]
      .filter(value => value != null)
      .some(value => String(value).toLowerCase().includes(needle))
  })
})
const selectedItem = computed(() => inventoryItems.value.find(item => item.item_key === selectedItemKey.value))

watch(inventoryItems, (items) => {
  if (!items.some(item => item.item_key === selectedItemKey.value && !item.locked))
    selectedItemKey.value = items.find(item => !item.locked)?.item_key ?? ''
}, { immediate: true })

function categoryMeta(category: string) {
  return categoryPresentation[category] ?? categoryPresentation.unknown
}

function categoryLabel(category: string) {
  return categoryMeta(category).label
}

function categoryImage(category: string) {
  return categoryMeta(category).image
}

function itemTitle(item: PlayerInventoryItem) {
  return `${categoryLabel(item.category)} #${item.item_id}`
}

function itemDetails(item: PlayerInventoryItem) {
  const details = []
  if (item.level != null)
    details.push(`等级 ${item.level}`)
  if (item.promote_level != null)
    details.push(`突破 ${item.promote_level}`)
  if (item.refine_level != null)
    details.push(`精炼 ${item.refine_level}`)
  if (item.main_prop_id != null)
    details.push(`主属性 ${item.main_prop_id}`)
  return details.length ? details.join(' · ') : `类型 ${item.item_type}`
}

function itemIdentity(item: PlayerInventoryItem) {
  return item.guid ? `GUID ${item.guid}` : `KEY ${item.item_key}`
}

function formatAmount(value: number | null | undefined) {
  return value == null ? '—' : numberFormatter.format(value)
}

async function refreshInventory() {
  try {
    await app.loadPlayerSnapshot(currentPage.value, inventory.value?.page_size ?? 100, true)
  }
  catch {
    // The store exposes the backend error in this page.
  }
}

async function changePage(page: number) {
  const nextPage = Math.min(Math.max(1, page), pageCount.value)
  if (nextPage === currentPage.value || app.playerLoading)
    return
  keyword.value = ''
  categoryFilter.value = 'all'
  try {
    await app.loadPlayerSnapshot(nextPage, inventory.value?.page_size ?? 100, true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  catch {
    // The store exposes the backend error in this page.
  }
}

function openPublish(item?: PlayerInventoryItem) {
  if (item && !item.locked)
    selectedItemKey.value = item.item_key
  tab.value = 'publish'
}
</script>

<template>
  <div class="inventory-page page-light">
    <div class="inventory-container">
      <div class="page-heading-row">
        <div><p class="page-kicker">INVENTORY</p><h1>背包与上架</h1></div>
        <button class="primary-button" @click="openPublish()"><PackagePlus /> 上架道具</button>
      </div>

      <div class="inventory-tabs panel-light">
        <button :class="{ active: tab === 'inventory' }" @click="tab = 'inventory'">
          <Boxes /> 背包道具 <span>{{ formatAmount(app.inventoryTotal) }}</span>
        </button>
        <button :class="{ active: tab === 'listing' }" @click="tab = 'listing'">
          <Tag /> 我的挂单 <span>—</span>
        </button>
        <button :class="{ active: tab === 'publish' }" @click="openPublish()"><UploadCloud /> 发布商品</button>
      </div>

      <template v-if="tab === 'inventory'">
        <div class="inventory-toolbar panel-light">
          <label class="light-search">
            <Search />
            <input v-model="keyword" placeholder="在当前页搜索物品 ID、GUID 或分类...">
          </label>
          <select v-model="categoryFilter" class="light-select inventory-category-select" aria-label="背包分类">
            <option value="all">全部分类</option>
            <option v-for="category in categoryOptions" :key="category" :value="category">{{ categoryLabel(category) }}</option>
          </select>
          <button class="inventory-refresh" type="button" :disabled="app.playerLoading" @click="refreshInventory">
            <RefreshCw :class="{ spinning: app.playerLoading }" /> 刷新
          </button>
        </div>

        <div v-if="app.playerError" class="inventory-state inventory-state--error panel-light">
          <div><strong>玩家背包读取失败</strong><p>{{ app.playerError }}</p></div>
          <button type="button" @click="refreshInventory">重试</button>
        </div>
        <div v-else-if="app.playerLoading && !inventory" class="inventory-state panel-light">
          <RefreshCw class="spinning" /><div><strong>正在读取游戏存档</strong><p>背包数据只在商城后端与游戏数据库之间传输。</p></div>
        </div>
        <div v-else-if="!inventory" class="inventory-state panel-light">
          <Boxes /><div><strong>尚未读取背包</strong><p>登录后会自动根据绑定的 game_uid 加载玩家数据。</p></div>
        </div>
        <template v-else>
          <div class="inventory-summary">
            <span>共 {{ formatAmount(inventory.total) }} 件记录，第 {{ inventory.page }} / {{ pageCount }} 页</span>
            <span v-if="app.playerLoading"><RefreshCw class="spinning" /> 正在更新…</span>
          </div>

          <div v-if="filteredItems.length" class="inventory-grid">
            <article v-for="item in filteredItems" :key="item.item_key" class="inventory-card panel-light" :class="{ 'is-locked': item.locked }">
              <span class="inventory-category-badge">{{ categoryLabel(item.category) }}</span>
              <span v-if="item.locked" class="inventory-lock"><LockKeyhole /> 已锁定</span>
              <img :src="categoryImage(item.category)" :alt="itemTitle(item)">
              <h3>{{ itemTitle(item) }}</h3>
              <p class="inventory-card__meta">{{ itemDetails(item) }}</p>
              <small class="inventory-card__identity" :title="itemIdentity(item)">{{ itemIdentity(item) }}</small>
              <div class="inventory-card__footer">
                <span>数量 {{ formatAmount(item.count) }}</span>
                <button type="button" :disabled="item.locked" @click="openPublish(item)">{{ item.locked ? '不可上架' : '上架' }}</button>
              </div>
            </article>
          </div>
          <div v-else class="inventory-state panel-light">
            <Search /><div><strong>当前页没有匹配道具</strong><p>请清除搜索内容或切换分类。</p></div>
          </div>

          <nav v-if="pageCount > 1" class="inventory-pagination" aria-label="背包分页">
            <button type="button" :disabled="currentPage <= 1 || app.playerLoading" @click="changePage(currentPage - 1)"><ChevronLeft /> 上一页</button>
            <span>{{ currentPage }} / {{ pageCount }}</span>
            <button type="button" :disabled="currentPage >= pageCount || app.playerLoading" @click="changePage(currentPage + 1)">下一页 <ChevronRight /></button>
          </nav>
        </template>
      </template>

      <section v-else-if="tab === 'listing'" class="inventory-state inventory-state--large panel-light">
        <Tag />
        <div><strong>挂单接口尚未接入</strong><p>玩家背包已经使用真实数据；下一阶段接入挂单创建与查询接口后，这里会展示真实挂单。</p></div>
      </section>

      <section v-else class="publish-grid">
        <form class="panel-light publish-form" @submit.prevent>
          <h2>发布商品</h2>
          <p class="publish-form__notice">当前只完成真实背包读取，提交挂单将在交易接口接入后开放。</p>
          <label>
            选择道具
            <select v-model="selectedItemKey" :disabled="!inventoryItems.length">
              <option v-if="!inventoryItems.length" value="">当前页没有可选道具</option>
              <option v-for="item in inventoryItems" :key="item.item_key" :value="item.item_key" :disabled="item.locked">
                {{ itemTitle(item) }} · 数量 {{ formatAmount(item.count) }}{{ item.locked ? '（已锁定）' : '' }}
              </option>
            </select>
          </label>
          <div class="two-fields">
            <label>数量<input type="number" value="1" min="1" :max="selectedItem?.count || 1"></label>
            <label>单价<input type="number" placeholder="0" min="0"></label>
          </div>
          <label>商品说明<textarea placeholder="填写交付时间、库存情况和其他说明..." /></label>
          <button class="primary-button" type="submit" disabled>挂单接口待接入</button>
        </form>
        <aside class="panel-light publish-help">
          <img v-if="selectedItem" :src="categoryImage(selectedItem.category)" :alt="itemTitle(selectedItem)">
          <UploadCloud v-else />
          <h3>{{ selectedItem ? itemTitle(selectedItem) : '从背包选择道具' }}</h3>
          <p v-if="selectedItem">数量 {{ formatAmount(selectedItem.count) }} · {{ itemDetails(selectedItem) }}</p>
          <p v-else>这里只会列出后端返回的真实背包道具，不再使用演示物品。</p>
        </aside>
      </section>
    </div>
  </div>
</template>
