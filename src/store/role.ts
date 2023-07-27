import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import api from '@/api'

export const useRoleStore = defineStore(
  'role',
  () => {
    const list = shallowRef<Role[]>([])
    const init = async () => {
      list.value = await api.role.getAll()
    }
    const addRole = async (model: Role) => {
      await api.role.addRole(model)
      list.value = await api.role.getAll()
    }
    const updateRole = async (model: Role) => {
      await api.role.updateRole(model)
      list.value = await api.role.getAll()
    }
    const remove = async (id: number) => {
      await api.role.remove(id)
      list.value = await api.role.getAll()
    }

    return { list, init, addRole, updateRole, remove }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        { key: 'role', storage: sessionStorage }
      ]
    }
  }
)