<script setup lang="ts">
import CurrencyAmount from '@/components/ui/CurrencyAmount.vue'

const orders = [
  { id: 'YS202608070001', title: '脆弱树脂 × 10', price: 480, status: '等待卖家交付', image: '/assets/reference/item-snow.svg' },
  { id: 'YS202608060082', title: '雷霆数珠 × 1', price: 475, status: '交易完成', image: '/assets/reference/item-mask.svg' },
]
</script>

<template>
  <div class="orders-page page-light"><div class="orders-container"><div class="page-heading-row"><div><p class="page-kicker">ORDERS</p><h1>我的订单</h1></div></div><section class="orders-list panel-light"><article v-for="order in orders" :key="order.id"><img :src="order.image" alt="" /><div><small>订单号 {{ order.id }}</small><h3>{{ order.title }}</h3></div><CurrencyAmount :amount="order.price" size="sm" class="order-price" /><span>{{ order.status }}</span></article></section></div></div>
</template>
