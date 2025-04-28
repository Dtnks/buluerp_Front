import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/main',
      component: () => import('@/views/layout/index.vue'),
    },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      redirect: '/login',
      path: '',
    },
  ],
})

export default router
