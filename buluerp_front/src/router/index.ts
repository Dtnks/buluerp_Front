import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      children: [
        {
          path: '/orders',
          component: () => import('@/views/orders/index.vue'),
          children: [
            {
              path: '/orders/detail',
              component: () => import('@/views/orders/main/Detail.vue'),
            },
            {
              path: '/orders/customQuery',
              component: () => import('@/views/orders/main/CustomQuery.vue'),
            },
            {
              path: '/orders/show',
              component: () => import('@/views/orders/main/Show.vue'),
            },
            {
              path: '/orders/ProdQuery',
              component: () => import('@/views/orders/main/ProdQuery.vue'),
            },
          ],
        },
        {
          path: '/personCenter',
          component: () => import('@/views/person/index.vue'),
        },
        {
          path: '/admin',
          component: () => import('@/views/admin/index.vue'),
          children: [
            {
              path: '/admin/manage',
              component: () => import('@/views/admin/main/Manage.vue'),
            },
            {
              path: '/admin/authorization',
              component: () => import('@/views/admin/main/Authorization.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/register',
      component: () => import('@/views/register/index.vue'),
    },
    {
      redirect: '/login',
      path: '',
    },
  ],
})

export default router
