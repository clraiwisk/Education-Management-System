// import { computed, onMounted, ref, shallowRef } from 'vue';
import api from '@/api';
// import store from '@/store'
// import { storeToRefs } from 'pinia'


export function useStaffList() {
  const search = ref<StaffSearch>({ stf_name: '', stf_category: 0, begin: 0, pageSize: 5, currentPage: 1 })
  //存储从 API 获取到的员工列表
  const staffList = shallowRef<StaffModel[]>([])
  //存储员工总数
  const totalN = ref<number>(0)
  const { dictionary } = storeToRefs(store.dashboard)

  //计算属性算页面
  const currentPage = computed({
    get(): number { return search.value.currentPage },
    set(value: number) {
      search.value.currentPage = value
      search.value.begin = (value - 1) * search.value.pageSize
      staffAllList()
    }
  })

  //从 api 模块获取符合搜索条件的员工列表和总员工数量
  const staffAllList = async () => {
    const { list, total } = await api.staff.getList(search.value)
    totalN.value = total
    staffList.value = list
  }

  onMounted(staffAllList)

  return { search, staffList, totalN, staffAllList, currentPage, dictionary }
}