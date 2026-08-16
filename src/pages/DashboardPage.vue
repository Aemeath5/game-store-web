<script setup lang="ts">
import { computed } from 'vue'
import {
  Archive,
  ArrowRight,
  Boxes,
  History,
  Hammer,
  Megaphone,
  ReceiptText,
  RefreshCw,
  ShoppingBasket,
  ShoppingCart,
  Sparkles,
  Store,
  Tag,
  Trophy,
  TrendingUp,
  WalletCards,
  Zap,
} from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'

const app = useAppStore()
const primogemIcon = '/game-assets/icons/UI_ItemIcon_201.webp'
const moraIcon = '/game-assets/icons/UI_ItemIcon_202.webp'

const numberFormatter = new Intl.NumberFormat('zh-CN')
const primogem = computed(() => app.playerSnapshot?.currency.primogem)
const mora = computed(() => app.playerSnapshot?.currency.mora)
const inventoryTotal = computed(() => app.inventoryTotal)
const playerStatus = computed(() => {
  if (app.playerLoading)
    return '正在读取游戏存档…'
  if (app.playerError)
    return app.playerError
  if (app.playerSnapshot)
    return `游戏数据已同步 · UID ${app.playerSnapshot.uid}`
  return '等待读取游戏存档'
})

function formatAmount(value: number | null | undefined) {
  return value == null ? '—' : numberFormatter.format(value)
}

async function refreshPlayer() {
  try {
    await app.loadPlayerSnapshot(1, 100, true)
  }
  catch {
    // The store exposes the backend error beside the refresh button.
  }
}

const quickLinks = [
  { label: '浏览市场', path: '/market', icon: ShoppingBasket },
  { label: '上架道具', path: '/listings', icon: Tag },
  { label: '参与拍卖', path: '/market?tab=auction', icon: Trophy },
  { label: '军需商店', path: '/orders', icon: ShoppingCart },
  { label: '武器锻造', path: '/listings', icon: Hammer },
  { label: '背包管理', path: '/listings', icon: Boxes },
]

const hotItems = [
  { name: '冰之印', count: 11, image: '/assets/reference/item-orb.svg' },
  { name: '脆弱树脂', count: 10, image: '/assets/reference/item-snow.svg' },
  { name: '芙宁娜', count: 6, image: '/assets/reference/avatar-main.svg' },
  { name: '最初的大魔术', count: 5, image: '/assets/reference/item-flower.svg' },
  { name: '罗莎莉亚', count: 5, image: '/assets/reference/avatar-4.svg' },
]

const activities = [
  { text: '上架「原素花蜜」', time: '1天前', amount: '-100', type: 'listed' },
  { text: '上架「微光花蜜」', time: '1天前', amount: '-50', type: 'listed' },
  { text: '上架「鸣草」', time: '1天前', amount: '-30', type: 'listed' },
  { text: '上架「石珀」', time: '1天前', amount: '-30', type: 'listed' },
  { text: '上架「石珀」×100', time: '2天前', amount: '-3,000', type: 'listed' },
  { text: '购买「雷霆数珠」', time: '7天前', amount: '-475', type: 'buy' },
]
</script>

