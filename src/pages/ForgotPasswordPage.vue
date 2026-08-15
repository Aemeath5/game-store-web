<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Mail, ShieldCheck, Sparkles } from 'lucide-vue-next'
import { api } from '@/lib/http'
import type { ApiEnvelope } from '@/lib/auth'
import { apiErrorMessage } from '@/lib/auth'
import '@/auth-pages.css'

interface CodeResult {
  expires_in: number
  resend_after: number
  code_length: number
  message: string
}

interface ResetResult {
  updated: boolean
  sessions_revoked: boolean
}

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
    error.value = '请先填写注册该游戏账号时使用的邮箱。'
    return
  }

  sendingCode.value = true
  try {
    const response = await api.post<ApiEnvelope<CodeResult>>('/auth/password/reset/email-code', {
      email: email.value.trim(),
    })
    startCountdown(response.data.data.resend_after)
    notice.value = response.data.data.message || '如果该邮箱已注册，验证码将发送到邮箱。'
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
  if (!email.value.trim() || !code.value.trim()) {
    error.value = '请填写邮箱和验证码。'
    return
  }
  if (password.value.length < 8) {
    error.value = '新密码至少需要 8 个字符。'
    return
  }
  if (password.value !== confirmation.value) {
    error.value = '两次输入的新密码不一致。'
    return
  }

  submitting.value = true
  try {
    const response = await api.post<ApiEnvelope<ResetResult>>('/auth/password/reset', {
      email: email.value.trim(),
      code: code.value.trim(),
      new_password: password.value,
      confirm_password: confirmation.value,
    })
    notice.value = response.data.data.sessions_revoked
      ? '密码已重置，旧登录会话已失效。现在可以使用新密码登录。'
      : '密码已重置，现在可以使用新密码登录。'
    code.value = ''
    password.value = ''
    confirmation.value = ''
  }
  catch (cause) {
    error.value = apiErrorMessage(cause, '密码重置失败，请稍后重试。')
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
          <span class="auth-visual__eyebrow"><Sparkles /> ACCOUNT RECOVERY</span>
          <h1>验证你的邮箱<br>重新掌控游戏账号</h1>
          <p>密码重置由 HK4E SDK 完成。验证注册邮箱后设置新密码，旧登录会话会被统一注销。</p>
        </div>
        <div class="auth-steps">
          <div class="auth-step"><span>1</span><div><strong>确认邮箱</strong><small>使用账号绑定的注册邮箱</small></div></div>
          <div class="auth-step"><span>2</span><div><strong>验证身份</strong><small>输入邮箱收到的验证码</small></div></div>
          <div class="auth-step"><span>3</span><div><strong>更新密码</strong><small>新密码立即用于游戏和商城登录</small></div></div>
        </div>
      </section>

      <section class="auth-card">
        <div class="auth-card__head">
          <span class="auth-card__icon"><KeyRound /></span>
          <div><p>账号安全</p><h2>忘记密码</h2></div>
        </div>

        <form class="auth-form" @submit.prevent="submit">
          <p v-if="error" class="auth-notice error">{{ error }}</p>
          <p v-if="notice" class="auth-notice">{{ notice }}</p>

          <label class="auth-field">
            <span>注册邮箱</span>
            <div class="auth-input"><Mail /><input v-model="email" autocomplete="email" type="email" placeholder="输入账号绑定邮箱"></div>
          </label>

          <label class="auth-field">
            <span>邮箱验证码</span>
            <div class="auth-code-row">
              <div class="auth-input"><ShieldCheck /><input v-model="code" inputmode="numeric" maxlength="8" placeholder="输入邮箱验证码"></div>
              <button class="auth-code-button" type="button" :disabled="!canSendCode" @click="sendCode">{{ sendingCode ? '发送中...' : (countdown > 0 ? `${countdown}s 后重发` : '发送验证码') }}</button>
            </div>
          </label>

          <label class="auth-field">
            <span>新密码</span>
            <div class="auth-input">
              <KeyRound />
              <input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" maxlength="72" placeholder="至少 8 个字符">
              <button class="auth-password-toggle" type="button" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" /><Eye v-else /></button>
            </div>
          </label>

          <label class="auth-field">
            <span>确认新密码</span>
            <div class="auth-input">
              <CheckCircle2 />
              <input v-model="confirmation" :type="showConfirmation ? 'text' : 'password'" autocomplete="new-password" maxlength="72" placeholder="再次输入新密码">
              <button class="auth-password-toggle" type="button" @click="showConfirmation = !showConfirmation"><EyeOff v-if="showConfirmation" /><Eye v-else /></button>
            </div>
          </label>

          <div class="auth-password-rules">
            <span><CheckCircle2 /> 重置后旧会话将失效</span>
            <span><CheckCircle2 /> 游戏与商城密码同步更新</span>
          </div>

          <button class="auth-submit" type="submit" :disabled="submitting">{{ submitting ? '重置中...' : '重置密码' }} <ArrowRight v-if="!submitting" /></button>
          <p class="auth-helper">想起密码了？<RouterLink to="/login">返回登录</RouterLink><span>·</span><RouterLink to="/register">注册新账号</RouterLink></p>
        </form>
      </section>
    </main>

    <footer class="auth-footer">© 2026 Aemeath 原神交易市场</footer>
  </div>
</template>
