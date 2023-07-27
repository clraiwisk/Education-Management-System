import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: () => import('@/pages/Login/Login.vue') },
  { path: '/home', name: 'home', component: () => import('@/pages/Home/Home.vue'), children: [] }
  // { path: '/func', component: () => import('@/views/Func/Func.vue')}
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
// @ts-ignore
router.beforeEach(async (to, from, next) => {
  // 第一次进入home、已经进了home点了刷新按钮
  // @ts-ignore
  if (/^\/home/.test(to.path) && !router.isInit) {
    await store.dashboard.getMenu()
    store.dashboard.menuList.filter((item: Func) => item.func_key).forEach((item: Func) => {
      const name = item.func_key.slice(0, 1).toUpperCase() + item.func_key.slice(1)
      router.addRoute('home',{
        path: item.func_key,
        name: item.func_key,
        component: () => import(`@/views/${name}/${name}.vue`)
      }) 
    })
    // @ts-ignore
    router.isInit = true
    next({ ...to, replace: true })
  } else next()
})

export default router
