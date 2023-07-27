import { arr2tree } from "@/utils/common.js"
// import { shallowRef, computed, onMounted } from 'vue'
import api from '@/api';
// 自定义了一个hook（负责请求和更新所有的系统功能以及将功能由线性转成树型）

export function useFuncList() {
  //存储从 API 获取到的所有系统功能列表
  const allFunc = shallowRef<Func[]>([])

  //一个计算属性，用于将 allFunc 中的功能列表转换为树形结构的数据，
  //以符合 el-tree 组件的要求。这个树形结构的根节点名为 "root"，并且功能的父子关系通过 func_id 和 func_fid 来建立
  const allFuncTree = computed<FuncNode[]>(() => [{           // el-tree需要的树形数据
    func_id: 0, func_name: 'root', func_fid: -1, func_key: '',
    children: arr2tree(allFunc.value, 'func_id', 'func_fid')
  }])

  //从 api 模块获取所有系统功能列表
  const loadAllFunc = async () => allFunc.value = await api.func.getAll();
  onMounted(loadAllFunc)

  return { allFunc, allFuncTree, loadAllFunc }
}