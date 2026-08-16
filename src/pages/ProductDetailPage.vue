<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  BadgeCheck,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-vue-next'
import CurrencyAmount from '@/components/ui/CurrencyAmount.vue'
import { products } from '@/data/products'

const route = useRoute()
const product = computed(() => products.find((item) => item.id === Number(route.params.id)) ?? products[0])
</script>

<template>
  <div class="detail-page page-light">
    <div class="detail-container">
      <div class="breadcrumb"><RouterLink to="/market">交易市场</RouterLink><ChevronRight />商品详情<ChevronRight />{{ product.title }}</div>

      <section class="detail-main panel-light">
        <div class="detail-gallery">
          <span class="detail-quality">五星品质</span>
          <img :src="product.image" :alt="product.title" />
          <div class="detail-gallery-actions"><button><Heart /> 收藏</button><button><Eye /> {{ product.views }}</button></div>
        </div>

        <div class="detail-info">
          <div class="detail-server">{{ product.game }} · {{ product.server }}</div>
          <h1>{{ product.title }}</h1>
          <p class="detail-subtitle">库存充足，支持平台担保交易与快速交付。</p>
          <div class="detail-tags"><span v-for="tag in product.tags" :key="tag">{{ tag }}</span></div>
          <div class="detail-price"><span>当前售价</span><CurrencyAmount :amount="product.price" size="lg" show-name class="detail-price__amount" /></div>
          <div class="detail-rows">
            <div><span>商品等级</span><strong>Lv.{{ product.level }}</strong></div>
            <div><span>库存数量</span><strong>99+</strong></div>
            <div><span>交付方式</span><strong>游戏内邮件 / 面交</strong></div>
            <div><span>结算货币</span><strong>创世星</strong></div>
            <div><span>售后保障</span><strong>平台争议处理</strong></div>
          </div>
          <div class="detail-actions">
            <button class="secondary-button"><MessageCircle /> 联系卖家</button>
            <button class="primary-button detail-buy"><ShoppingCart /> 立即购买</button>
          </div>
        </div>
      </section>

      <section class="detail-lower">
        <article class="panel-light detail-description">
          <h2>商品说明</h2>
          <p>商品数据来自原项目页面结构的本地演示。后续接入服务端后，这里会展示真实库存、卖家备注、交付记录和商品快照。</p>
          <div class="detail-features">
            <span><ShieldCheck /> 平台担保</span>
            <span><BadgeCheck /> 卖家认证</span>
            <span><PackageCheck /> 库存已校验</span>
          </div>
        </article>

        <aside class="panel-light seller-card">
          <h2>卖家信息</h2>
          <div class="seller-profile"><img src="/assets/reference/avatar-main.svg" alt="seller" /><div><strong>{{ product.seller }}</strong><span>认证卖家 · Lv.{{ product.sellerLevel }}</span></div></div>
          <div class="seller-stats"><div><strong>98.9%</strong><span>好评率</span></div><div><strong>263</strong><span>成交</span></div><div><strong>5分钟</strong><span>响应</span></div></div>
        </aside>
      </section>
    </div>
  </div>
</template>
