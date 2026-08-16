<script setup lang="ts">
import { computed, ref } from 'vue'
import { CheckCircle2, Eye, Filter, MoreHorizontal, Plus, Search, XCircle } from 'lucide-vue-next'
import AppSelect from '@/components/ui/AppSelect.vue'
import CurrencyAmount from '@/components/ui/CurrencyAmount.vue'

const keyword = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')
const categoryOptions = [
  { value: 'all', label: '全部分类' },
  { value: '材料', label: '材料' },
  { value: '武器', label: '武器' },
  { value: '角色', label: '角色' },
]
const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: '在售', label: '在售' },
  { value: '审核中', label: '审核中' },
  { value: '已下架', label: '已下架' },
]
const products = [
  { id: 10042, name: '冰之印 × 10', category: '材料', seller: '璃月百货', price: 680, stock: 18, status: '在售', image: '/assets/reference/item-orb.svg' },
  { id: 10041, name: '脆弱树脂 × 5', category: '材料', seller: '枫丹商会', price: 320, stock: 9, status: '在售', image: '/assets/reference/item-snow.svg' },
  { id: 10040, name: '最初的大魔术', category: '武器', seller: '晨曦酒庄', price: 2680, stock: 1, status: '审核中', image: '/assets/reference/item-flower.svg' },
  { id: 10039, name: '罗莎莉亚角色资源', category: '角色', seller: '蒙德骑士团', price: 1280, stock: 1, status: '已下架', image: '/assets/reference/avatar-4.svg' },
  { id: 10038, name: '雷霆数珠 × 20', category: '材料', seller: '稻妻杂货铺', price: 475, stock: 26, status: '在售', image: '/assets/reference/item-mask.svg' },
]

const filtered = computed(() => products.filter(item => (
  `${item.name}${item.seller}${item.category}`.includes(keyword.value)
  && (categoryFilter.value === 'all' || item.category === categoryFilter.value)
  && (statusFilter.value === 'all' || item.status === statusFilter.value)
)))
</script>

<template>
  <div class="admin-page">
    <section class="admin-page__heading">
      <div><span>PRODUCT MANAGEMENT</span><h1>商品管理</h1><p>审核、编辑、上下架并管理平台商品库存。</p></div>
      <button class="admin-primary-button"><Plus /> 新增商品</button>
    </section>

    <section class="admin-card admin-toolbar-card">
      <label class="admin-field admin-field--search"><Search /><input v-model="keyword" placeholder="搜索商品、卖家或分类" /></label>
      <AppSelect v-model="categoryFilter" :options="categoryOptions" aria-label="选择商品分类" variant="admin" />
      <AppSelect v-model="statusFilter" :options="statusOptions" aria-label="选择商品状态" variant="admin" />
      <button class="admin-secondary-button"><Filter /> 更多筛选</button>
    </section>

    <section class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table admin-product-table">
          <thead><tr><th>商品</th><th>分类</th><th>卖家</th><th>价格（星币）</th><th>库存</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="item in filtered" :key="item.id">
              <td><div class="admin-product-cell"><img :src="item.image" :alt="item.name" /><span><strong>{{ item.name }}</strong><small>#{{ item.id }}</small></span></div></td>
              <td>{{ item.category }}</td><td>{{ item.seller }}</td><td><CurrencyAmount :amount="item.price" size="xs" class="admin-table-currency" /></td><td>{{ item.stock }}</td>
              <td>
                <span class="admin-status" :class="item.status === '在售' ? 'status-success' : item.status === '审核中' ? 'status-warning' : 'status-muted'">
                  <CheckCircle2 v-if="item.status === '在售'" /><XCircle v-else-if="item.status === '已下架'" />{{ item.status }}
                </span>
              </td>
              <td><div class="admin-row-actions"><button title="查看"><Eye /></button><button title="更多"><MoreHorizontal /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <footer class="admin-pagination"><span>共 {{ filtered.length }} 个商品</span><div><button disabled>上一页</button><button class="active">1</button><button>下一页</button></div></footer>
    </section>
  </div>
</template>
