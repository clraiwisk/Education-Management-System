import { defineStore } from 'pinia'
import { shallowRef, computed } from 'vue'
import { arr2tree } from '@/utils/common.js'
import api from '@/api'

export const useDashboardStore = defineStore(
  'dashboard',
  () => {
    const menuList = shallowRef<Func[]>([])
    const menuTree = computed<FuncNode[]>(() => arr2tree(menuList.value, 'func_id', 'func_fid'))
    const getMenu = async () => menuList.value = await api.user.getMenu()

    const dictionary = shallowRef<Dictionary[]>([])
    const getDictionary = async () => { dictionary.value = await api.user.dictionary() }

    return { menuList, menuTree, getMenu, getDictionary, dictionary }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        { key: 'test', storage: sessionStorage }
      ]
    }
  }
)