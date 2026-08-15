import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import MarketPage from '@/pages/MarketPage.vue'
import ProductDetailPage from '@/pages/ProductDetailPage.vue'
import ListingsPage from '@/pages/ListingsPage.vue'
import OrdersPage from '@/pages/OrdersPage.vue'
import ChatPage from '@/pages/ChatPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage.vue'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage.vue'
import AdminProductsPage from '@/pages/admin/AdminProductsPage.vue'
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage.vue'
import AdminUsersPage from '@/pages/admin/AdminUsersPage.vue'
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage.vue'
import { getAccessToken } from '@/lib/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/forgot-password', component: ForgotPasswordPage },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', name: 'admin-dashboard', component: AdminDashboardPage },
        { path: 'products', name: 'admin-products', component: AdminProductsPage },
        { path: 'orders', name: 'admin-orders', component: AdminOrdersPage },
        { path: 'users', name: 'admin-users', component: AdminUsersPage },
        { path: 'settings', name: 'admin-settings', component: AdminSettingsPage },
      ],
    },
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'dashboard', component: DashboardPage },
        { path: 'market', name: 'market', component: MarketPage },
        { path: 'market/:id', name: 'product-detail', component: ProductDetailPage },
        { path: 'listings', name: 'listings', component: ListingsPage },
        { path: 'orders', name: 'orders', component: OrdersPage },
        { path: 'chat', name: 'chat', component: ChatPage },
        { path: 'profile', name: 'profile', component: ProfilePage },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const token = getAccessToken()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !token) {
    return {
      path: '/login',
      query: to.fullPath === '/' ? undefined : { redirect: to.fullPath },
      replace: true,
    }
  }

  if (to.path === '/login' && token)
    return { path: '/', replace: true }
})

export default router
