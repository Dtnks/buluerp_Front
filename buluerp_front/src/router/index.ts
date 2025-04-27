import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      children: [
        {
          path: '/admin',
          component: () => import('@/views/admin/index.vue'),
        },
        {
          path: '/personCenter',
          component: () => import('@/views/person/index.vue'),
          children: [
            {
              path: '/personCenter/information',
              component: () => import('@/views/person/main/Information.vue'),
            },
            {
              path: '/personCenter/custom',
              component: () => import('@/views/person/main/Custom.vue'),
            },
            {
              path: '/personCenter/manufacturers',
              component: () => import('@/views/person/main/Manufacturers.vue'),
            },
          ],
        },
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
            {
              path: '/production/material',
              component: () => import('@/views/production/main/Material.vue'),
            },
          ],
        },
        {
          path: '/PMcenter',
          component: () => import('@/views/PMcenter/index.vue'),
          children: [
            {
              path: '/PMcenter/inventory',
              component: () => import('@/views/PMcenter/inventory/index.vue'),
              children: [
                {
                  path: '/PMcenter/inventory/query',
                  component: () => import('@/views/PMcenter/inventory/main/Query.vue'),
                },
                {
                  path: '/PMcenter/inventory/list',
                  component: () => import('@/views/PMcenter/inventory/main/List.vue'),
                },
              ],
            },
            {
              path: '/PMcenter/procurement',
              component: () => import('@/views/PMcenter/procurement/index.vue'),
              children: [
                {
                  path: '/PMcenter/procurement/plan',
                  component: () => import('@/views/PMcenter/procurement/main/Plan.vue'),
                },
                {
                  path: '/PMcenter/procurement/list',
                  component: () => import('@/views/PMcenter/procurement/main/List.vue'),
                },
              ],
            },
            {
              path: '/PMcenter/produce',
              component: () => import('@/views/PMcenter/produce/index.vue'),
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
      redirect: '/login',
      path: '',
    },
  ],
})

export default router
