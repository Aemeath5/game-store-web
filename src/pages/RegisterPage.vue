<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Mail, ShieldCheck, Sparkles, UserRound } from 'lucide-vue-next'
import { api } from '@/lib/http'
import type { ApiEnvelope } from '@/lib/auth'
import { apiErrorMessage } from '@/lib/auth'
import '@/auth-pages.css'

interface CodeResult {
  expires_in: number
  resend_after: number
  code_length: number
}

interface RegisterResult {
  account_uid: number
  next_step: string
  message: string
}

const username = ref('')
const email = ref('')
const code = ref('')
const password = ref('')
const confirmation = ref('')
const showPassword = ref(false)
const showConfirmation = ref(false)
const countdown = ref(0)
const notice = ref('')
const error = ref('')
const sendingCode = ref(false)
const submitting = ref(false)
let timer: number | undefined

const canSendCode = computed(() => /.+@.+\..+/.test(email.value) && countdown.value === 0 && !sendingCode.value)

function startCountdown(seconds: number) {
  if (timer)
    window.clearInterval(timer)
  countdown.value = Math.max(1, seconds || 60)
  timer = window.setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0 && timer) {
      window.clearInterval(timer)
      timer = undefined
    }
  }, 1000)
}

async function sendCode() {
  error.value = ''
  notice.value = ''
  if (!/.+@.+\..+/.test(email.value)) {
    error.value = '请先填写正确的邮箱地址。'
    return
  }

  sendingCode.value = true
  try {
    const response = await api.post<ApiEnvelope<CodeResult>>('/v1/auth/register/email-code', {
      email: email.value.trim(),
    })
    startCountdown(response.data.data.resend_after)
    notice.value = '验证码已发送，请检查邮箱。'
  }
  catch (cause) {
    error.value = apiErrorMessage(cause, '验证码发送失败，请稍后重试。')
  }
  finally {
    sendingCode.value = false
  }
}

async function submit() {
  error.value = ''
  notice.value = ''
  if (!username.value.trim() || !email.value.trim() || !code.value.trim()) {
    error.value = '请完整填写用户名、邮箱和验证码。'
    return
  }
  if (password.value.length < 8) {
    error.value = '密码至少需要 8 个字符。'
    return
  }
  if (password.value !== confirmation.value) {
    error.value = '两次输入的密码不一致。'
    return
  }

  submitting.value = true
  try {
    const response = await api.post<ApiEnvelope<RegisterResult>>('/v1/auth/register', {
      username: username.value.trim(),
      email: email.value.trim(),
      email_code: code.value.trim(),
      password: password.value,
      confirm_password: confirmation.value,
    })
    notice.value = response.data.data.message || '账号创建成功，请先进入游戏创建角色后再登录商城。'
  }
  catch (cause) {
    error.value = apiErrorMessage(cause, '注册失败，请稍后重试。')
  }
  finally {
    submitting.value = false
  }
}

onUnmounted(() => {
  if (timer)
    window.clearInterval(timer)
})
</script>

<template>
  <div class="auth-page">
    <header class="auth-header">
      <RouterLink to="/" class="auth-brand">
        <span class="auth-brand__mark">A</span>
        <span><strong>Aemeath</strong><small>原神交易市场</small></span>
      </RouterLink>
      <RouterLink to="/login" class="auth-back"><ArrowLeft /> 返回登录</RouterLink>
    </header>

    <main class="auth-main">
      <section class="auth-visual">
        <div class="auth-visual__content">
          <span class="auth-visual__eyebrow"><Sparkles /> AEMEATH ACCOUNT</span>
          <h1>创建游戏账号<br>开始你的交易旅程</h1>
          <p>商城注册创建的是 HK4E SDK 游戏账号，登录游戏与登录商城使用同一套账号体系。</p>
        </div>
        <div class="auth-steps">
          <div class="auth-step"><span>1</span><div><strong>验证邮箱</strong><small>接收 SDK 邮箱验证码</small></div></div>
          <div class="auth-step"><span>2</span><div><strong>创建账号</strong><small>设置用户名和安全密码</small></div></div>
          <div class="auth-step"><span>3</span><div><strong>进入游戏</strong><small>创建角色后即可登录商城</small></div></div>
        </div>
      </section>

      <section class="auth-card">
        <div class="auth-card__head">
          <span class="auth-card__icon"><UserRound /></span>
          <div><p>新用户注册</p><h2>创建 Aemeath 账号</h2></div>
        </div>

        <form class="auth-form" @submit.prevent="submit">
          <p v-if="error" class="auth-notice error">{{ error }}</p>
          <p v-if="notice" class="auth-notice">{{ notice }}</p>

          <label class="auth-field">
            <span>用户名</span>
            <div class="auth-input"><UserRound /><input v-model="username" autocomplete="username" maxlength="32" placeholder="4–32 位字母、数字或 _ -"></div>
          </label>

          <label class="auth-field">
            <span>邮箱</span>
            <div class="auth-input"><Mail /><input v-model="email" autocomplete="email" type="email" placeholder="用于验证与找回密码"></div>
          </label>

          <label class="auth-field">
            <span>邮箱验证码</span>
            <div class="auth-code-row">
              <div class="auth-input"><ShieldCheck /><input v-model="code" inputmode="numeric" maxlength="8" placeholder="输入邮箱验证码"></div>
              <button class="auth-code-button" type="button" :disabled="!canSendCode" @click="sendCode">{{ sendingCode ? '发送中...' : (countdown > 0 ? `${countdown}s 后重发` : '发送验证码') }}</button>
            </div>
          </label>

          <label class="auth-field">
            <span>密码</span>
            <div class="auth-input">
              <ShieldCheck />
              <input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" maxlength="72" placeholder="至少 8 个字符">
              <button class="auth-password-toggle" type="button" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" /><Eye v-else /></button>
            </div>
          </label>

          <label class="auth-field">
            <span>确认密码</span>
            <div class="auth-input">
              <CheckCircle2 />
              <input v-model="confirmation" :type="showConfirmation ? 'text' : 'password'" autocomplete="new-password" maxlength="72" placeholder="再次输入密码">
              <button class="auth-password-toggle" type="button" @click="showConfirmation = !showConfirmation"><EyeOff v-if="showConfirmation" /><Eye v-else /></button>
            </div>
          </label>

          <div class="auth-password-rules">
            <span><CheckCircle2 /> 至少 8 个字符</span>
            <span><CheckCircle2 /> 两次密码必须一致</span>
          </div>

          <button class="auth-submit" type="submit" :disabled="submitting">{{ submitting ? '创建中...' : '创建游戏账号' }} <ArrowRight v-if="!submitting" /></button>
          <p class="auth-helper">已经有账号？<RouterLink to="/login">立即登录</RouterLink></p>
        </form>
      </section>
    </main>

    <footer class="auth-footer">© 2026 Aemeath 原神交易市场</footer>
  </div>
</template>
