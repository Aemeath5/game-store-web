<script setup lang="ts">
import { computed } from 'vue'
import { GENESIS_STAR_ICON, GENESIS_STAR_NAME, genesisStarFormatter } from '@/lib/currency'

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
    ? genesisStarFormatter.format(props.amount)
    : props.amount
})
</script>

<template>
  <span
    class="currency-amount"
    :class="`currency-amount--${size}`"
    :title="`${displayAmount} ${GENESIS_STAR_NAME}`"
    :aria-label="`${displayAmount} ${GENESIS_STAR_NAME}`"
  >
    <img :src="GENESIS_STAR_ICON" alt="" aria-hidden="true" class="currency-amount__icon" />
    <span class="currency-amount__value">{{ displayAmount }}</span>
    <span v-if="showName" class="currency-amount__name">{{ GENESIS_STAR_NAME }}</span>
  </span>
</template>
