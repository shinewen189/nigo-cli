import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/view/home.vue'),
    meta: {
      isLogin: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
