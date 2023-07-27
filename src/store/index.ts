import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import { useDashboardStore } from './dashboard'
import { useRoleStore } from './role'
import type { App } from 'vue'

const pinia = createPinia()

//状态持久化
pinia.use(piniaPersist)

const appStore: any = {}

export const store = {
  install: function (app: App) {
    app.use(pinia)
    appStore.dashboard = useDashboardStore()
    appStore.role = useRoleStore()
  }
}

export default appStore
