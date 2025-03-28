import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/',
    redirect: (to) => {
      const userStore = useUserStore()
      return userStore.userRole === 'Admin' ? '/dashboard' : '/sales'
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../components/Dashboard.vue'),
    meta: { requiresAuth: true, roles: ['Admin'] },
    children: [
      {
        path: 'twtth',
        name: 'TWTTH',
        component: () => import('../components/dashboard/TWTTH.vue'), // 修改這裡
        meta: { requiresAuth: true, roles: ['Admin'] },
      },
      // {
      //   path: 'hscn',
      //   name: 'HSCN',
      //   component: () => import('../components/dashboard/CustomerAnalysis_HSCN.vue')
      // },
      // {
      //   path: 'hskh',
      //   name: 'HSKH',
      //   component: () => import('../components/dashboard/CustomerAnalysis_HSKH.vue')
      // }
    ],
  },
  {
    path: '/invdata',
    name: 'InvData',
    component: () => import('../components/InvData.vue'),
    meta: { requiresAuth: true, roles: ['Admin'] },
  },
  {
    path: '/customer',
    name: 'Customer',
    component: () => import('../components/Customer.vue'),
    meta: { requiresAuth: true, roles: ['Admin', 'Sales'] },
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../components/Sales.vue'),
    meta: { requiresAuth: true, roles: ['Admin'] },
  },
  {
    path: '/saleslog',
    name: 'SalesLog',
    component: () => import('../components/SalesLog.vue'),
    meta: { requiresAuth: true, roles: ['Admin', 'Sales'] },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 導航守衛
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 檢查本地存儲中的登入狀態
  const savedUser = localStorage.getItem('user')
  if (savedUser && !userStore.loginStatus) {
    const userData = JSON.parse(savedUser)
    userStore.$patch({
      user: userData,
      loginStatus: true,
    })
  }

  // 如果前往登入頁面且已登入，重定向到首頁
  if (to.path === '/login' && userStore.isLoggedIn) {
    next('/')
    return
  }

  // 不需要驗證的路由直接放行
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  // 未登入導向登入頁
  if (!userStore.isLoggedIn) {
    next('/login')
    return
  }

  // 檢查角色權限
  if (to.meta.roles && !to.meta.roles.includes(userStore.userRole)) {
    alert('無權限訪問此頁面')
    // next(from.path)
    next('/saleslog')
    return
  }

  // 如果是非管理員訪問根路徑,自動跳轉到 saleslog 頁面
  if (to.path === '/' && userStore.userRole !== 'Admin') {
    next('/saleslog')
    return
  }

  next()
})

export default router
