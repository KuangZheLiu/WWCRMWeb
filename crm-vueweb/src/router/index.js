import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import InvData from '../components/InvData.vue'
import Customer from '../components/Customer.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/invdata',
    name: 'InvData',
    component: InvData
  },
  {
    path: '/customer',
    name: 'Customer',
    component: Customer
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
