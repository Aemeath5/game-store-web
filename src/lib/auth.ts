import axios from 'axios'

const persistentKey = 'aemeath_access_token'
const sessionKey = 'aemeath_session_access_token'

export interface AuthUser {
  id: number
  sdk_account_uid: number
  game_uid: number
  nickname: string
  avatar: string
  role: string
  status: string
  star_coin_balance?: number | null
  genesis_star_balance?: number | null
}

export interface ApiEnvelope<T> {
  ok: boolean
  data: T
}

export function getAccessToken() {
  return sessionStorage.getItem(sessionKey) || localStorage.getItem(persistentKey) || ''
}

export function saveAccessToken(token: string, remember: boolean) {
  localStorage.removeItem(persistentKey)
  sessionStorage.removeItem(sessionKey)
  if (remember)
    localStorage.setItem(persistentKey, token)
  else
    sessionStorage.setItem(sessionKey, token)
}

export function clearAccessToken() {
  localStorage.removeItem(persistentKey)
  sessionStorage.removeItem(sessionKey)
}

export function apiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error))
    return fallback

  const message = error.response?.data?.error?.message
  if (typeof message === 'string' && message.trim())
    return message

  if (error.code === 'ECONNABORTED')
    return '请求超时，请稍后重试。'

  if (!error.response)
    return '无法连接商城服务，请确认后端已启动。'

  return fallback
}
