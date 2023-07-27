// import { useRouter } from 'vue-router'
// import { ref, Ref, computed } from 'vue'
import api from '@/api'
// import store from '@/store'
// import { storeToRefs } from 'pinia'

export const useSysuser = () => {
  // @ts-ignore
  const { dictionary } = storeToRefs(store.dashboard)
  const list: Ref<Sysuser[]> = ref([])
  const total: Ref<number> = ref(5)
  const currentPage = computed({
    get(): number {
      return search.value.currentPage;
    },
    set(value) {
      search.value.currentPage = value;
      search.value.begin = (value - 1) * search.value.pageSize;
      getData();
    },
  });

  const search: Ref<SysuserSearch> = ref({ role_id: -1, user_name: '', begin: 0, pageSize: 5, currentPage: 1 })

  const getData = async () => {
    // @ts-ignore
    const { list: newList, total: newTotal } = await api.user.list(search.value);
    list.value = newList;
    list.value.forEach((item: SysuserDivide) => item = {...item, visibleTooltip: false});
    total.value = newTotal;
  }

  const router = useRouter()
  const goBack = (): void => {
    router.back()
  }

  return { goBack, getData, currentPage, search, list, total }
}