<template>
  <div class="dashboard-page">
    <div class="dashboard-container">
      <section class="hero-row">
        <div class="hero-carousel">
          <img src="/assets/reference/dashboard-banner.svg" alt="限时活动" class="hero-carousel__image" />
          <div class="hero-carousel__caption">
            <span>限定祈愿·杯装之诗</span>
            <span class="hero-dots"><i class="active" /><i /></span>
          </div>
        </div>

        <div class="hero-side">
          <section class="wallet-card">
            <header class="wallet-card__head">
              <span class="wallet-greeting"><Sparkles /> 早上好，{{ app.displayName }}</span>
              <RouterLink to="/profile" class="wallet-wallet-link"><WalletCards /></RouterLink>
            </header>
            <div class="wallet-card__body">
              <div class="wallet-balances">
                <div class="wallet-balance">
                  <img :src="primogemIcon" alt="原石" class="wallet-balance__icon" />
                  <div class="wallet-balance__text">
                    <strong class="wallet-balance__num">{{ formatAmount(primogem) }}</strong>
                    <span class="wallet-balance__label">原石</span>
                  </div>
                </div>
                <span class="wallet-balances__divider" />
                <div class="wallet-balance">
                  <img :src="moraIcon" alt="摩拉" class="wallet-balance__icon" />
                  <div class="wallet-balance__text">
                    <strong class="wallet-balance__num">{{ formatAmount(mora) }}</strong>
                    <span class="wallet-balance__label">摩拉</span>
                  </div>
                </div>
              </div>

              <div class="wallet-voucher">
                <span class="voucher-ticket">🎟️</span>
                <div class="wallet-voucher__text">
                  <strong class="wallet-voucher__num">—</strong>
                  <span class="wallet-voucher__label">商城凭证</span>
                </div>
                <span class="wallet-voucher__expire">功能尚未接入</span>
              </div>

              <div class="wallet-mini">
                <RouterLink to="/listings" class="wallet-mini__item">
                  <strong class="wallet-mini__num">—</strong>
                  <span class="wallet-mini__label">我的挂单</span>
                </RouterLink>
                <RouterLink to="/listings" class="wallet-mini__item">
                  <strong class="wallet-mini__num">{{ formatAmount(inventoryTotal) }}</strong>
                  <span class="wallet-mini__label">背包道具</span>
                </RouterLink>
              </div>

              <div class="wallet-snapshot" :class="{ error: app.playerError }" :title="playerStatus">
                <span><i />{{ playerStatus }}</span>
                <button type="button" :disabled="app.playerLoading" aria-label="刷新玩家数据" @click="refreshPlayer">
                  <RefreshCw :class="{ spinning: app.playerLoading }" />
                </button>
              </div>
            </div>
          </section>

          <div class="quick-grid">
            <RouterLink v-for="item in quickLinks" :key="item.label" :to="item.path" class="quick-cell">
              <component :is="item.icon" class="quick-cell__icon" />
              <span class="quick-cell__label">{{ item.label }}</span>
            </RouterLink>
          </div>
        </div>
      </section>

      <section class="market-stats">
        <RouterLink to="/market" class="mstat">
          <div class="mstat__body"><strong class="mstat__num">172</strong><span class="mstat__label"><i class="mstat__dot dot-active" />在售商品</span></div>
          <Store class="mstat__icon" />
        </RouterLink>
        <div class="mstat">
          <div class="mstat__body"><strong class="mstat__num">0</strong><span class="mstat__label"><i class="mstat__dot dot-sold" />今日成交</span></div>
          <Zap class="mstat__icon" />
        </div>
        <div class="mstat">
          <div class="mstat__body"><strong class="mstat__num">677.2 万</strong><span class="mstat__label"><i class="mstat__dot dot-volume" />累计成交额</span></div>
          <img :src="moraIcon" alt="" class="mstat__coin" />
        </div>
        <div class="mstat">
          <div class="mstat__body"><strong class="mstat__num">1,217</strong><span class="mstat__label"><i class="mstat__dot dot-total" />历史挂单</span></div>
          <Archive class="mstat__icon" />
        </div>
      </section>

      <section class="main-grid">
        <div class="panel hot-panel">
          <header class="panel-header">
            <div class="panel-title"><TrendingUp /><span>热门商品</span></div>
            <RouterLink to="/market" class="panel-more">进入市场 <ArrowRight /></RouterLink>
          </header>
          <ul class="hot-list">
            <li v-for="(item, index) in hotItems" :key="item.name" class="hot-item">
              <span class="hot-rank" :class="`rank-${index + 1}`">{{ index + 1 }}</span>
              <span class="hot-thumb"><img :src="item.image" :alt="item.name" /></span>
              <span class="hot-name">{{ item.name }}</span>
              <span class="hot-sales">{{ item.count }} 笔成交</span>
            </li>
          </ul>
        </div>

        <aside class="side-column">
          <section class="panel">
            <header class="panel-header">
              <div class="panel-title"><Megaphone /><span>市场公告</span></div>
              <a class="panel-more" href="#">查看全部 <ArrowRight /></a>
            </header>
            <ul class="announce-list">
              <li class="announce-item">
                <div class="announce-row">
                  <span class="announce-tag">更新公告</span>
                  <span class="announce-title">功能优化</span>
                  <span class="announce-time">1个月前</span>
                </div>
                <p class="announce-content">本次更新带来全新公告中心与红点提醒，合成系统升级、重...</p>
              </li>
            </ul>
          </section>

          <section class="panel">
            <header class="panel-header">
              <div class="panel-title"><History /><span>最近活动</span></div>
              <RouterLink to="/orders" class="panel-more">交易记录 <ArrowRight /></RouterLink>
            </header>
            <ul class="activity-list">
              <li v-for="item in activities" :key="item.text" class="activity-item">
                <span class="activity-icon" :class="`act-${item.type}`"><ReceiptText /></span>
                <span class="activity-body"><span class="activity-content">{{ item.text }}</span><span class="activity-time">{{ item.time }}</span></span>
                <strong class="activity-amount">{{ item.amount }}</strong>
              </li>
            </ul>
          </section>
        </aside>
      </section>
    </div>
  </div>
</template>
