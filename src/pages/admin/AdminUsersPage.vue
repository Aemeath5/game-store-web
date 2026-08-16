<script setup lang="ts">
import { ref } from 'vue'
import { Ban, BadgeCheck, Search, ShieldCheck, UserCheck, Users } from 'lucide-vue-next'
import AppSelect from '@/components/ui/AppSelect.vue'
import CurrencyAmount from '@/components/ui/CurrencyAmount.vue'

const roleFilter = ref('all')
const roleOptions = [
  { value: 'all', label: '全部身份' },
  { value: 'user', label: '普通用户' },
  { value: 'seller', label: '认证卖家' },
  { value: 'admin', label: '管理员' },
]

const users = [
  { name: 'Aemeath', email: 'aemeath@example.com', role: '超级管理员', level: 'Lv.12', trades: 58, balance: 6820, status: '正常', avatar: '/assets/reference/avatar-main.svg' },
  { name: '璃月百货', email: 'liyue@example.com', role: '认证卖家', level: 'Lv.9', trades: 328, balance: 18420, status: '正常', avatar: '/assets/reference/avatar-2.svg' },
  { name: '枫丹商会', email: 'fontaine@example.com', role: '认证卖家', level: 'Lv.7', trades: 186, balance: 9310, status: '正常', avatar: '/assets/reference/avatar-3.svg' },
  { name: '可疑账号17', email: 'risk17@example.com', role: '普通用户', level: 'Lv.2', trades: 3, balance: 0, status: '限制中', avatar: '/assets/reference/avatar-4.svg' },
]
</script>

<template>
  <div class="admin-page">
    <section class="admin-page__heading"><div><span>USER MANAGEMENT</span><h1>用户管理</h1><p>管理用户身份、卖家认证、账户状态和风控记录。</p></div></section>

    <section class="admin-user-summary">
      <article><Users /><span><small>用户总数</small><strong>12,864</strong></span></article>
      <article><UserCheck /><span><small>今日新增</small><strong>86</strong></span></article>
      <article><BadgeCheck /><span><small>认证卖家</small><strong>3,905</strong></span></article>
      <article><Ban /><span><small>风险账户</small><strong>27</strong></span></article>
    </section>

    <section class="admin-card">
      <div class="admin-toolbar-inline">
        <label class="admin-field admin-field--search"><Search /><input placeholder="搜索用户名、邮箱或 UID" /></label>
        <AppSelect v-model="roleFilter" class="admin-filter-select" :options="roleOptions" aria-label="选择用户身份" variant="admin" />
      </div>
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead><tr><th>用户</th><th>身份</th><th>等级</th><th>成交数</th><th>创世星余额</th><th>状态</th><th>操作</th></tr></thead>
          <tbody><tr v-for="user in users" :key="user.email">
            <td><div class="admin-user-cell"><img :src="user.avatar" :alt="user.name" /><span><strong>{{ user.name }}</strong><small>{{ user.email }}</small></span></div></td>
            <td><span class="admin-role"><ShieldCheck v-if="user.role.includes('管理员')" />{{ user.role }}</span></td><td>{{ user.level }}</td><td>{{ user.trades }}</td><td><CurrencyAmount :amount="user.balance" size="xs" class="admin-table-currency" /></td>
            <td><span class="admin-status" :class="user.status === '正常' ? 'status-success' : 'status-danger'">{{ user.status }}</span></td>
            <td><button class="admin-link-button">详情</button></td>
          </tr></tbody>
        </table>
      </div>
    </section>
  </div>
</template>
