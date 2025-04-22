import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      children: [
        {
          path: '/business',
          component: () => import('@/views/business/index.vue'),
          children: [
            {
              path: '/business/detail',
              component: () => import('@/views/business/main/Detail.vue'),
            },
            {
              path: '/business/query',
              component: () => import('@/views/business/main/Query.vue'),
            },
            {
              path: '/business/show',
              component: () => import('@/views/business/main/Show.vue'),
            },
          ],
        },
        {
          path: '/production',
          component: () => import('@/views/production/index.vue'),
          children: [
            {
              path: '/production/detail',
              component: () => import('@/views/production/main/Detail.vue'),
            },
            {
              path: '/production/query',
              component: () => import('@/views/production/main/Query.vue'),
            },
          ],
        },
      ],
    },
  ],
})

export default router
