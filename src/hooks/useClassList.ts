// import { computed, onMounted, ref, shallowRef } from 'vue';
import api from '@/api';

export function useClassList() {
  const search = ref<ClassSearch>({ cls_name: '', cls_dic_id_major: 0, cls_status: 0, begin: 0, pageSize: 5, currentPage: 1 })
  const classList = shallowRef<ClassModel[]>([])
  const staffList = shallowRef<StaffModel[]>([])
  const totalN = ref<number>(0)
  const classroomList = shallowRef<Classroom[]>([])
  const allRoom = shallowRef<roomModel[]>([])

  //创建响应式的 currentPage 计算属性
  const currentPage = computed({
    get(): number { return search.value.currentPage },
    set(value: number) {
      search.value.currentPage = value
      search.value.begin = (value - 1) * search.value.pageSize
      classAllList()
    }
  })

  //从 api 模块获取所有教室列表
  const getAllRoom = async () => {
    allRoom.value = await api.clsr.allClassroom()
  }
  //从 api 模块获取符合搜索条件的班级列表和总班级数量
  const classAllList = async () => {
    const { list, total } = await api.cls.getList(search.value)
    classList.value = list
    totalN.value = total
  }
  //从 api 模块获取员工列表
  const staffAllList = async () => {
    const { list } = await api.staff.getList({ stf_name: '', stf_category: 0, begin: 0, pageSize: 1000, currentPage: 1 })
    staffList.value = list
  }

  //从 api 模块获取教室列表
  const loadClassroomList = async () => { classroomList.value = await api.cls.getClsr() }

  onMounted(() => {
    classAllList()
    loadClassroomList()
    staffAllList()
    getAllRoom()
  })

  return { search, classList, totalN, classAllList, currentPage, classroomList, staffList, allRoom, getAllRoom }
}