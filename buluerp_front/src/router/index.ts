import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/main',
      name: 'Main',
      component: () => import('@/views/layout/index.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/main/Login.vue'),
    },
    {
      redirect: '/login',
      path: '',
    },
  ],
})

export default router
