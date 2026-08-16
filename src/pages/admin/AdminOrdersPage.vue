<script setup lang="ts">
import { ref } from 'vue'
import { CircleDollarSign, Clock3, Eye, Filter, Search, ShieldAlert, Truck } from 'lucide-vue-next'
import CurrencyAmount from '@/components/ui/CurrencyAmount.vue'

const current = ref('全部')
const tabs = ['全部', '待付款', '待交付', '人工复核', '已完成', '争议中']
const orders = [
  { id: 'GM202608070031', buyer: '旅行者·空', seller: '璃月百货', item: '冰之印 × 10', amount: 680, created: '08-07 08:12', status: '待交付' },
  { id: 'GM202608070030', buyer: '枫丹来客', seller: '晨曦酒庄', item: '最初的大魔术', amount: 2680, created: '08-07 07:48', status: '人工复核' },
  { id: 'GM202608070029', buyer: '蒙德骑士', seller: '稻妻杂货铺', item: '雷霆数珠 × 20', amount: 475, created: '08-07 07:20', status: '已完成' },
  { id: 'GM202608070028', buyer: '璃月港商人', seller: '枫丹商会', item: '脆弱树脂 × 5', amount: 320, created: '08-07 06:55', status: '争议中' },
]
</script>

<template>
  <div class="admin-page">
    <section class="admin-page__heading"><div><span>ORDER MANAGEMENT</span><h1>订单管理</h1><p>跟踪付款、交付、复核、退款和争议处理流程。</p></div></section>

    <section class="admin-order-summary">
      <article><Clock3 /><span><small>待付款</small><strong>12</strong></span></article>
      <article><Truck /><span><small>待交付</small><strong>18</strong></span></article>
      <article><ShieldAlert /><span><small>待复核</small><strong>8</strong></span></article>
      <article><CircleDollarSign /><span><small>今日成交</small><CurrencyAmount :amount="38420" size="sm" class="admin-summary-currency" /></span></article>
    </section>

    <section class="admin-card">
      <div class="admin-tabs"><button v-for="tab in tabs" :key="tab" :class="{ active: current === tab }" @click="current = tab">{{ tab }}</button></div>
      <div class="admin-toolbar-inline">
        <label class="admin-field admin-field--search"><Search /><input placeholder="搜索订单号、买家或卖家" /></label>
        <button class="admin-secondary-button"><Filter /> 筛选</button>
      </div>
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead><tr><th>订单号</th><th>买家</th><th>卖家</th><th>商品</th><th>金额（星币）</th><th>下单时间</th><th>状态</th><th>操作</th></tr></thead>
          <tbody><tr v-for="order in orders" :key="order.id">
            <td><strong>{{ order.id }}</strong></td><td>{{ order.buyer }}</td><td>{{ order.seller }}</td><td>{{ order.item }}</td><td><CurrencyAmount :amount="order.amount" size="xs" class="admin-table-currency" /></td><td>{{ order.created }}</td>
            <td><span class="admin-status" :class="order.status === '已完成' ? 'status-success' : order.status === '争议中' ? 'status-danger' : order.status === '人工复核' ? 'status-info' : 'status-warning'">{{ order.status }}</span></td>
            <td><button class="admin-icon-button"><Eye /></button></td>
          </tr></tbody>
        </table>
      </div>
    </section>
  </div>
</template>
