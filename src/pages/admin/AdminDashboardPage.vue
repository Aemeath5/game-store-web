<script setup lang="ts">
import { ref } from 'vue'
import {
  ArrowUpRight,
  BadgeCheck,
  CircleDollarSign,
  Clock3,
  PackageSearch,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-vue-next'
import AppSelect from '@/components/ui/AppSelect.vue'
import CurrencyAmount from '@/components/ui/CurrencyAmount.vue'

const trendPeriod = ref('today')
const trendPeriodOptions = [
  { value: 'today', label: '今日' },
  { value: '7d', label: '近 7 天' },
  { value: '30d', label: '近 30 天' },
]

const metrics = [
  { label: '在售商品', value: 172, currency: false, change: '+12.8%', icon: PackageSearch, tone: 'blue' },
  { label: '今日订单', value: 46, currency: false, change: '+8.4%', icon: ShoppingCart, tone: 'green' },
  { label: '今日成交额', value: 38420, currency: true, change: '+18.6%', icon: CircleDollarSign, tone: 'gold' },
  { label: '活跃用户', value: 1217, currency: false, change: '+6.2%', icon: Users, tone: 'purple' },
]

const orders = [
  { id: 'GM202608070031', user: '旅行者·空', item: '冰之印 × 10', amount: 680, status: '待交付', tone: 'warning' },
  { id: 'GM202608070030', user: '璃月港商人', item: '脆弱树脂 × 5', amount: 320, status: '已完成', tone: 'success' },
  { id: 'GM202608070029', user: '枫丹来客', item: '最初的大魔术', amount: 2680, status: '人工复核', tone: 'info' },
  { id: 'GM202608070028', user: '蒙德骑士', item: '摩拉 × 100万', amount: 88, status: '待付款', tone: 'muted' },
]

const pending = [
  { title: '高价值商品待审核', count: 8, hint: '含 3 个账号类商品', icon: BadgeCheck },
  { title: '争议订单待处理', count: 3, hint: '最长等待 42 分钟', icon: Clock3 },
  { title: '星币划转待复核', count: 6, hint: '合计 12,860 星币', icon: CircleDollarSign },
]

const trend = [42, 58, 49, 68, 62, 78, 72, 91, 84, 96, 88, 100]
</script>

<template>
  <div class="admin-page">
    <section class="admin-page__heading">
      <div><span>ADMIN DASHBOARD</span><h1>后台总览</h1><p>查看平台经营数据、审核任务和最新订单。</p></div>
      <button class="admin-primary-button">导出今日报表 <ArrowUpRight /></button>
    </section>

    <section class="admin-metrics">
      <article v-for="item in metrics" :key="item.label" class="admin-metric-card" :class="`tone-${item.tone}`">
        <div class="admin-metric-card__icon"><component :is="item.icon" /></div>
        <span>{{ item.label }}</span>
        <CurrencyAmount v-if="item.currency" :amount="item.value" size="sm" class="admin-metric-currency" />
        <strong v-else>{{ item.value.toLocaleString('zh-CN') }}</strong>
        <small><TrendingUp /> {{ item.change }} 较昨日</small>
      </article>
    </section>

    <section class="admin-grid admin-grid--overview">
      <article class="admin-card admin-trend-card">
        <header class="admin-card__header">
          <div><span>近 12 小时</span><h2>成交趋势</h2></div>
          <AppSelect
            v-model="trendPeriod"
            class="admin-period-select"
            :options="trendPeriodOptions"
            aria-label="选择成交趋势时间"
            variant="admin"
            size="compact"
          />
        </header>
        <div class="admin-chart-summary"><CurrencyAmount :amount="38420" size="sm" class="admin-chart-currency" /><span>今日累计成交额</span></div>
        <div class="admin-bar-chart">
          <i v-for="(height, index) in trend" :key="index" :style="{ height: `${height}%` }"><span>{{ index + 8 }}:00</span></i>
        </div>
      </article>

      <article class="admin-card admin-pending-card">
        <header class="admin-card__header"><div><span>待办事项</span><h2>需要处理</h2></div></header>
        <div class="admin-pending-list">
          <button v-for="item in pending" :key="item.title">
            <span class="admin-pending-list__icon"><component :is="item.icon" /></span>
            <span><strong>{{ item.title }}</strong><small>{{ item.hint }}</small></span>
            <b>{{ item.count }}</b>
          </button>
        </div>
      </article>
    </section>

    <section class="admin-card">
      <header class="admin-card__header">
        <div><span>RECENT ORDERS</span><h2>最新订单</h2></div>
        <RouterLink to="/admin/orders">查看全部</RouterLink>
      </header>
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead><tr><th>订单号</th><th>买家</th><th>商品</th><th>金额</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td><strong>{{ order.id }}</strong></td><td>{{ order.user }}</td><td>{{ order.item }}</td><td><CurrencyAmount :amount="order.amount" size="xs" class="admin-table-currency" /></td>
              <td><span class="admin-status" :class="`status-${order.tone}`">{{ order.status }}</span></td>
              <td><button class="admin-link-button">查看</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
