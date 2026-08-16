<script setup lang="ts">
import { ref } from 'vue'
import { BellRing, CloudCog, Database, KeyRound, Megaphone, Save, ShieldCheck } from 'lucide-vue-next'
import AppSelect from '@/components/ui/AppSelect.vue'

const maintenance = ref(false)
const manualReview = ref(true)
const sellerAudit = ref(true)
const disputeNotification = ref('instant')
const disputeNotificationOptions = [
  { value: 'instant', label: '立即通知' },
  { value: 'digest', label: '每 10 分钟汇总' },
]
</script>

<template>
  <div class="admin-page">
    <section class="admin-page__heading">
      <div><span>SYSTEM SETTINGS</span><h1>系统设置</h1><p>配置平台基本信息、交易规则、安全策略和通知。</p></div>
      <button class="admin-primary-button"><Save /> 保存设置</button>
    </section>

    <section class="admin-settings-grid">
      <article class="admin-card admin-setting-card">
        <header><span><CloudCog /><b>基本设置</b></span><small>平台名称与公开信息</small></header>
        <label>平台名称<input value="Aemeath 原神交易市场" /></label>
        <label>平台描述<textarea rows="3">安全、便捷的游戏道具和账号交易平台。</textarea></label>
        <label>客服邮箱<input value="support@aemeath.com" /></label>
      </article>

      <article class="admin-card admin-setting-card">
        <header><span><ShieldCheck /><b>交易与风控</b></span><small>审核及安全策略</small></header>
        <label class="admin-switch-row"><span><b>高价值订单人工复核</b><small>金额超过 2,000 星币时进入人工审核</small></span><input v-model="manualReview" type="checkbox" /></label>
        <label class="admin-switch-row"><span><b>卖家实名认证审核</b><small>未认证卖家不可发布商品</small></span><input v-model="sellerAudit" type="checkbox" /></label>
        <label class="admin-switch-row"><span><b>维护模式</b><small>开启后普通用户不能进入交易页面</small></span><input v-model="maintenance" type="checkbox" /></label>
      </article>

      <article class="admin-card admin-setting-card">
        <header><span><Database /><b>存储与备份</b></span><small>数据库、图片与日志状态</small></header>
        <div class="admin-health-row"><span>MySQL 数据库</span><b class="online">运行正常</b></div>
        <div class="admin-health-row"><span>Redis 缓存</span><b class="online">运行正常</b></div>
        <div class="admin-health-row"><span>本地文件存储</span><b>已使用 18.6 GB</b></div>
        <button class="admin-secondary-button">立即创建备份</button>
      </article>

      <article class="admin-card admin-setting-card">
        <header><span><BellRing /><b>通知设置</b></span><small>公告与管理员提醒</small></header>
        <label>管理员通知邮箱<input value="admin@aemeath.com" /></label>
        <label>订单争议提醒<AppSelect v-model="disputeNotification" :options="disputeNotificationOptions" aria-label="选择订单争议提醒频率" variant="form" /></label>
        <button class="admin-secondary-button"><Megaphone /> 发布平台公告</button>
      </article>

      <article class="admin-card admin-setting-card admin-setting-card--wide">
        <header><span><KeyRound /><b>安全密钥</b></span><small>敏感配置仅在服务端环境变量中保存</small></header>
        <div class="admin-secret-grid"><label>JWT 密钥<input type="password" value="••••••••••••••••" disabled /></label><label>支付回调密钥<input type="password" value="••••••••••••••••" disabled /></label></div>
        <p class="admin-setting-note">后台页面只显示配置状态，不会读取或返回真实密钥。</p>
      </article>
    </section>
  </div>
</template>
