<script setup lang="ts">
import { computed } from 'vue'
import { STAR_COIN_ICON, STAR_COIN_NAME, starCoinFormatter } from '@/lib/currency'

const props = withDefaults(defineProps<{
  amount: number | string | null | undefined
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showName?: boolean
}>(), {
  size: 'md',
  showName: false,
})

const displayAmount = computed(() => {
  if (props.amount == null || props.amount === '')
    return '—'
  return typeof props.amount === 'number'
    ? starCoinFormatter.format(props.amount)
    : props.amount
})
</script>

<template>
  <span
    class="currency-amount"
    :class="`currency-amount--${size}`"
    :title="`${displayAmount} ${STAR_COIN_NAME}`"
    :aria-label="`${displayAmount} ${STAR_COIN_NAME}`"
  >
    <img :src="STAR_COIN_ICON" alt="" aria-hidden="true" class="currency-amount__icon" />
    <span class="currency-amount__value">{{ displayAmount }}</span>
    <span v-if="showName" class="currency-amount__name">{{ STAR_COIN_NAME }}</span>
  </span>
</template>
