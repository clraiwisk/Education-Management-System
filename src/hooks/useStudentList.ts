// import { computed, onMounted, ref, shallowRef } from 'vue';
import api from '@/api';

export function useStudentList() {
  const search = ref<SdtSearch>({ stu_name: "", stu_cls_id: 0, stu_qualification: 0, begin: 0, pageSize: 12, currentPage: 1 })
  const studentList = shallowRef<StudentModel[]>([])
  const totalN = ref<number>(0)

  const studentAllList = async () => {
    const { list, total } = await api.student.getList(search.value)
    studentList.value = list
    totalN.value = total
  }

  const currentPage = computed({
    get(): number { return search.value.currentPage },
    set(value: number) {
      search.value.currentPage = value
      search.value.begin = (value - 1) * search.value.pageSize
      studentAllList()
    }
  })
  const allClass = shallowRef<ClassModel[]>([])
  const getAllClass = async () => { allClass.value = await api.cls.getClass() }
  onMounted(() => {
    studentAllList()
    getAllClass()
  })

  return { studentAllList, studentList, currentPage, search, allClass, totalN }
}