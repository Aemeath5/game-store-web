<script setup lang="ts">
import { computed, ref } from 'vue'
import { Filter, Search, SlidersHorizontal } from 'lucide-vue-next'
import AppSelect from '@/components/ui/AppSelect.vue'
import GameCard from '@/components/ui/GameCard.vue'
import { products } from '@/data/products'

const keyword = ref('')
const currentTab = ref<'market' | 'auction' | 'wanted'>('market')
const filters = ['全部类型', '角色材料', '武器', '圣遗物', '消耗品']
const activeFilter = ref('全部类型')
const sortOrder = ref('comprehensive')
const sortOptions = [
  { value: 'comprehensive', label: '综合排序' },
  { value: 'newest', label: '最新发布' },
  { value: 'price-low', label: '价格从低到高' },
  { value: 'price-high', label: '价格从高到低' },
]

const filtered = computed(() => products.filter((product) => product.title.includes(keyword.value.trim())))
</script>

<template>
  <div class="market-page page-light">
    <div class="market-container">
      <div class="page-heading-row">
        <div>
          <p class="page-kicker">GENSHIN MARKET</p>
          <h1>交易市场</h1>
        </div>
        <RouterLink to="/listings" class="primary-button">发布商品</RouterLink>
      </div>

      <section class="market-toolbar panel-light">
        <div class="market-tabs">
          <button :class="{ active: currentTab === 'market' }" @click="currentTab = 'market'">一口价</button>
          <button :class="{ active: currentTab === 'auction' }" @click="currentTab = 'auction'">拍卖</button>
          <button :class="{ active: currentTab === 'wanted' }" @click="currentTab = 'wanted'">求购</button>
        </div>
        <div class="market-search-row">
          <label class="light-search"><Search /><input v-model="keyword" placeholder="搜索商品、材料、武器..." /></label>
          <AppSelect v-model="sortOrder" class="market-sort-select" :options="sortOptions" aria-label="选择商品排序">
            <template #prefix><SlidersHorizontal /></template>
          </AppSelect>
          <button class="filter-button"><Filter /> 筛选</button>
        </div>
        <div class="market-filter-chips">
          <button v-for="item in filters" :key="item" :class="{ active: activeFilter === item }" @click="activeFilter = item">{{ item }}</button>
        </div>
      </section>

      <div class="market-summary"><span>共找到 {{ filtered.length }} 个商品</span><span>星币结算 · 平台担保</span></div>

      <section class="market-layout">
        <aside class="market-sidebar panel-light">
          <h3>商品分类</h3>
          <button v-for="item in filters" :key="item" :class="{ active: activeFilter === item }" @click="activeFilter = item">{{ item }}</button>
          <h3>服务器</h3>
          <label><input type="checkbox" checked /> 天空岛服</label>
          <label><input type="checkbox" /> 世界树服</label>
          <h3>价格区间</h3>
          <div class="price-range"><input placeholder="最低价" /><span>-</span><input placeholder="最高价" /></div>
        </aside>

        <div class="market-grid">
          <GameCard v-for="product in filtered" :key="product.id" :product="product" />
        </div>
      </section>
    </div>
  </div>
</template>
