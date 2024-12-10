import { createRouter, createWebHistory } from 'vue-router'
// import Dashboard from '../components/Dashboard.vue'
// import InvData from '../components/InvData.vue'
// import Customer from '../components/Customer.vue'
import { useUserStore } from '../stores/user'

const routes = [
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 導航守衛
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

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
    next(from.path)
    return
  }

  // 如果是非管理員訪問根路徑,自動跳轉到 customer 頁面
  if (to.path === '/' && userStore.userRole !== 'Admin') {
    next('/customer')
    return
  }

  next()
})

export default router
