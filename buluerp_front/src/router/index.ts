import { createRouter, createWebHistory } from 'vue-router'
// localStorage.removeItem('Authorization')
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
  console.log(token)
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
      // 有 token 时，允许访问其他页面
      next()
    } else {
      // 无 token 时，重定向到登录页
      next({ name: 'Login' })
    }
  }
})
export default router
