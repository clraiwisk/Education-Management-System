import type { App } from 'vue'
import * as user from './user'
import * as func from './func'
import * as staff from './staff'
import * as cls from './class'
import * as role from './role'
import * as clsr from './classroom'
import * as student from './student'


export const api = {
  install: (app: App) => {
    app.config.globalProperties.$api = { user, func, staff, cls, role, clsr, student }
  }
}

export default { user, func, staff, cls, role, clsr, student }