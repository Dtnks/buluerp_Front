import { createRouter, createWebHistory } from 'vue-router'
import BlankComponent from './BlankComponent.vue'
import useTabStore from '@/stores/modules/tabs'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/main',
      name: 'Main',
      component: () => import('@/views/layout/index.vue'),
      children: [
        {
          path: '/UserInformation',
          name: 'UserInformation',
          component: BlankComponent,
        },
        {
          path: '/CustomQuery',
          name: 'CustomQuery',
          component: BlankComponent,
        },
        {
          path: '/Manufacturers',
          name: 'Manufacturers',
          component: BlankComponent,
        },
        {
          path: '/BusinessShow',
          name: 'BusinessShow',
          component: BlankComponent,
        },
        {
          path: '/BusinessQuery',
          name: 'BusinessQuery',
          component: BlankComponent,
        },
        {
          path: '/ProQuery',
          name: 'ProQuery',
          component: BlankComponent,
        },
        {
          path: '/ProMaterial',
          name: 'ProMaterial',
          component: BlankComponent,
        },
        {
          path: '/ProMaterialType',
          name: 'ProMaterialType',
          component: BlankComponent,
        },
        {
          path: '/DesignTable',
          name: 'DesignTable',
          component: BlankComponent,
        },
        {
          path: '/Admin',
          name: 'Admin',
          component: BlankComponent,
        },
        {
          path: '/Audit',
          name: 'Audit',
          component: BlankComponent,
        },
        {
          path: '/Role',
          name: 'Role',
          component: BlankComponent,
        },

        {
          path: '/Log',
          name: 'Log',
          component: BlankComponent,
        },
        {
          path: '/AuditPage',
          name: 'AuditPage',
          component: BlankComponent,
        },
        {
          path: '/PMInventoryList',
          name: 'PMInventoryList',
          component: BlankComponent,
        },
        {
          path: '/PMInventoryQuery',
          name: 'PMInventoryQuery',
          component: BlankComponent,
        },
        {
          path: '/PMProcurementQuery',
          name: 'PMProcurementQuery',
          component: BlankComponent,
        },
        {
          path: '/PMProcurementPlan',
          name: 'PMProcurementPlan',
          component: BlankComponent,
        },
        {
          path: '/PMProcurementOut',
          name: 'PMProcurementOut',
          component: BlankComponent,
        },
        {
          path: '/PMProduceArrange',
          name: 'PMProduceArrange',
          component: BlankComponent,
        },
        {
          path: '/PMProduceSchedule',
          name: 'PMProduceSchedule',
          component: BlankComponent,
        },
        {
          path: '/PMProducePackaging',
          name: 'PMProducePackaging',
          component: BlankComponent,
        },
        {
          path: '/:pathMatch(.*)*',
          name: '',
          component: BlankComponent,
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/main/Login.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/empty/empty.vue'),
    },
    {
      redirect: '/login',
      path: '',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('Authorization') // 从本地存储获取 token

  if (to.name === 'Login') {
    next()
  } else if (to.name === 'Main') {
    if (token) {
      // 有 token 时，允许进入主页面
      next()
    } else {
      // 无 token 时，重定向到登录页
      next({ name: 'Login' })
    }
  } else {
    if (token) {
      const store = useTabStore()
      console.log(store.path2Label)
      if (Object.keys(store.path2Label).includes(to.name as string)) {
        store.setEditValue(to.name)
        next()
      }
      next({ name: from.name })
      // 有 token 时，允许访问其他页面
    } else {
      // 无 token 时，重定向到登录页
      next({ name: 'Login' })
    }
  }
})
export default router
