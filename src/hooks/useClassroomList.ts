import { onMounted, shallowRef } from 'vue';
import api from '@/api';

export function useClassroomList() {
  //存储从 API 获取到的所有房间列表
  const allRoom = shallowRef<roomModel[]>([])
  //从 api 模块获取所有教室列表
  const getAllRoom = async () => {
    allRoom.value = await api.clsr.allClassroom()
  }
  onMounted(getAllRoom)
  return { allRoom }
}