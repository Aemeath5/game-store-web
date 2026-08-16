<script setup lang="ts">
import { Eye, ShieldCheck } from 'lucide-vue-next'
import CurrencyAmount from '@/components/ui/CurrencyAmount.vue'
import type { Product } from '@/types/market'

defineProps<{ product: Product }>()
</script>

<template>
  <RouterLink :to="`/market/${product.id}`" class="market-card">
    <div class="market-card__image-wrap">
      <span class="market-card__server">{{ product.server }}</span>
      <span v-if="product.status === 'reserved'" class="market-card__reserved">已预订</span>
      <img :src="product.image" :alt="product.title" class="market-card__image" />
    </div>
    <div class="market-card__body">
      <h3>{{ product.title }}</h3>
      <div class="market-card__tags">
        <span v-for="tag in product.tags.slice(0, 2)" :key="tag">{{ tag }}</span>
      </div>
      <div class="market-card__meta">
        <span><Eye /> {{ product.views }}</span>
        <span><ShieldCheck /> 平台担保</span>
      </div>
      <div class="market-card__footer">
        <span class="market-card__seller">{{ product.seller }} · Lv.{{ product.sellerLevel }}</span>
        <CurrencyAmount :amount="product.price" size="sm" class="market-card__price" />
      </div>
    </div>
  </RouterLink>
</template>
